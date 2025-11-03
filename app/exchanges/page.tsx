export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ExchangesPage() {
  let exchanges: Array<{
    id: string;
    name: string;
    slug: string;
    paybackRate: number;
    logoUrl: string | null;
    partnerUrl: string | null;
  }> = [];
  
  try {
    exchanges = await safeQuery(
      () =>
        prisma.exchange.findMany({
          where: { isActive: true },
          orderBy: [{ order: "desc" }, { createdAt: "desc" }],
        }),
      []
    );
  } catch (error) {
    console.error("❌ 거래소 데이터 로드 실패:", error);
    exchanges = [];
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">제휴 거래소</h2>
      {exchanges.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          등록된 거래소가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exchanges.map((ex) => (
          <Card key={ex.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {ex.logoUrl ? (
                  <Image src={ex.logoUrl} width={28} height={28} alt={ex.name} className="rounded" />
                ) : null}
                {ex.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">페이백율</div>
              <div className="text-3xl font-bold">{ex.paybackRate}%</div>
            </CardContent>
            <CardFooter className="justify-end">
              {ex.partnerUrl ? (
                <Button asChild>
                  <a href={ex.partnerUrl} target="_blank" rel="noreferrer">참여하기</a>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/payback">테스트</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
    </section>
  );
}


