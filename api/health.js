export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    gemini: !!process.env.GEMINI_API_KEY
  });
}
