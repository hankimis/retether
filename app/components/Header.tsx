"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "홈" },
  { href: "/exchanges", label: "제휴거래소" },
  { href: "/events", label: "이벤트" },
  { href: "/payback", label: "페이백 테스트" },
  { href: "/about", label: "소개" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-semibold text-xl">
          ReTether
        </Link>
        <nav className="hidden gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "text-sm font-medium transition-colors hover:text-foreground/80 " +
                (pathname === item.href ? "text-foreground" : "text-foreground/60")
              }
            >
              {item.label}
            </Link>
          ))}
          {(role === "ADMIN" || role === "OPERATOR") && (
            <Link
              href="/admin"
              className={
                "text-sm font-medium transition-colors hover:text-foreground/80 " +
                (pathname?.startsWith("/admin") ? "text-foreground" : "text-foreground/60")
              }
            >
              관리자
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">{session.user?.email}</span>
              {(role === "ADMIN" || role === "OPERATOR") && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">관리자</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth/signin">로그인</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}



