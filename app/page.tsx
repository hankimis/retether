import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">ReTether — Link Smarter. Earn Better.</h1>
        <p className="mt-4 text-muted-foreground">
          제휴 거래소 페이백 관리와 셀퍼럴 리워드를 한번에. 내 페이백을 빠르게 확인하세요.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/payback">내 페이백 확인하기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/exchanges">제휴거래소 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
