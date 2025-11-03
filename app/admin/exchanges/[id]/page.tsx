import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import { notFound } from "next/navigation";
import EditForm from "./ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditExchangePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ex = await safeQuery(() => prisma.exchange.findUnique({ where: { id } }), null);
  if (!ex) return notFound();
  return <EditForm initial={ex} />;
}


