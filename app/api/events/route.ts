export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  exchangeId: z.string().min(1),
  periodStart: z.string().datetime().optional().nullable(),
  periodEnd: z.string().datetime().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  link: z.string().url().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    include: { exchange: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authConfig as any)) as any;
  const role = (session?.user as any)?.role ?? "USER";
  if (role !== "ADMIN" && role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const created = await prisma.event.create({
    data: {
      title: d.title,
      description: d.description,
      exchangeId: d.exchangeId,
      periodStart: d.periodStart ? new Date(d.periodStart) : null,
      periodEnd: d.periodEnd ? new Date(d.periodEnd) : null,
      bannerUrl: d.bannerUrl ?? null,
      link: d.link ?? null,
      isActive: d.isActive ?? true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}


