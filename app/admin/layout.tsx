import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = session?.user?.role ?? "USER";
  if (role !== "ADMIN" && role !== "OPERATOR") {
    redirect("/auth/signin");
  }
  
  const navItems = [
    { href: "/admin", label: "대시보드" },
    { href: "/admin/exchanges", label: "거래소 관리" },
    { href: "/admin/events", label: "이벤트 관리" },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}


