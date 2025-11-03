"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // 로그인
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/",
        });

        console.log("로그인 결과:", result);

        if (result?.error) {
          console.error("로그인 오류:", result.error);
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (result?.ok) {
          router.push("/");
          router.refresh();
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        // 회원가입
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "회원가입에 실패했습니다.");
        } else {
          // 회원가입 후 자동 로그인
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError("회원가입은 완료되었지만 로그인에 실패했습니다. 다시 로그인해주세요.");
            setIsLogin(true);
          } else {
            router.push("/");
            router.refresh();
          }
        }
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "로그인" : "회원가입"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "이메일과 비밀번호로 로그인하세요"
              : "새 계정을 만드세요"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">이름 (선택사항)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "비밀번호 입력" : "최소 6자 이상"}
                required
                minLength={isLogin ? undefined : 6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "회원가입" : "로그인"} 하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

