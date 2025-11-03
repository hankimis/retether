"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/app/admin/components/FileUploader";

type Exchange = {
  id: string;
  name: string;
  slug: string;
  paybackRate: number;
  partnerUrl: string | null;
  logoUrl: string | null;
  isNew: boolean;
  isActive: boolean;
  order: number;
};

export default function EditForm({ initial }: { initial: Exchange }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name,
    slug: initial.slug,
    paybackRate: initial.paybackRate,
    partnerUrl: initial.partnerUrl ?? "",
    logoUrl: initial.logoUrl ?? "",
    isNew: initial.isNew,
    isActive: initial.isActive,
    order: initial.order,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 빈 문자열을 null로 변환
      const payload: any = {
        name: form.name,
        slug: form.slug,
        paybackRate: Number(form.paybackRate),
        isNew: form.isNew,
        isActive: form.isActive,
        order: form.order,
      };
      
      if (form.partnerUrl && form.partnerUrl.trim() !== "") {
        payload.partnerUrl = form.partnerUrl;
      } else {
        payload.partnerUrl = null;
      }
      
      if (form.logoUrl && form.logoUrl.trim() !== "") {
        payload.logoUrl = form.logoUrl;
      } else {
        payload.logoUrl = null;
      }
      
      const res = await fetch(`/api/exchanges/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error?.fieldErrors 
          ? Object.entries(errorData.error.fieldErrors).map(([key, value]: [string, any]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join("\n")
          : errorData.error || `서버 오류 (${res.status})`;
        throw new Error(errorMessage);
      }
      
      router.push("/admin/exchanges");
      router.refresh();
    } catch (err: any) {
      console.error("거래소 수정 오류:", err);
      setError(err.message || "거래소 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">거래소 수정</h2>
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <strong>오류:</strong> {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid max-w-2xl gap-4">
        <div className="grid gap-2">
          <Label>이름</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>슬러그</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>페이백율(%)</Label>
          <Input type="number" value={form.paybackRate} onChange={(e) => setForm({ ...form, paybackRate: Number(e.target.value) })} />
        </div>
        <div className="grid gap-2">
          <Label>파트너 URL</Label>
          <Input value={form.partnerUrl} onChange={(e) => setForm({ ...form, partnerUrl: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>로고 URL</Label>
          <div className="flex gap-2">
            <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
            <FileUploader
              prefix="logos"
              onUploaded={(url) => setForm({ ...form, logoUrl: url })}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.isNew} onCheckedChange={(v) => setForm({ ...form, isNew: v })} />
            <Label>신규</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>활성</Label>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>정렬 순서</Label>
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "저장 중..." : "저장"}</Button>
          <Button type="button" variant="destructive" onClick={async () => {
            if (!confirm("삭제하시겠습니까?")) return;
            setLoading(true);
            try {
              const res = await fetch(`/api/exchanges/${initial.id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("failed");
              router.push("/admin/exchanges");
              router.refresh();
            } finally {
              setLoading(false);
            }
          }}>삭제</Button>
        </div>
      </form>
    </div>
  );
}


