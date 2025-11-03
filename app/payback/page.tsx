"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Exchange = {
  id: string;
  name: string;
  slug: string;
};

export default function PaybackPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [exchangeSlug, setExchangeSlug] = useState<string>("");
  const [uid, setUid] = useState("");
  const [volume, setVolume] = useState<string>("");
  const [currency, setCurrency] = useState<"KRW" | "USD" | "USDT">("KRW");
  const [result, setResult] = useState<{ estimated: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/exchanges")
      .then((r) => r.json())
      .then((data) => {
        setExchanges(data);
        if (data?.length) setExchangeSlug(data[0].slug);
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/payback/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeSlug, uid, volume: Number(volume), currency }),
      });
      const data = await res.json();
      setResult({ estimated: data.estimated, currency: data.currency });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">페이백 테스트</h2>
      <form onSubmit={onSubmit} className="grid gap-6 max-w-xl">
        <div className="grid gap-2">
          <Label>거래소</Label>
          <Select value={exchangeSlug} onValueChange={setExchangeSlug}>
            <SelectTrigger>
              <SelectValue placeholder="거래소 선택" />
            </SelectTrigger>
            <SelectContent>
              {exchanges.map((ex) => (
                <SelectItem key={ex.id} value={ex.slug}>{ex.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>UID</Label>
          <Input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="거래소 UID" required />
        </div>
        <div className="grid gap-2">
          <Label>거래량</Label>
          <Input type="number" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="예: 100000" required />
        </div>
        <div className="grid gap-2">
          <Label>통화</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KRW">KRW</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "계산 중..." : "예상 페이백 계산"}
        </Button>
      </form>

      {result && (
        <div className="mt-8 rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">예상 페이백</div>
          <div className="text-3xl font-bold">{result.estimated.toLocaleString()} {result.currency}</div>
        </div>
      )}
    </section>
  );
}



