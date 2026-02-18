import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllSlugs, markdownToHtml } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} – Luke Niccol`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);

  return (
    <article className="blog-container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
      <Link
        href="/my-journey"
        style={{ fontSize: "var(--text-sm)", color: "var(--accent)", marginBottom: "var(--space-6)", display: "inline-block" }}
      >
        ← My Journey
      </Link>
      <header style={{ marginBottom: "var(--space-8)" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "var(--text-4xl)",
            marginBottom: "var(--space-2)",
            color: "var(--text-primary)",
          }}
        >
          {post.title}
        </h1>
        <time
          style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
          dateTime={post.date}
        >
          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </time>
      </header>
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
