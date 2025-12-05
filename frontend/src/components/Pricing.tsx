export default function Pricing() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Pricing</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team. Prices shown in Birr (Br).
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Free */}
            <div className="relative bg-background border border-border rounded-2xl p-6 text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Free
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold">Br 0</div>
                <div className="text-sm text-muted-foreground">
                  forever • ideal for personal use
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground text-left">
                <li>Unlimited public posts</li>
                <li>Community answers & comments</li>
                <li>Basic search</li>
              </ul>

              <div className="mt-6">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Get started
                </a>
              </div>
            </div>

            {/* Pro */}
            <div className="relative bg-linear-to-b from-white/60 to-background border border-border rounded-2xl p-6 shadow-lg transform md:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  Popular
                </span>
              </div>

              {/* Small subtle coming soon pill (not full blur) */}
              <div className="absolute top-3 right-3 pointer-events-none flex items-center">
                <div className="rounded-full bg-background/60 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                  Coming soon
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Pro
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-extrabold">Br 299</div>
                  <div className="text-sm text-muted-foreground">
                    per month • for professionals
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-muted-foreground text-left">
                  <li>Private posts & drafts</li>
                  <li>Advanced search & filtering</li>
                  <li>Runnable sandbox</li>
                  <li>Priority support</li>
                </ul>

                <div className="mt-6">
                  <button
                    disabled
                    aria-disabled
                    className="inline-flex items-center justify-center rounded-md bg-muted/10 px-6 py-2 text-sm font-semibold text-muted-foreground border border-border cursor-not-allowed"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="relative bg-background border border-border rounded-2xl p-6 text-center overflow-hidden">
              <div className="text-sm font-medium text-muted-foreground">
                Enterprise
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold">Custom</div>
                <div className="text-sm text-muted-foreground">
                  Contact sales • for teams
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground text-left">
                <li>Dedicated support & SLA</li>
                <li>SSO, audit logs, and governance</li>
                <li>Privileged admin tools</li>
              </ul>

              <div className="mt-6">
                <button
                  disabled
                  aria-disabled
                  className="inline-flex items-center justify-center w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/10 cursor-not-allowed"
                >
                  Contact sales
                </button>
              </div>

              {/* Small subtle 'Coming soon' pill (not full blur) */}
              <div className="absolute top-3 right-3 pointer-events-none flex items-center">
                <div className="rounded-full bg-background/60 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                  Coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
