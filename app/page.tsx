export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#D7D7D7]">
      <div className="border-2 border-black p-12 max-w-lg w-full mx-4">
        <h1
          className="text-6xl tracking-tight mb-2"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          SHOTSPOT
        </h1>
        <div className="w-12 h-1 bg-[#007B6F] mb-6" />
        <p className="text-lg text-black/70">
          Throws coaching marketplace. Coming soon.
        </p>
        <p className="mt-8 text-sm font-mono text-black/40">
          Phase 1 — Foundation
        </p>
      </div>
    </main>
  );
}
