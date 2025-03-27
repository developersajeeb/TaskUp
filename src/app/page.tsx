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
    return <div className="bg-[#ffffffca] dark:bg-[#121212e8] w-full h-screen z-[60]"><CommonLoader /></div>;
  }

  return <></>;
};

export default Home;
