export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a
              href="/"
              className="group flex items-center gap-2 text-lg font-semibold"
            >
              <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-bold uppercase text-primary shadow-sm group-hover:bg-primary/15 transition-colors">
                Devhoc
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                Labs
              </span>
              <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground group-hover:border-primary/40">
                Beta
              </span>
            </a>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Community-driven Q&A, long-form posts, and runnable snippets —
              learn together and build better software.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.02c0 4.429 2.867 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.954 0-1.093.39-1.988 1.03-2.688-.103-.254-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.85-2.338 4.698-4.566 4.946.359.31.678.923.678 1.861 0 1.343-.012 2.426-.012 2.756 0 .268.18.58.688.482A10.026 10.026 0 0022 12.02C22 6.484 17.523 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3c-2.5 0-4.5 2.3-3.9 4.7A12.94 12.94 0 013 4s-4 9 5 13a13 13 0 01-8 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                aria-label="Discord"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M20 3H4a1 1 0 00-1 1v14a1 1 0 001 1h12l2 2V4a1 1 0 00-1-1z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/ask" className="hover:text-foreground">
                  Ask a question
                </a>
              </li>
              <li>
                <a href="/posts" className="hover:text-foreground">
                  Explore posts
                </a>
              </li>
              <li>
                <a href="/snippets" className="hover:text-foreground">
                  Runnable snippets
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/teams" className="hover:text-foreground">
                  Teams
                </a>
              </li>
              <li>
                <a href="/mentors" className="hover:text-foreground">
                  Mentors
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-foreground">
                  Events
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Get updates</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe to our newsletter for new posts and community
              highlights.
            </p>

            <form
              action="/api/newsletter"
              method="post"
              className="mt-3 flex gap-2"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-3 text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} Devhoc — Built with community in
            mind.
          </div>
          <div className="mt-3 md:mt-0 flex items-center gap-4">
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/contact" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
