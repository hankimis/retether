"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUploader({ onUploaded, prefix = "uploads" }: { onUploaded: (url: string, key: string) => void; prefix?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const key = `${prefix}/${Date.now()}-${file.name}`;
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, contentType: file.type || "application/octet-stream" }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "업로드 URL 생성 실패. AWS S3 설정을 확인하세요.");
      }
      
      const data = await res.json();
      
      if (!data.url) {
        throw new Error("업로드 URL을 받지 못했습니다. AWS S3 설정을 확인하세요.");
      }
      
      const uploadUrl: string = data.url;
      const putRes = await fetch(uploadUrl, { 
        method: "PUT", 
        body: file, 
        headers: { "Content-Type": file.type || "application/octet-stream" } 
      });
      
      if (!putRes.ok) {
        const errorText = await putRes.text().catch(() => "알 수 없는 오류");
        throw new Error(`S3 업로드 실패: ${errorText.substring(0, 100)}`);
      }
      
      const publicUrl = `https://${data.bucket}.s3.amazonaws.com/${key}`;
      onUploaded(publicUrl, key);
    } catch (err: any) {
      console.error("파일 업로드 오류:", err);
      setError(err.message || "파일 업로드에 실패했습니다.");
      alert(`파일 업로드 실패: ${err.message || "알 수 없는 오류"}\n\n로고 URL을 직접 입력하거나 AWS S3 설정을 확인하세요.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
      }} />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? "업로드 중..." : "파일 업로드"}
      </Button>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </>
  );
}


