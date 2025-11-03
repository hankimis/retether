import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminExchangesPage() {
  const exchanges = await safeQuery(
    () => prisma.exchange.findMany({ orderBy: [{ order: "desc" }, { createdAt: "desc" }] }),
    []
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">거래소 관리</h2>
        <Button asChild>
          <Link href="/admin/exchanges/new">등록</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">이름</th>
              <th className="p-3 text-left">슬러그</th>
              <th className="p-3 text-left">페이백율</th>
              <th className="p-3 text-left">활성</th>
              <th className="p-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((ex) => (
              <tr key={ex.id} className="border-t">
                <td className="p-3">{ex.name}</td>
                <td className="p-3">{ex.slug}</td>
                <td className="p-3">{ex.paybackRate}%</td>
                <td className="p-3">{ex.isActive ? "Y" : "N"}</td>
                <td className="p-3 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/exchanges/${ex.id}`}>수정</Link>
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


