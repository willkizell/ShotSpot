import { Header } from "@/components/layout/Header";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { getMarketplaceCoaches } from "@/lib/coaches/query";
import Link from "next/link";

export default async function MarketplacePage() {
  const coaches = await getMarketplaceCoaches();
  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <Header />

      {/* Hero — two column */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x-2 lg:divide-black">
            {/* Left: find a coach */}
            <div className="py-12 lg:pr-12 flex flex-col justify-center">
              <p
                className="text-xs uppercase tracking-widest text-black/40 mb-4"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                Are you an athlete?
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl tracking-tight leading-none mb-5"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                FIND YOUR THROWS <span className="text-[#007B6F]">COACH</span>
              </h1>
              <p className="text-base text-black/70 max-w-md mb-8">
                Browse qualified coaches for shot put, discus, hammer, and javelin.
                Real coaching. Real delivery. 
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/athlete-signup"
                  className="border-2 border-black bg-black text-[#D7D7D7] px-6 py-3 text-sm font-semibold hover:bg-[#007B6F] hover:border-[#007B6F] transition-colors"
                >
                  Find a Coach
                </Link>
                <Link
                  href="#coaches"
                  className="border-2 border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
                >
                  Browse Coaches
                </Link>
              </div>
            </div>

            {/* Right: become a coach */}
            <div className="py-12 lg:pl-12 flex flex-col justify-center border-t-2 border-black lg:border-t-0">
              <p
                className="text-xs uppercase tracking-widest text-black/40 mb-4"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                Are you a coach?
              </p>
              <h2
                className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl tracking-tight leading-none mb-5 whitespace-nowrap"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                BUILD YOUR REMOTE <span className="text-[#007B6F]">ROSTER</span>
              </h2>
              <p className="text-base text-black/70 max-w-md mb-8">
                Set up your profile, set your prices, and get paid. Training plans, video
                review, and messaging — all in one place.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/coach-signup"
                  className="border-2 border-black bg-black text-[#D7D7D7] px-6 py-3 text-sm font-semibold hover:bg-[#007B6F] hover:border-[#007B6F] transition-colors"
                >
                  Become a Coach
                </Link>
                <Link
                  href="/coach-signup"
                  className="border-2 border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace */}
      <div id="coaches">
        <MarketplaceContent coaches={coaches} />
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            <span className="text-black">SHOT</span>
            <span className="text-[#007B6F]">SPOT</span>
          </span>
          <p className="text-xs text-black/40">
            The throws coaching marketplace. Shot put, discus, hammer, javelin.
          </p>
        </div>
      </footer>
    </div>
  );
}
