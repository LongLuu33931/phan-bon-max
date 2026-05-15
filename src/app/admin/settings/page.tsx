import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Hệ thống</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Cấu hình website</h1>
      </div>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
