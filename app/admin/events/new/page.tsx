"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [exchanges, setExchanges] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    exchangeId: "",
    periodStart: "",
    periodEnd: "",
    bannerUrl: "",
    link: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/exchanges")
      .then((r) => r.json())
      .then((data) => setExchanges(data));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          periodStart: form.periodStart ? new Date(form.periodStart).toISOString() : null,
          periodEnd: form.periodEnd ? new Date(form.periodEnd).toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("failed");
      router.push("/admin/events");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">이벤트 등록</h2>
      <form onSubmit={onSubmit} className="grid max-w-2xl gap-4">
        <div className="grid gap-2">
          <Label>제목</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>설명</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>거래소</Label>
          <Select value={form.exchangeId} onValueChange={(v) => setForm({ ...form, exchangeId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {exchanges.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>시작일</Label>
            <Input type="datetime-local" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>종료일</Label>
            <Input type="datetime-local" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>배너 URL</Label>
          <Input value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>참여 링크</Label>
          <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <Label>활성</Label>
        </div>
        <Button type="submit" disabled={loading}>{loading ? "저장 중..." : "저장"}</Button>
      </form>
    </div>
  );
}



