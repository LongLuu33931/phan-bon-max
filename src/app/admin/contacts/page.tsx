import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContactsTable } from "@/components/admin/contacts-table";
import { getContactMessagesForAdmin } from "@/lib/data";

export default async function AdminContactsPage() {
  const messages = await getContactMessagesForAdmin();
  const newContactCount = messages.filter((message) => message.status === "new").length;

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Khách hàng"
        title="Form liên hệ"
        badge={newContactCount > 0 ? (
          <span className="h-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
            {newContactCount} liên hệ mới cần xử lý
          </span>
        ) : null}
      />
      <ContactsTable messages={messages} />
    </AdminShell>
  );
}
