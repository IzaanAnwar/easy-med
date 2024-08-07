import { loginSchema } from "@/lib/zod-schema/auth";
import { loginWithEmailAndPassword } from "@/supabase/auth";
import { createClient } from "@/supabase/utils/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  try {
    const parsedBody = loginSchema.parse(body);
    const user = await loginWithEmailAndPassword({
      email: parsedBody.email,
      password: parsedBody.password,
      supabase,
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const flattenedError = error.flatten();
      return NextResponse.json({ error: flattenedError }, { status: 400 });
    }

    return NextResponse.json(
      { error: error?.message ?? "An unknown error occurred" },
      {
        status: 500,
      }
    );
  }
}
