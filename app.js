const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Message show karne ka function
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", sender);
  avatar.textContent = sender === "bot" ? "PP" : "U";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = text;

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);

  // Auto scroll neeche
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing animation show karna
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot", "typing");
  typingDiv.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "bot");
  avatar.textContent = "PP";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = "<span></span><span></span><span></span>";

  typingDiv.appendChild(avatar);
  typingDiv.appendChild(bubble);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing animation hatana
function hideTyping() {
  const typingDiv = document.getElementById("typingIndicator");
  if (typingDiv) typingDiv.remove();
}

// Tracking number validate karna
function isValidTrackingNumber(input) {
  const cleaned = input.trim();
  // Pakistan Post tracking numbers usually 13 characters hote hain
  return cleaned.length >= 8 && cleaned.length <= 30;
}

// Main function - jab user message bheje
async function handleUserMessage() {
  const input = userInput.value.trim();

  if (!input) return;

  // User ka message show karo
  addMessage(input, "user");
  userInput.value = "";
  sendBtn.disabled = true;

  // Check karo kya user tracking number daal raha hai ya normal baat kar raha hai
const looksLikeTracking = /^[a-zA-Z0-9]{8,30}$/.test(input);

if (!looksLikeTracking) {
  // Normal chat - seedha Groq ko bhejo
  showTyping();
  try {
    const groqResponse = await askGroq({ userMessage: input });
    hideTyping();
    addMessage(groqResponse, "bot");
  } catch (err) {
    hideTyping();
    addMessage("Hello! Main Pakistan Post Tracker hoon. Apna tracking number type karein (jaise B2533044) aur main aapko parcel ki location bataunga.", "bot");
  }
  sendBtn.disabled = false;
  return;
}

  // Typing show karo
  showTyping();

  try {
    // Step 1: TrackingMore se data lao
    const trackingData = await trackParcel(input);

    if (!trackingData) {
      hideTyping();
      addMessage(
        "Tracking number ka koi data nahi mila. Yeh check karein:<br/>• Tracking number sahi hai?<br/>• Pakistan Post ne parcel register kiya hai?<br/>• Thoda wait karke dobara try karein.",
        "bot"
      );
      sendBtn.disabled = false;
      return;
    }

    // Step 2: Groq se friendly response lo
    const groqResponse = await askGroq(trackingData);

    hideTyping();

    // Add dummy data indicator
    let finalMessage = groqResponse;
    if (trackingData.is_dummy) {
      finalMessage = `<em style="color:#f59e0b;font-size:11px;">⚠️ Demo mode: Ye dummy data hai. Real data ke liye API key configure karein.</em><br/><br/>${groqResponse}`;
    }

    addMessage(finalMessage, "bot");

  } catch (error) {
    hideTyping();
    console.error("Error:", error);
    addMessage(
      "Kuch masla aa gaya. Internet connection check karein aur dobara try karein.",
      "bot"
    );
  }

  sendBtn.disabled = false;
}

// Send button click
sendBtn.addEventListener("click", handleUserMessage);

// Enter key press
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleUserMessage();
  }
});