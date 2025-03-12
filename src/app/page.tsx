'use client';
import CommonLoader from "@/components/CommonLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session?.status, router]);

  if (session?.status === "loading") {
    return <CommonLoader />;
  }

  return <></>;
};

export default Home;
