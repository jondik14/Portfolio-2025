import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "My Journey – Luke Niccol",
  description: "Blog and reflections on design, research, and product.",
};

export default function MyJourneyPage() {
  const posts = getAllPosts();

  return (
    <div className="blog-container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
      <h1 className="page-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
        My Journey
      </h1>
      <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)", marginBottom: "var(--space-10)" }}>
        Reflections on design, research, and building products.
      </p>

      <ul style={{ listStyle: "none" }}>
        {posts.map((post) => (
          <li
            key={post.slug}
            style={{
              marginBottom: "var(--space-8)",
              paddingBottom: "var(--space-8)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <Link href={`/my-journey/${post.slug}`}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "var(--text-2xl)",
                  marginBottom: "var(--space-2)",
                  color: "var(--text-primary)",
                }}
              >
                {post.title}
              </h2>
            </Link>
            <time
              style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", display: "block", marginBottom: "var(--space-2)" }}
              dateTime={post.date}
            >
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {post.excerpt}
            </p>
            <Link
              href={`/my-journey/${post.slug}`}
              style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent)", marginTop: "var(--space-2)", display: "inline-block" }}
            >
              Read more →
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)" }}>No posts yet. Check back soon.</p>
      )}
    </div>
  );
}
