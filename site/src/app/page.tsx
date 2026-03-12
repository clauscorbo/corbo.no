import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-50">
          corbo.no
        </h1>
        <p className="max-w-md text-lg text-zinc-400">
          Data infrastructure &amp; analytics
        </p>

        <nav className="mt-4 flex flex-wrap justify-center gap-4">
          <a
            href="/dbt-docs/index.html"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
          >
            📊 dbt Documentation
          </a>
        </nav>
      </main>

      <footer className="absolute bottom-6 text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} corbo.no
      </footer>
    </div>
  );
}
