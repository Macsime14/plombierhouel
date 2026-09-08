import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion — Administration",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background px-4 py-16 text-text">
      <div className="w-full max-w-sm">
        <h1 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">
          Houel Plombier
        </h1>
        <p className="mt-1 mb-6 text-sm text-text-muted">Espace d’administration</p>
        <LoginForm />
      </div>
    </div>
  );
}
