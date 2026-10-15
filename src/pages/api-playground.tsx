import { ProtectedPage } from "@/components/ProtectedPage";
import { PlaygroundView } from "@/components/PlaygroundView";

export default function ApiPlaygroundPage() {
  return (
    <ProtectedPage active="api-playground" title="API playground · Corridor Guard">
      <PlaygroundView />
    </ProtectedPage>
  );
}
