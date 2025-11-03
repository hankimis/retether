export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { z } from "zod";

const exchangeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  paybackRate: z.number().int().nonnegative(),
  logoUrl: z.string().url().nullable().optional(),
  partnerUrl: z.string().url().nullable().optional(),
  isNew: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export async function GET() {
  const exchanges = await prisma.exchange.findMany({
    where: { isActive: true },
    orderBy: [{ order: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(exchanges);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = (session?.user as any)?.role ?? "USER";
  if (role !== "ADMIN" && role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  
  // 빈 문자열을 null로 변환 (URL 검증 전에 처리)
  const processedBody: any = {
    ...body,
    logoUrl: body.logoUrl === "" || !body.logoUrl ? null : body.logoUrl,
    partnerUrl: body.partnerUrl === "" || !body.partnerUrl ? null : body.partnerUrl,
  };
  
  const parsed = exchangeSchema.safeParse(processedBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const created = await prisma.exchange.create({ data });
  return NextResponse.json(created, { status: 201 });
}


