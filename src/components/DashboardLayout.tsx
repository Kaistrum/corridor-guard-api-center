import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { Avatar, IconButton, ThemeToggle, cn } from "@kaistrum/stratum-ui";
import { useAuth } from "@/lib/auth";
import { Logo } from "./Logo";
import {
  BellIcon,
  BillingIcon,
  ChartIcon,
  ChevronDownIcon,
  CloseIcon,
  DocsIcon,
  KeyIcon,
  LogoutIcon,
  MenuIcon,
  PlanIcon,
  PlaygroundIcon,
  SettingsIcon,
} from "./icons";

interface NavItem {
  key: string;
  label: string;
  icon: (p: { width?: number; height?: number }) => ReactNode;
  /** Route to navigate to. Items without one are not yet implemented. */
  href?: string;
}

const MAIN_NAV: NavItem[] = [
  { key: "docs", label: "Docs", icon: DocsIcon, href: "/docs" },
  { key: "api-keys", label: "API keys", icon: KeyIcon, href: "/dashboard" },
  { key: "statistics", label: "Statistics", icon: ChartIcon, href: "/statistics" },
  {
    key: "api-playground",
    label: "API playground",
    icon: PlaygroundIcon,
    href: "/api-playground",
  },
];

const SETTINGS_NAV: NavItem[] = [
  { key: "billing", label: "Billing", icon: BillingIcon, href: "/billing" },
  { key: "manage-plan", label: "Manage plan", icon: PlanIcon, href: "/manage-plan" },
  { key: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
];

interface DashboardLayoutProps {
  /** `key` of the active nav item. */
  active: string;
  children: ReactNode;
}

export function DashboardLayout({ active, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close the user menu on outside click / Escape.
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setUserMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleNavClick = (item: NavItem) => {
    setMobileNavOpen(false);
    if (item.href && item.href !== router.pathname) router.push(item.href);
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.key === active;
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => handleNavClick(item)}
        disabled={!item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-radius-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent-faint font-medium text-accent"
            : "text-text-dim hover:bg-bg-surface hover:text-text",
          !item.href && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-text-dim",
        )}
      >
        <Icon width={18} height={18} />
        <span>{item.label}</span>
      </button>
    );
  };

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 px-4 py-6">
      <div className="mb-6 flex items-center justify-between px-2">
        <Logo />
        <IconButton
          aria-label="Close menu"
          variant="ghost"
          size="sm"
          icon={<CloseIcon width={18} height={18} />}
          className="lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      </div>

      <div className="flex flex-col gap-1">{MAIN_NAV.map(renderNavButton)}</div>

      <p className="mt-7 mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
        Settings
      </p>
      <div className="flex flex-col gap-1">{SETTINGS_NAV.map(renderNavButton)}</div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-overlay-bg"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-border bg-bg shadow-lg">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-nav-bg px-4 py-3 backdrop-blur sm:px-6">
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            size="sm"
            icon={<MenuIcon width={20} height={20} />}
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          />
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              size="sm"
              icon={<BellIcon width={19} height={19} />}
            />
            <ThemeToggle size="sm" />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-radius-full border border-border py-1 pl-1 pr-2 text-sm transition-colors hover:bg-bg-surface"
              >
                <Avatar size="sm" name={user?.name ?? "Account"} />
                <span className="hidden max-w-32 truncate font-medium sm:inline">
                  {user?.name ?? "Account"}
                </span>
                <ChevronDownIcon
                  width={16}
                  height={16}
                  className={cn(
                    "text-text-dim transition-transform",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-radius-md border border-border bg-drop-bg shadow-md"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-medium text-text">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-text-dim">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-text-dim transition-colors hover:bg-bg-surface hover:text-text"
                  >
                    <LogoutIcon width={17} height={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
