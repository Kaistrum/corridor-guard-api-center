import { ProtectedPage } from "@/components/ProtectedPage";
import { DocsView } from "@/components/DocsView";

export default function DocsPage() {
  return (
    <ProtectedPage active="docs" title="Docs · Corridor Guard">
      <DocsView />
    </ProtectedPage>
  );
}
