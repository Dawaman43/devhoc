export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
          {/* Left: copy */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Build, share, and learn —
              <span className="ml-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-teal-400">
                community-powered answers
              </span>
            </h1>

            <p className="mt-4 text-muted-foreground max-w-xl mx-auto md:mx-0">
              Hybrid Q&A, long-form posts, and runnable code snippets — all in
              one place. Ask a question, publish a guide, or run code right in
              your browser.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
              <a
                href="/ask"
                className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition transform hover:-translate-y-0.5"
                aria-label="Ask a question"
              >
                Ask a question
              </a>

              <a
                href="/posts"
                className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Explore posts"
              >
                Explore posts
              </a>
            </div>

            {/* Small community stats / trust badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2 max-w-md mx-auto md:mx-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 text-sm text-foreground/90">
                <strong className="font-semibold">10k+</strong>
                answers
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 text-sm text-foreground/90">
                <strong className="font-semibold">5k+</strong>
                runnable snippets
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 text-sm text-foreground/90">
                <strong className="font-semibold">2k+</strong>
                contributors
              </span>
            </div>
          </div>

          {/* Right: image / visual */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute -inset-y-6 -inset-x-8 bg-linear-to-br from-background via-background to-background rounded-3xl transform -skew-y-2 shadow-lg"
              aria-hidden="true"
            />
            <div className="relative max-w-md mx-auto md:mx-0">
              <img
                src="/assets/hero.png"
                alt="Illustration showing community, snippets and Q&A"
                className="w-full h-auto rounded-xl shadow-xl relative z-10"
              />
              {/* Small runnable snippet preview */}
              <div
                className="absolute right-4 bottom-4 w-64 bg-background/90 backdrop-blur-sm rounded-xl shadow-lg border border-border p-3 z-20"
                role="region"
                aria-label="Snippet preview"
              >
                <div className="text-xs text-muted-foreground mb-2">
                  Runnable snippet
                </div>
                <pre className="text-sm font-mono text-foreground leading-snug overflow-auto max-h-40">
                  {`// Try in the browser
  fetch('/api/example')
    .then(r => r.json())
    .then(data => console.log(data))`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
