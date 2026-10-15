import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  Switch,
  ThemeToggle,
} from "@kaistrum/stratum-ui";
import { useAuth } from "@/lib/auth";

export function SettingsView() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    product: true,
    usage: true,
    security: true,
  });

  const saveProfile = () => {
    // Demo only — no backend to persist to yet.
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-text-dim">
          Manage your profile, preferences, and account.
        </p>
      </header>

      {/* Profile */}
      <Card padding="spacious">
        <h2 className="font-semibold text-text">Profile</h2>
        <p className="mt-1 text-sm text-text-dim">
          This is how your name appears across the console.
        </p>
        <div className="mt-4 space-y-4">
          {saved && <Alert variant="success">Your profile has been saved.</Alert>}
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Button variant="primary" onClick={saveProfile}>
              Save changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="mt-6" padding="spacious">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-text">Appearance</h2>
            <p className="mt-1 text-sm text-text-dim">
              Switch between light and dark themes.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="mt-6" padding="spacious">
        <h2 className="font-semibold text-text">Notifications</h2>
        <div className="mt-4 space-y-4">
          <Switch
            checked={notifs.product}
            onChange={(e) => setNotifs((n) => ({ ...n, product: e.target.checked }))}
            label="Product updates"
            description="New endpoints, formats, and features."
          />
          <Switch
            checked={notifs.usage}
            onChange={(e) => setNotifs((n) => ({ ...n, usage: e.target.checked }))}
            label="Usage alerts"
            description="Warn me as a key approaches its limit."
          />
          <Switch
            checked={notifs.security}
            onChange={(e) => setNotifs((n) => ({ ...n, security: e.target.checked }))}
            label="Security alerts"
            description="Sign-ins from new devices and key changes."
          />
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="mt-6" padding="spacious">
        <h2 className="font-semibold text-danger">Account</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text">Sign out</p>
              <p className="text-sm text-text-dim">End your session on this device.</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
          <Divider />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text">Delete account</p>
              <p className="text-sm text-text-dim">
                Permanently remove your account and revoke all keys.
              </p>
            </div>
            <Button variant="danger" onClick={handleSignOut}>
              Delete account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
