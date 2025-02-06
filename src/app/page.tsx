'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home = () => {
  const session = useSession();

  if(session.status === "authenticated") {
    redirect(`/dashboard`);
  }

  return (
    <></>
  );
};

export default Home;
