import { ProtectedPage } from "@/components/ProtectedPage";
import { ApiKeysView } from "@/components/ApiKeysView";

export default function DashboardPage() {
  return (
    <ProtectedPage active="api-keys" title="API keys · Corridor Guard">
      <ApiKeysView />
    </ProtectedPage>
  );
}
