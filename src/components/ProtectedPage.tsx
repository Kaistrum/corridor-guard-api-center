import { useEffect, type ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "@kaistrum/stratum-ui";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "./DashboardLayout";

interface ProtectedPageProps {
  /** `key` of the active sidebar item. */
  active: string;
  /** Browser tab title. */
  title: string;
  children: ReactNode;
}

/**
 * Auth-guarded shell: shows a spinner until the session is known, redirects to
 * /login when signed out, otherwise renders inside the dashboard layout.
 */
export function ProtectedPage({ active, title, children }: ProtectedPageProps) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <DashboardLayout active={active}>{children}</DashboardLayout>
    </>
  );
}
