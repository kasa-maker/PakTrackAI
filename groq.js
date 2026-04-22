async function askGroq(trackingData) {
  const isChat = trackingData.userMessage;

  const systemPrompt = `You are a Pakistan Post tracking CHATBOT (not a conversational assistant).

  CRITICAL RULES - NEVER BREAK THESE:
  1. NEVER ask questions back to the user (no "How can I help?", "Would you like...?", etc.)
  2. NEVER offer further assistance (no "Let me know if...", "Feel free to ask...", "Is there anything else...?")
  3. NEVER say "I'm here to help" or similar filler phrases
  4. ALWAYS give direct, final answers only
  5. Keep responses short, factual, and system-like
  6. End with a statement, NEVER with a question
  7. You are a DISPLAY SYSTEM, not a conversation partner

  Language: Match user's language (English user = English reply, Urdu/roman Urdu user = Urdu reply)`;

  const userPrompt = isChat
    ? `You are a Pakistan Post Tracking chatbot. User said: "${trackingData.userMessage}"

    Respond in 1-2 lines in Roman Urdu or English (match user's language).
    - If greeting (hello, hi, salam, walaikum): Reply "Walaikum Assalam! Main Pakistan Post Tracker hoon. Apna tracking number type karein (jaise B2533044)."
    - If asking how to use: Reply "Apna tracking number type karein, main parcel ki location aur delivery time bataunga."
    - If asking about service: Reply briefly about Pakistan Post tracking.
    NO questions. NO offers to help. Just direct answer.`
    : `You are a Pakistan Post parcel TRACKING DISPLAY SYSTEM.

       TRACKING DATA:
       ${JSON.stringify(trackingData, null, 2)}

       OUTPUT FORMAT (EXACT - no deviations):

       <strong>📦 Tracking Details:</strong>
       • <strong>ID:</strong> ${trackingData.tracking_number}
       • <strong>Current Location:</strong> ${trackingData.destination_info?.city || "Unknown"}
       • <strong>Status:</strong> ${trackingData.status_detail || trackingData.status}
       • <strong>Origin:</strong> ${trackingData.origin_info?.city || "Unknown"}
       • <strong>Dispatch Date:</strong> ${trackingData.tracking_detail?.tracking_info?.[trackingData.tracking_detail.tracking_info.length - 1]?.date?.split('T')[0] || "Unknown"}
       • <strong>Expected Delivery:</strong> ${trackingData.estimated_delivery_date ? new Date(trackingData.estimated_delivery_date).toLocaleDateString() : "Calculating..."}
       • <strong>Weight:</strong> ${trackingData.weight || "N/A"}

       <strong>📍 Recent Activity:</strong>
       ${trackingData.tracking_detail?.tracking_info?.length > 0 ?
         trackingData.tracking_detail.tracking_info.slice(0, 4).map(e =>
           `• ${e.date.split('T')[0]} - ${e.status} (${e.location})`
         ).join('<br/>')
         : "• No tracking events available."}

       RULES:
       - Output ONLY the bullet points above
       -  intro like "Here is your tracking info"
       -  closing like "Let me know if you need help"
       - NO questions EVER
       - Just display the data, nothing else`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (response.status === 429) {
      return "Bohat zyada requests ho gayi, 1 minute baad dobara try karein.";
    }

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq error:", errData);
      return "Groq se response nahi mila, dobara try karein.";
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      return "Groq se response nahi mila, dobara try karein.";
    }
  } catch (error) {
    console.error("Groq fetch error:", error);
    return "Network error, internet connection check karein.";
  }
}
