import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ReTether. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="hover:underline">이용약관</Link>
          <Link href="#" className="hover:underline">개인정보처리방침</Link>
          <Link href="#" className="hover:underline">Twitter</Link>
        </nav>
      </div>
    </footer>
  );
}



