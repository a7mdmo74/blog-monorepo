export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
