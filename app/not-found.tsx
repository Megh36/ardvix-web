import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          {"// 404"}
        </p>

        <h1 className="font-sans font-medium text-5xl md:text-7xl leading-[0.95] tracking-tight">
          Signal lost.
        </h1>

        <p className="text-steel-mist text-lg md:text-xl mt-8 max-w-xl mx-auto leading-relaxed">
          That page doesn&apos;t exist. Try going home or booking an audit.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href="/"
            className="bg-copper text-obsidian font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/#book"
            className="border border-copper text-copper font-medium px-6 py-3 rounded-full hover:bg-copper/10 transition-colors"
          >
            Book an audit
          </Link>
        </div>
      </div>
    </section>
  );
}
