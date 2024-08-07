import { SupabaseClient } from "@supabase/supabase-js";

/**
 * function to signup with email and password using supabase
 * @param email
 * @param password
 * @param supabase - Supabase client
 * @returns user data
 * @throws error
 * @example const user = await signupWithEmailAndPassword({ email, password });
 */
export async function signupWithEmailAndPassword({
  email,
  password,
  supabase,
}: {
  email: string;
  password: string;
  supabase: SupabaseClient<any, "public", any>;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

/**
 * function to signup with google using supabase
 * @param supabase - Supabase client
 * @returns user data
 * @throws error
 * @example <button onClick={async () => await signupWithGoogle()}>Signup with Google</button>
 */
export async function signupWithGoogle({
  supabase,
}: {
  supabase: SupabaseClient<any, "public", any>;
}) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) {
    throw error;
  }
  return data;
}

/**
 * function to login with email and password using supabase
 * @param email
 * @param password
 * @param supabase - Supabase client
 * @returns user data
 * @throws error
 * @example const user = await loginWithEmailAndPassword({ email, password });
 */
export async function loginWithEmailAndPassword({
  email,
  password,
  supabase,
}: {
  email: string;
  password: string;
  supabase: SupabaseClient<any, "public", any>;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}
