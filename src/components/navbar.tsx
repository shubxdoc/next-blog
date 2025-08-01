import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between container mx-auto px-3 h-16">
        <Link href="/" className="text-xl font-bold">
          BLOG.
        </Link>

        <span className="space-x-4">
          <SignedIn>
            <span className="flex items-center gap-4">
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </span>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant={"secondary"}>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </span>
      </div>
    </header>
  );
};
