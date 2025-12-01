import Image from "next/image";
import Link from "next/link";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const CAMPUSES = [
  {
    slug: "atu-galway",
    short: "ATU Galway",
    name: "Atlantic Technological University",
    campus: "Dublin Road Campus",
    logo: "/ATU-Logo.png",
  },
  {
    slug: "nuig-galway",
    short: "University of Galway",
    name: "National University of Ireland, Galway",
    campus: "University Road Campus",
    logo: "/University_of_Galway_logo.png",
  },
];

export default function SelectCampusPage({ searchParams }: PageProps) {
  // Normalize the mode from the query string
  const raw = Array.isArray(searchParams?.type)
    ? searchParams?.type[0]
    : searchParams?.type;

  const type: "lost" | "found" | "report" =
    raw === "found" || raw === "report" ? raw : "lost";

  const subtitle =
    type === "lost"
      ? "Choose where you lost the item"
      : type === "found"
      ? "Choose where you found the item"
      : "Choose the campus where you want to report the item";

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col items-center justify-center">
        {/* Heading */}
        <header className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-800">
            Select Your Campus
          </h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
        </header>

        {/* Campus cards */}
        <section className="grid w-full gap-8 md:grid-cols-2">
          {CAMPUSES.map((c) => {
            const href = `/campus/${c.slug}/${type}`;

            // ✅ Correct CTA per mode
            const cta =
              type === "report"
                ? `Report item at ${c.short}`
                : type === "lost"
                ? `See lost items at ${c.short}`
                : `See found items at ${c.short}`;

            return (
              <article
                key={c.slug}
                className="group rounded-2xl bg-white p-8 sm:p-10 shadow-sm ring-1 ring-slate-200/70 
                           transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:ring-sky-400/60"
              >
                <div className="flex flex-col items-center text-center">
                  <Link href={href} prefetch={false} className="block" aria-label={`${cta}`}>
                    <div className="relative h-28 w-28 sm:h-32 sm:w-32 mb-6">
                      <Image
                        src={c.logo}
                        alt={`${c.short} logo`}
                        fill
                        className="object-contain rounded-xl"
                        sizes="(max-width: 768px) 112px, 128px"
                        priority
                      />
                    </div>
                  </Link>

                  <Link href={href} prefetch={false} className="block" aria-label={`${cta}`}>
                    <h3 className="text-2xl font-semibold text-slate-800 hover:text-sky-700 transition">
                      {c.short}
                    </h3>
                  </Link>

                  <p className="mt-2 text-sm text-slate-500">{c.name}</p>

                  <div className="mt-3 flex items-center gap-2 text-sky-700">
                    <span>📍</span>
                    <span className="text-sm">{c.campus}</span>
                  </div>

                  <hr className="my-8 w-full border-slate-200" />

                  <Link
                    href={href}
                    prefetch={false}
                    className="w-full rounded-full bg-sky-700/90 px-6 py-3.5 text-center text-white font-semibold
                               shadow-[0_6px_14px_rgba(2,24,43,0.15)] hover:bg-sky-600 transition
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
                  >
                    {cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
