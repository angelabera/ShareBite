// ChatbotWidget.js
// Vanilla JS module that injects a floating chatbot into the page.
// Loads a small internal knowledge base and provides a friendly chat UI.

// Immediately-invoked async function to allow use of await at top level
(async function () {
  // Load CSS
  const cssUrl = new URL("./chatbot.css", import.meta.url);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl.href;
  document.head.appendChild(link);

  // Load knowledge base (JSON) next to this module
  const kbUrl = new URL("./ChatbotKnowledgeBase.json", import.meta.url);
  let KB = null;
  try {
    const res = await fetch(kbUrl.href, { cache: "default" });
    KB = await res.json();
  } catch (e) {
    console.error("ShareBot: failed to load knowledge base", e);
    KB = {
      greeting: "Hi! I'm ShareBot.",
      faqs: [],
      helpTopics: [],
      fallback:
        "That's a great question! I'm still learning. Please check our About or Contact page.",
    };
  }

  // Create container root
  const container = document.createElement("div");
  container.id = "sharebot-container";
  container.setAttribute("aria-live", "polite");
  document.body.appendChild(container);

  // Floating bubble button
  const bubble = document.createElement("button");
  bubble.id = "sharebot-bubble";
  bubble.title = "Open ShareBot chat";
  bubble.innerHTML = '<span class="sharebot-emoji">🍽️</span>';
  container.appendChild(bubble);

  // Chat window (hidden by default)
  const widget = document.createElement("div");
  widget.id = "sharebot-widget";
  widget.setAttribute("hidden", "");
  widget.innerHTML = `
    <header class="sharebot-header">
      <div class="sharebot-brand">
        <span class="sharebot-logo" aria-hidden="true">🍽️</span>
        <strong>ShareBot</strong>
      </div>
      <button class="sharebot-close" aria-label="Close chat">✕</button>
    </header>
    <main class="sharebot-main">
      <div class="sharebot-messages" id="sharebot-messages" role="log" aria-live="polite"></div>
      <div class="sharebot-quick" id="sharebot-quick"></div>
    </main>
    <form class="sharebot-input-area" id="sharebot-form">
      <input type="text" id="sharebot-input" placeholder="Type a question or choose a topic..." aria-label="Message" autocomplete="off" />
      <button type="submit" id="sharebot-send">Send</button>
    </form>
  `;
  container.appendChild(widget);

  const messagesEl = widget.querySelector("#sharebot-messages");
  const quickEl = widget.querySelector("#sharebot-quick");
  const form = widget.querySelector("#sharebot-form");
  const input = widget.querySelector("#sharebot-input");
  const closeBtn = widget.querySelector(".sharebot-close");

  // State
  let isOpen = false;
  let hasGreeted = false;

  // Utilities
  function appendMessage(role, html) {
    const wrapper = document.createElement("div");
    wrapper.className = `sharebot-message sharebot-${role}`;
    wrapper.innerHTML = `<div class="sharebot-bubble">${html}</div>`;
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function formatAnswer(text) {
    // Allow HTML from KB (includes <b>, <i>, <a> tags and line breaks)
    // Convert \n to <br> for proper line breaks
    return text.replace(/\n/g, "<br>");
  }

  // Simple matching: check keywords in lowercase query
  function findAnswer(query) {
    if (!query || !KB || !Array.isArray(KB.faqs)) return null;
    const q = query.toLowerCase().trim();

    // Exact/keyword matching
    for (const faq of KB.faqs) {
      if (faq.question && q.includes(faq.question.toLowerCase()))
        return faq.answer;
      if (Array.isArray(faq.keywords)) {
        for (const kw of faq.keywords) {
          if (kw && q.includes(kw.toLowerCase())) return faq.answer;
        }
      }
    }

    // Additional intent shortcuts for better matching
    if (q.includes("donate") || q.includes("donation") || q.includes("give")) {
      return KB.faqs.find((f) => f.id === "how_to_donate")?.answer || null;
    }
    if (q.includes("find") || q.includes("claim") || q.includes("get food")) {
      return KB.faqs.find((f) => f.id === "how_to_find")?.answer || null;
    }
    if (
      q.includes("register") ||
      q.includes("join") ||
      q.includes("sign up") ||
      q.includes("signup")
    ) {
      return KB.faqs.find((f) => f.id === "join_donor_ngo")?.answer || null;
    }
    if (
      q.includes("login") ||
      q.includes("auth") ||
      q.includes("sign in") ||
      q.includes("signin")
    ) {
      return KB.faqs.find((f) => f.id === "login_system")?.answer || null;
    }
    if (q.includes("list") || q.includes("listing") || q.includes("browse")) {
      return KB.faqs.find((f) => f.id === "see_listings")?.answer || null;
    }
    if (
      q.includes("feature") ||
      q.includes("capability") ||
      q.includes("what can")
    ) {
      return KB.faqs.find((f) => f.id === "features")?.answer || null;
    }
    if (q.includes("work") || q.includes("process") || q.includes("step")) {
      return KB.faqs.find((f) => f.id === "system_steps")?.answer || null;
    }
    if (q.includes("what is") || q.includes("about")) {
      return KB.faqs.find((f) => f.id === "about_sharebite")?.answer || null;
    }

    return null;
  }

  // Send user message and generate bot reply
  function handleQuery(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    appendMessage("user", escapeHtml(trimmed));
    input.value = "";

    // Attempt to find answer
    const answer = findAnswer(trimmed);
    if (answer) {
      // If response contains an anchor, allow it (from KB)
      appendMessage("bot", formatAnswer(answer));
    } else {
      // Fallback reply
      const fallback =
        KB.fallback ||
        "That's a great question! I'm still learning. Please check our About or Contact page for more details.";
      appendMessage("bot", escapeHtml(fallback));
    }
  }

  // Escape HTML for user-supplied content only
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Populate quick replies based on KB.helpTopics
  function renderQuickReplies() {
    quickEl.innerHTML = "";
    if (Array.isArray(KB.helpTopics) && KB.helpTopics.length) {
      const label = document.createElement("div");
      label.className = "sharebot-quick-label";
      label.textContent = "Help Topics";
      quickEl.appendChild(label);

      const list = document.createElement("div");
      list.className = "sharebot-quick-list";
      for (const topic of KB.helpTopics) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sharebot-quick-item";
        btn.textContent = topic;
        btn.addEventListener("click", () => {
          // When clicked, send topic text as query
          handleQuery(topic);
        });
        list.appendChild(btn);
      }
      quickEl.appendChild(list);
    }
  }

  // Toggle widget visibility
  function openWidget() {
    if (isOpen) return;
    isOpen = true;

    widget.removeAttribute("hidden");
    bubble.classList.add("hidden");
    input.focus();

    // Greet when opened (only once per session)
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        appendMessage("bot", escapeHtml(KB.greeting || "Hi! I'm ShareBot."));
        if (KB.shortIntro) {
          setTimeout(() => {
            appendMessage("bot", escapeHtml(KB.shortIntro));
            renderQuickReplies();
          }, 600);
        } else {
          renderQuickReplies();
        }
      }, 300);
    }
  }

  function closeWidget() {
    isOpen = false;
    widget.setAttribute("hidden", "");
    bubble.classList.remove("hidden");
  }

  // Events
  bubble.addEventListener("click", openWidget);
  closeBtn.addEventListener("click", closeWidget);

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const text = input.value || "";
    handleQuery(text);
  });

  // Keyboard: Esc to close
  widget.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      closeWidget();
    }
  });

  // Initial accessible hint
  bubble.setAttribute(
    "aria-label",
    "Open ShareBot chat to get help with ShareBite"
  );

  // Allow clicking links in bot answers to open safely
  messagesEl.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (a && a.href) {
      // Let default behavior happen; anchors in KB include target="_blank" where desired
    }
  });

  // Small improvement: support direct programmatic open via window.ShareBot.open()
  window.ShareBot = window.ShareBot || {};
  window.ShareBot.open = openWidget;
  window.ShareBot.close = closeWidget;
  window.ShareBot.sendMessage = (msg) => {
    openWidget();
    setTimeout(() => handleQuery(msg), 400);
  };

  console.log("✅ ShareBot initialized and ready!");
})();
