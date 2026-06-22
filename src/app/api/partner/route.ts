import { type NextRequest } from "next/server";
import { insertLead } from "@/lib/db";

const VALID_TYPES = [
  "Distributor","Retailer","Campus Ambassador",
  "Gym / Studio Partner","Esports Team","Content Creator","Investor",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name        = (body?.name    ?? "").trim();
    const email       = (body?.email   ?? "").trim().toLowerCase();
    const company     = (body?.company ?? "").trim();
    const website     = (body?.website ?? "").trim();
    const partnerType = (body?.type    ?? "").trim();
    const message     = (body?.message ?? "").trim();

    const errors: string[] = [];
    if (!name)                                               errors.push("Name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
    if (!company)                                            errors.push("Company / brand name is required.");
    if (!VALID_TYPES.includes(partnerType))                  errors.push("Please select a valid partnership type.");
    if (!message || message.length < 10)                     errors.push("Please tell us a bit about yourself (min 10 chars).");

    if (errors.length > 0) {
      return Response.json({ success: false, errors }, { status: 400 });
    }

    const ip   = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const lead = await insertLead({
      type: "partner", name, email, company,
      website: website || undefined, partnerType, message, ip,
    });

    return Response.json(
      { success: true, message: "Application received!", id: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/partner]", err);
    return Response.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
