import { ProtectedPage } from "@/components/ProtectedPage";
import { StatisticsView } from "@/components/StatisticsView";

export default function StatisticsPage() {
  return (
    <ProtectedPage active="statistics" title="Statistics · Corridor Guard">
      <StatisticsView />
    </ProtectedPage>
  );
}
