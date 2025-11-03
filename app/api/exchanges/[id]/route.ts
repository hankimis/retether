export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  paybackRate: z.number().int().nonnegative().optional(),
  logoUrl: z.string().url().nullable().optional(),
  partnerUrl: z.string().url().nullable().optional(),
  isNew: z.boolean().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = (session?.user as any)?.role ?? "USER";
  if (role !== "ADMIN" && role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  
  // 빈 문자열을 null로 변환 (URL 검증 전에 처리)
  const processedBody: any = { ...body };
  if ("logoUrl" in processedBody && (processedBody.logoUrl === "" || !processedBody.logoUrl)) {
    processedBody.logoUrl = null;
  }
  if ("partnerUrl" in processedBody && (processedBody.partnerUrl === "" || !processedBody.partnerUrl)) {
    processedBody.partnerUrl = null;
  }
  
  const parsed = updateSchema.safeParse(processedBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const updated = await prisma.exchange.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = (session?.user as any)?.role ?? "USER";
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.exchange.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


