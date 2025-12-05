export default function TrendingPosts() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Trending posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Popular questions and guides this week
            </p>
          </div>

          <a
            href="/posts/trending"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
            aria-label="View all trending posts"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/1"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="post-1-title"
            >
              <div className="md:flex md:items-start">
                <div className="md:shrink-0">
                  <img
                    src="/assets/thumb-hydration.png"
                    alt="Hydration errors thumbnail"
                    className="w-full h-40 md:h-28 object-cover md:w-36"
                  />
                </div>
                <div className="p-4">
                  <h3 id="post-1-title" className="text-lg font-semibold">
                    Fixing React hydration errors
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Common causes of hydration mismatch and practical fixes you
                    can apply.
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="/assets/avatar-1.jpg"
                          alt="Alex"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>Alex</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v8a2 2 0 002 2h2m10-12V6a4 4 0 00-4-4H11a4 4 0 00-4 4v2"
                          />
                        </svg>
                        <span>react</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10l4.553-2.276A2 2 0 0122 9.618V17a2 2 0 01-2 2H6a2 2 0 01-2-2V9.618a2 2 0 01.447-1.894L9 10m6 0v6"
                          />
                        </svg>{' '}
                        1.2k
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>{' '}
                        34
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </article>

          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/2"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="post-2-title"
            >
              <div className="md:flex md:items-start">
                <div className="md:shrink-0">
                  <img
                    src="/assets/thumb-testing.png"
                    alt="Testing guide thumbnail"
                    className="w-full h-40 md:h-28 object-cover md:w-36"
                  />
                </div>
                <div className="p-4">
                  <h3 id="post-2-title" className="text-lg font-semibold">
                    A pragmatic guide to testing
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A short walkthrough for reliable unit and integration tests
                    in TS projects.
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="/assets/avatar-2.jpg"
                          alt="Sam"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>Sam</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-muted/40 text-xs">
                          testing
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">980</span>
                      <span className="flex items-center gap-1">21</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </article>

          <article className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1">
            <a
              href="/posts/3"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-labelledby="post-3-title"
            >
              <div className="md:flex md:items-start">
                <div className="md:shrink-0">
                  <img
                    src="/assets/thumb-bundle.png"
                    alt="Bundle size thumbnail"
                    className="w-full h-40 md:h-28 object-cover md:w-36"
                  />
                </div>
                <div className="p-4">
                  <h3 id="post-3-title" className="text-lg font-semibold">
                    Optimizing bundle size
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Techniques and tools to keep your client bundle lean and
                    fast.
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="/assets/avatar-3.jpg"
                          alt="Taylor"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>Taylor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-muted/40 text-xs">
                          performance
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">2.1k</span>
                      <span className="flex items-center gap-1">58</span>
                    </div>
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
