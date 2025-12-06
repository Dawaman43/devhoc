import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getTrendingPosts } from '@/lib/api/search'

export default function TrendingPosts() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: () => getTrendingPosts(6),
  })

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

          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative bg-background border border-border rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-1" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1"
              >
                <Link
                  to="/posts/$postId"
                  params={{ postId: post.id }}
                  className="block p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{post.authorName || 'Anonymous'}</span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-muted/40 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        {post.views || 0} views
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                No trending posts yet. Be the first to create one!
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
