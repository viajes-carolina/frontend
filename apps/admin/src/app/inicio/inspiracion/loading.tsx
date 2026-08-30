import { FormSkeleton } from "@vc/ui";
import { AdminSectionLoading } from "../../../components/AdminSectionLoading";

export default function Loading() {
  return (
    <AdminSectionLoading>
      <FormSkeleton />
    </AdminSectionLoading>
  );
}
