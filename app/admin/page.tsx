export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [exchangesCount, eventsCount] = await Promise.all([
    safeQuery(() => prisma.exchange.count(), 0),
    safeQuery(() => prisma.event.count({ where: { isActive: true } }), 0),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>전체 거래소 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{exchangesCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>진행 이벤트 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{eventsCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>신규 등록 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>거래소 관리</CardTitle>
            <CardDescription>제휴 거래소를 등록하고 관리합니다</CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button asChild>
              <Link href="/admin/exchanges">거래소 목록</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/exchanges/new">새 거래소 등록</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>이벤트 관리</CardTitle>
            <CardDescription>거래소 이벤트를 등록하고 관리합니다</CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button asChild>
              <Link href="/admin/events">이벤트 목록</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/events/new">새 이벤트 등록</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


