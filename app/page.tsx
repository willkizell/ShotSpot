import { Header } from "@/components/layout/Header";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MOCK_COACHES, MOCK_FEATURED_COACH } from "@/lib/mock/coaches";
import Link from "next/link";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <Header />

      {/* Hero — two column */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x-2 lg:divide-black">
            {/* Left: headline */}
            <div className="py-12 lg:pr-12">
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl tracking-tight leading-none mb-5"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                FIND YOUR THROWS COACH
              </h1>
              <p className="text-base text-black/70 max-w-md mb-8">
                Browse qualified coaches for shot put, discus, hammer, and javelin.
                Real coaching. Real delivery. No middlemen.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/athlete-signup"
                  className="bg-black text-[#D7D7D7] px-5 py-2.5 text-sm font-semibold hover:bg-[#007B6F] transition-colors"
                >
                  Create free account
                </Link>
                <Link
                  href="#coaches"
                  className="border-2 border-black px-5 py-2.5 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
                >
                  Browse coaches
                </Link>
              </div>
            </div>

            {/* Right: coach with us CTA */}
            <div className="py-12 lg:pl-12 flex flex-col justify-center border-t-2 border-black lg:border-t-0">
              <p
                className="text-xs uppercase tracking-widest text-black/40 mb-4"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                Are you a coach?
              </p>
              <h2
                className="text-3xl xl:text-4xl tracking-tight leading-none mb-3"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                BUILD YOUR REMOTE
                <br />
                <span className="text-[#007B6F]">ROSTER HERE</span>
              </h2>
              <p className="text-sm text-black/70 mb-6 max-w-sm">
                Set up your profile, publish your offers, and get paid. Training plans,
                video review, and messaging — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/coach-signup"
                  className="border-2 border-black px-5 py-2.5 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors text-center"
                >
                  Join as a coach
                </Link>
                <div className="flex items-center gap-4 text-xs text-black/50">
                  <span>✓ Free to list</span>
                  <span>✓ You set your price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace */}
      <div id="coaches">
        <MarketplaceContent coaches={MOCK_COACHES} featuredCoach={MOCK_FEATURED_COACH} />
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
