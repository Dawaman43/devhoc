export default function SolvedProblems() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Solved problems</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recently accepted answers and canonical solutions
            </p>
          </div>

          <a
            href="/posts/solved"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
            aria-label="View all solved posts"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/10"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="solved-1-title"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 id="solved-1-title" className="text-lg font-semibold">
                    Why my SQL JOIN returns duplicate rows?
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Accepted
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Clear explanation showing GROUP BY, DISTINCT and proper join
                  keys. Includes example and final working query.
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/avatar-4.jpg"
                        alt="Jordan"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>Jordan</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-muted/40">
                      sql
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">1.5k views</span>
                    <span className="flex items-center gap-1">42 answers</span>
                  </div>
                </div>
              </div>
            </a>
          </article>

          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/11"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="solved-2-title"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 id="solved-2-title" className="text-lg font-semibold">
                    Fixing CORS for embedded sandboxes
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Accepted
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Step-by-step solution that configures headers correctly and
                  shows server + browser checks.
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/avatar-5.jpg"
                        alt="Riley"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>Riley</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-muted/40">
                      networking
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">820 views</span>
                    <span className="flex items-center gap-1">9 answers</span>
                  </div>
                </div>
              </div>
            </a>
          </article>

          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/12"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="solved-3-title"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 id="solved-3-title" className="text-lg font-semibold">
                    Preventing memory leaks in long-running Node processes
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Accepted
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Diagnose leaks, heap snapshots, and practical fixes including
                  proper event listener cleanup.
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/avatar-6.jpg"
                        alt="Casey"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>Casey</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-muted/40">
                      nodejs
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">2.4k views</span>
                    <span className="flex items-center gap-1">76 answers</span>
                  </div>
                </div>
              </div>
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
