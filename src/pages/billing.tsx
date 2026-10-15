import { ProtectedPage } from "@/components/ProtectedPage";
import { BillingView } from "@/components/BillingView";

export default function BillingPage() {
  return (
    <ProtectedPage active="billing" title="Billing · Corridor Guard">
      <BillingView />
    </ProtectedPage>
  );
}
