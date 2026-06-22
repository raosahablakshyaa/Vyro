import { type NextRequest } from "next/server";
import { insertLead, findWaitlistByEmail } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body  = await request.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const existing = await findWaitlistByEmail(email);
    if (existing) {
      return Response.json(
        { success: true, message: "You're already on the list!", alreadyExists: true }
      );
    }

    const ip   = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const lead = await insertLead({ type: "waitlist", email, ip });

    return Response.json(
      { success: true, message: "You're on the list!", id: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/waitlist]", err);
    return Response.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
