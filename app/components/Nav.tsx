import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-name">
        Luke Niccol
      </Link>
      <div className="nav-links">
        <div className="nav-links-main">
          <Link href="/index.html#about" className="nav-link">
            About
          </Link>
          <Link href="/index.html#tools" className="nav-link">
            Tools
          </Link>
          <Link href="/index.html#work" className="nav-link">
            Work
          </Link>
          <Link href="/index.html#library" className="nav-link">
            Library
          </Link>
        </div>
        <div className="nav-links-separator"></div>
        <div className="nav-links-secondary">
          <Link href="/my-journey" className="nav-link">
            My Journal
          </Link>
          <Link href="/playground" className="nav-link nav-link-active">
            Playground
          </Link>
        </div>
      </div>
    </nav>
  );
}
