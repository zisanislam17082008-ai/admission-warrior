
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    gemini: !!process.env.GEMINI_API_KEY
  });
}
