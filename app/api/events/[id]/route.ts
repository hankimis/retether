export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  exchangeId: z.string().min(1).optional(),
  periodStart: z.string().datetime().nullable().optional(),
  periodEnd: z.string().datetime().nullable().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  link: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
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
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id } = await params;
  const d = parsed.data;
  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...("title" in d ? { title: d.title } : {}),
      ...("description" in d ? { description: d.description } : {}),
      ...("exchangeId" in d ? { exchangeId: d.exchangeId } : {}),
      ...("periodStart" in d ? { periodStart: d.periodStart ? new Date(d.periodStart) : null } : {}),
      ...("periodEnd" in d ? { periodEnd: d.periodEnd ? new Date(d.periodEnd) : null } : {}),
      ...("bannerUrl" in d ? { bannerUrl: d.bannerUrl ?? null } : {}),
      ...("link" in d ? { link: d.link ?? null } : {}),
      ...("isActive" in d ? { isActive: d.isActive } : {}),
    },
  });
  return NextResponse.json(updated);
}


