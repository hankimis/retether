import { prisma } from "@/app/lib/prisma";
import { safeQuery } from "@/app/lib/db-safe";
import { notFound } from "next/navigation";
import EditEventForm from "./ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const ev = await safeQuery(() => prisma.event.findUnique({ where: { id: params.id } }), null);
  if (!ev) return notFound();
  const initial = {
    ...ev,
    periodStart: ev.periodStart ? ev.periodStart.toISOString() : null,
    periodEnd: ev.periodEnd ? ev.periodEnd.toISOString() : null,
  } as any;
  return <EditEventForm initial={initial} />;
}


