import { ProtectedPage } from "@/components/ProtectedPage";
import { PlansView } from "@/components/PlansView";

export default function ManagePlanPage() {
  return (
    <ProtectedPage active="manage-plan" title="Manage plan · Corridor Guard">
      <PlansView />
    </ProtectedPage>
  );
}
