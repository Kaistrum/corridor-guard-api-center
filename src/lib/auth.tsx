import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  /** False during SSR / first hydration render, true once on the client. */
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "corridor-guard.session";

/* ── External session store (localStorage), read via useSyncExternalStore ──
 * This keeps auth state in sync across tabs, avoids setState-in-effect, and
 * hydrates cleanly (server snapshot is always null). */

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// Cache the parsed snapshot so useSyncExternalStore sees a stable reference
// until the underlying raw string actually changes.
let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function getSnapshot(): User | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as User) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return null;
}

// "Are we past hydration?" — false on the server snapshot, true on the client.
const noopSubscribe = () => () => {};

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const pretty = local
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return pretty || "Account Owner";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const login = useCallback(async (email: string) => {
    // Demo authentication: no backend yet — accept any valid-looking
    // credentials and derive a display name from the email.
    const nextUser: User = { name: nameFromEmail(email), email };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      /* ignore storage write failures */
    }
    emit();
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
