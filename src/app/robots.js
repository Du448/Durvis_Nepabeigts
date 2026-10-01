import { SITE_URL } from "@/lib/site";

const DISALLOW = ["/api/", "/admin", "/krepselis", "/norai", "/paieska", "/*/krepselis", "/*/norai", "/*/paieska"];

/* AI assistants are named explicitly, so the shop is eligible to be read,
   cited and recommended by them. Each vendor runs separate bots for search
   (what answers cite), user-triggered fetches (when someone pastes a link or
   asks about the shop) and model training (what the model "knows" about the
   brand without searching) - all three are allowed on purpose: a small shop
   gains from being known, and has nothing behind the public pages to protect.
   A crawler obeys only its most specific group, so each one repeats the
   private paths. */
const AI_CRAWLERS = [
  // OpenAI / ChatGPT
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic / Claude
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / AI Overviews, Apple Intelligence, Microsoft Copilot (via Bingbot)
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  // Meta AI, Amazon (Alexa/Rufus), Mistral, DuckDuckGo Assist, You.com, Common Crawl (used by many models)
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "CCBot",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
