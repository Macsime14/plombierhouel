import type { Metadata } from "next";
import Image from "next/image";
import { getUtilisateur } from "@/lib/auth/dal";
import { deconnexion } from "@/lib/auth/actions";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getUtilisateur();

  return (
    <div className="min-h-full bg-background text-text">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-border bg-surface p-4 md:w-56 md:border-r md:border-b-0">
          <div className="mb-6 flex items-center gap-2.5 px-2">
            <Image
              src="/images/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 dark:hidden"
            />
            <Image
              src="/images/logo-dark.png"
              alt=""
              width={28}
              height={28}
              className="hidden h-7 w-7 shrink-0 dark:block"
            />
            <div className="leading-tight">
              <p className="font-heading text-base font-semibold">Houel Plombier</p>
              <p className="text-xs text-text-muted">Administration</p>
            </div>
          </div>
          <AdminNav />
          <div className="mt-6 border-t border-border pt-4">
            <p className="truncate px-2 text-xs text-text-muted" title={user.email}>
              {user.email}
            </p>
            <form action={deconnexion}>
              <button
                type="submit"
                className="mt-1 cursor-pointer px-2 text-xs text-text-muted underline-offset-2 hover:text-text hover:underline"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
