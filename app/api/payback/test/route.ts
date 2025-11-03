export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const schema = z.object({
  exchangeSlug: z.string().min(1),
  uid: z.string().min(1),
  volume: z.number().nonnegative(),
  currency: z.enum(["KRW", "USD", "USDT"]).default("KRW"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { exchangeSlug, volume, currency } = parsed.data;

  const exchange = await prisma.exchange.findUnique({ where: { slug: exchangeSlug } });
  if (!exchange) {
    return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
  }

  const rule = await prisma.paybackRule.findUnique({ where: { exchangeId: exchange.id } });

  const commission = rule?.baseRate ?? 0.001; // default 0.1%
  const partnerShare = rule?.partnerShare ?? 0.7;
  const fx = currency === "KRW" ? 1350 : 1; // naive FX; real FX should come from a rates service

  const estimated = Math.floor(volume * commission * partnerShare * fx);

  return NextResponse.json({
    estimated,
    currency,
    params: { commission, partnerShare, fx },
  });
}


