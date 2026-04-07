/* ── DOM elements ── */
const chatForm   = document.getElementById("chatForm");
const userInput  = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn    = document.getElementById("sendBtn");

/* ── Cloudflare Worker endpoint ──
   Replace this URL with your deployed Cloudflare Worker URL.
   While testing locally you can also use the OpenAI API directly
   by setting CLOUDFLARE_WORKER_URL to:
   "https://api.openai.com/v1/chat/completions"
   and passing the Authorization header with your key from secrets.js.
*/
const CLOUDFLARE_WORKER_URL = "https://loreal-chatbot.quynhtruong1303.workers.dev/";

/* ── System prompt ── */
const SYSTEM_PROMPT = `You are a friendly and knowledgeable L'Oréal Beauty Advisor.
Your role is to help users discover L'Oréal products, understand ingredients, build
personalised skincare, haircare, makeup, and fragrance routines, and get expert
beauty tips rooted in the L'Oréal portfolio.

Guidelines:
- Only answer questions related to L'Oréal products, beauty routines, skincare,
  haircare, makeup, fragrance, and general beauty/wellness topics.
- If a user asks about something completely unrelated to beauty or L'Oréal
  (e.g. politics, sports, coding), politely decline and redirect them to beauty topics.
- Be warm, encouraging, and inclusive — beauty is for everyone.
- Keep responses concise (2–4 sentences) unless a detailed routine is requested.
- When recommending products, mention the L'Oréal brand or sub-brand (e.g. L'Oréal
  Paris, Lancôme, Kérastase, Maybelline, Garnier) where relevant.`;

/* ── Conversation history (sent to the API each turn) ── */
const conversationHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];

/* ── Helpers ── */
function appendMessage(role, text) {
  if (role === "ai") {
    const label = document.createElement("span");
    label.className = "msg-label";
    label.textContent = "L'Oréal Advisor";
    chatWindow.appendChild(label);
  }

  const bubble = document.createElement("div");
  bubble.className = `msg ${role}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;
}

/* ── Initial greeting ── */
appendMessage("ai", "Bonjour! I'm your L'Oréal Beauty Advisor. Ask me about skincare routines, product recommendations, haircare tips, or anything beauty-related. How can I help you today?");

/* ── Handle form submit ── */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  appendMessage("user", text);
  userInput.value = "";

  // Add to history
  conversationHistory.push({ role: "user", content: text });

  // Show thinking indicator
  setLoading(true);
  const thinkingBubble = appendMessage("ai", "Thinking…");
  thinkingBubble.classList.add("thinking");

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Replace thinking bubble with real reply
    thinkingBubble.textContent = reply;
    thinkingBubble.classList.remove("thinking");

    // Save assistant reply to history
    conversationHistory.push({ role: "assistant", content: reply });

  } catch (err) {
    thinkingBubble.textContent = "Sorry, I'm having trouble connecting right now. Please check your Cloudflare Worker URL and try again.";
    thinkingBubble.classList.remove("thinking");
    console.error(err);
  } finally {
    setLoading(false);
    userInput.focus();
  }
});
