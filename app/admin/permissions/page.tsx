import { redirect } from "next/navigation";

export default function AdminPermissionsRedirect() {
  redirect('/internal/permissions');
}