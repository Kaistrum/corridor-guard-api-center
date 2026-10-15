import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@kaistrum/stratum-ui";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [ready, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Spinner />
    </div>
  );
}
