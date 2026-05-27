"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="bg-gray-900 p-4 text-white shadow-md md:p-6">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Logo */}
        <Link href="/" className="mb-4 text-2xl font-bold md:mb-0">
          Mystiq
        </Link>

        {/* Right Section */}
        {session ? (
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <span>Welcome, {user?.username || user?.email}</span>

            <Button onClick={() => signOut()} className="w-full bg-slate-100 text-black md:w-auto" variant="outline">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full bg-slate-100 text-black md:w-auto" variant="outline">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
