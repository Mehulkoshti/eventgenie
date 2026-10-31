import { NextRequest, NextResponse } from "next/server";
import { eventInputSchema } from "@/lib/schema";
import { buildDeterministicPlan } from "@/lib/plan-engine";
import { generateNarrative } from "@/lib/deepseek";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = eventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const plan = buildDeterministicPlan(parsed.data);

  const narrative = await generateNarrative({
    input: plan.input,
    budget: plan.budget,
    timeline: plan.timeline,
    vendors: plan.vendors,
    ideas: plan.ideas,
  });

  if (narrative) {
    plan.aiEnhanced = true;
    plan.aiNarrative = narrative;
  }

  return NextResponse.json(plan satisfies typeof plan);
}
