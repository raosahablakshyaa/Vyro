import { type NextRequest } from "next/server";
import { insertLead } from "@/lib/db";

const VALID_FLAVORS    = ["Original Gold","Arctic Blue","Berry Storm","Citrus Blast","Jungle Green","Cherry Red"];
const VALID_QUANTITIES = ["1","2","3","5","10","20+"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name     = (body?.name     ?? "").trim();
    const email    = (body?.email    ?? "").trim().toLowerCase();
    const phone    = (body?.phone    ?? "").trim();
    const city     = (body?.city     ?? "").trim();
    const flavor   = (body?.flavor   ?? "").trim();
    const quantity = (body?.quantity ?? "").trim();

    const errors: string[] = [];
    if (!name)                                               errors.push("Name is required.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
    if (!phone)                                              errors.push("Phone number is required.");
    if (!city)                                               errors.push("City is required.");
    if (!VALID_FLAVORS.includes(flavor))                     errors.push("Please select a valid flavour.");
    if (!VALID_QUANTITIES.includes(quantity))                errors.push("Please select a valid quantity.");

    if (errors.length > 0) {
      return Response.json({ success: false, errors }, { status: 400 });
    }

    const ip   = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const lead = await insertLead({ type: "preorder", name, email, phone, city, flavor, quantity, ip });

    return Response.json(
      { success: true, message: "Pre-order confirmed!", id: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/preorder]", err);
    return Response.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
