import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Hệ thống" title="Cấu hình website" />
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
