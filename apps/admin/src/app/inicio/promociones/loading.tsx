import { FormSkeleton, TableSkeleton } from "@vc/ui";
import { AdminSectionLoading } from "../../../components/AdminSectionLoading";

export default function Loading() {
  return (
    <AdminSectionLoading>
      <div className="space-y-8">
        <FormSkeleton />
        <TableSkeleton />
      </div>
    </AdminSectionLoading>
  );
}
