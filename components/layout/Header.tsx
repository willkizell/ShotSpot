import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { Logo } from "@/components/ui/Logo";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b-2 border-black bg-[#D7D7D7] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#007B6F] transition-colors">
            Find a coach
          </Link>
          <Link href="/coach-signup" className="hover:text-[#007B6F] transition-colors">
            Coach with us
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/athlete/dashboard"
                className="text-sm font-medium hover:text-[#007B6F] transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <button className="border-2 border-black px-3 py-1.5 text-xs font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium hover:text-[#007B6F] transition-colors hidden sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/athlete-signup"
                className="border-2 border-black px-3 py-1.5 text-xs font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
