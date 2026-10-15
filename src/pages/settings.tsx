import { ProtectedPage } from "@/components/ProtectedPage";
import { SettingsView } from "@/components/SettingsView";

export default function SettingsPage() {
  return (
    <ProtectedPage active="settings" title="Settings · Corridor Guard">
      <SettingsView />
    </ProtectedPage>
  );
}
