import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await safeQuery(
    () => prisma.event.findMany({ include: { exchange: true }, orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">이벤트 관리</h2>
        <Button asChild>
          <Link href="/admin/events/new">등록</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">제목</th>
              <th className="p-3 text-left">거래소</th>
              <th className="p-3 text-left">활성</th>
              <th className="p-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-t">
                <td className="p-3">{ev.title}</td>
                <td className="p-3">{ev.exchange.name}</td>
                <td className="p-3">{ev.isActive ? "Y" : "N"}</td>
                <td className="p-3 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/events/${ev.id}`}>수정</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


