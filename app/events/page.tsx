export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function EventsPage() {
  let events: Array<{
    id: string;
    title: string;
    description: string;
    bannerUrl: string | null;
    link: string | null;
    exchange: {
      name: string;
    };
  }> = [];
  
  try {
    events = await safeQuery(
      () =>
        prisma.event.findMany({
          where: { isActive: true },
          include: { exchange: true },
          orderBy: { createdAt: "desc" },
        }),
      []
    );
  } catch (error) {
    console.error("❌ 이벤트 데이터 로드 실패:", error);
    events = [];
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">이벤트</h2>
      {events.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          진행 중인 이벤트가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
          <Card key={ev.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{ev.title}</span>
                <span className="text-sm text-muted-foreground">{ev.exchange.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ev.bannerUrl ? (
                <Image src={ev.bannerUrl} alt={ev.title} width={600} height={240} className="rounded-md w-full h-auto" />
              ) : null}
              <p className="text-sm text-muted-foreground line-clamp-3">{ev.description}</p>
            </CardContent>
            <CardFooter className="justify-end">
              {ev.link ? (
                <Button asChild>
                  <a href={ev.link} target="_blank" rel="noreferrer">참여하기</a>
                </Button>
              ) : null}
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
    </section>
  );
}


