import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function chargeCredits(baseCost: number): Promise<{ success: boolean; error?: string; modelToUse: string }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized", modelToUse: "gpt-4o-mini" };

  // 1. Get their preferred model to calculate the multiplier
  const { data: settings } = await supabase
    .from("user_settings")
    .select("preferred_model, report_verbosity")
    .eq("user_id", user.id)
    .single();

  const model = settings?.preferred_model || "gpt-4o-mini";
  
  // 2. Calculate Multiplier
  let multiplier = 1;
  if (model.includes("4.1-mini")) multiplier = 2;
  if (model.includes("5-mini")) multiplier = 3;

  const finalCost = baseCost * multiplier;

  // 3. Deduct using the RPC we built earlier
  const { data: hasEnough, error } = await supabase.rpc('deduct_ai_credits', {
    deduction_amount: finalCost
  });

  if (error || !hasEnough) {
    return { success: false, error: "INSUFFICIENT_CREDITS", modelToUse: model };
  }

  // Success! We also return the model so your OpenAI call knows which engine to use
  return { success: true, modelToUse: model };
}