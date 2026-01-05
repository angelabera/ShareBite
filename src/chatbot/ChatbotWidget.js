// ChatbotWidget.js
// Vanilla JS module that injects a floating chatbot into the page.
// Improved version: better matching, UX, accessibility, persistence.

// Immediately-invoked async function to allow use of await at top level
(async function () {
  /* ===============================
     Load CSS
  =============================== */
  const cssUrl = new URL("./chatbot.css", import.meta.url);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl.href;
  document.head.appendChild(link);

  /* ===============================
     Load Knowledge Base
  =============================== */
  const kbUrl = new URL("./ChatbotKnowledgeBase.json", import.meta.url);
  let KB = null;

  try {
    const res = await fetch(kbUrl.href, { cache: "default" });
    KB = await res.json();
  } catch (e) {
    console.error("ShareBot: failed to load knowledge base", e);
    KB = {
      greeting: "Hi! I'm ShareBot.",
      shortIntro: "How can I help you today?",
      faqs: [],
      helpTopics: [],
      fallback:
        "That's a great question! I'm still learning. Please check our About or Contact page.",
    };
  }

  /* ===============================
     Root Container
  =============================== */
  const container = document.createElement("div");
  container.id = "sharebot-container";
  container.setAttribute("aria-live", "polite");
  document.body.appendChild(container);

  /* ===============================
     Floating Bubble Button
  =============================== */
  const bubble = document.createElement("button");
  bubble.id = "sharebot-bubble";
  bubble.title = "Open ShareBot chat";
  bubble.innerHTML = '<span class="sharebot-emoji">🍽️</span>';
  container.appendChild(bubble);

  /* ===============================
     Chat Widget
  =============================== */
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
      <input
        type="text"
        id="sharebot-input"
        placeholder="Type a question or choose a topic..."
        aria-label="Message"
        autocomplete="off"
      />
      <button type="submit" id="sharebot-send">Send</button>
    </form>
  `;
  container.appendChild(widget);

  const messagesEl = widget.querySelector("#sharebot-messages");
  const quickEl = widget.querySelector("#sharebot-quick");
  const form = widget.querySelector("#sharebot-form");
  const input = widget.querySelector("#sharebot-input");
  const closeBtn = widget.querySelector(".sharebot-close");

  /* ===============================
     State
  =============================== */
  let isOpen = false;
  let hasGreeted = false;
  const STORAGE_KEY = "sharebot-session";

  /* ===============================
     Utilities
  =============================== */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatAnswer(text) {
    return String(text).replace(/\n/g, "<br>");
  }

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();
  }

  function appendMessage(role, html, save = true) {
    const wrapper = document.createElement("div");
    wrapper.className = `sharebot-message sharebot-${role}`;
    wrapper.innerHTML = `<div class="sharebot-bubble">${html}</div>`;
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (save) saveSession();
  }

  function appendTyping() {
    const typing = document.createElement("div");
    typing.className = "sharebot-message sharebot-bot sharebot-typing";
    typing.innerHTML = `<div class="sharebot-bubble">Typing…</div>`;
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typing;
  }

  /* ===============================
     FAQ Matching Logic
  =============================== */
  function findAnswer(query) {
    if (!query || !Array.isArray(KB.faqs)) return null;

    const q = normalize(query);

    for (const faq of KB.faqs) {
      if (!faq) continue;

      if (faq.question && q.includes(normalize(faq.question)))
        return faq.answer;

      if (Array.isArray(faq.keywords)) {
        for (const kw of faq.keywords) {
          if (kw && q.includes(normalize(kw))) return faq.answer;
        }
      }
    }

    // Intent shortcuts
    const intents = [
      { keys: ["donate", "donation", "give"], id: "how_to_donate" },
      { keys: ["find", "claim", "get food"], id: "how_to_find" },
      { keys: ["register", "join", "signup"], id: "join_donor_ngo" },
      { keys: ["login", "signin", "auth"], id: "login_system" },
      { keys: ["list", "browse"], id: "see_listings" },
      { keys: ["feature", "capability"], id: "features" },
      { keys: ["work", "process", "step"], id: "system_steps" },
      { keys: ["what is", "about"], id: "about_sharebite" },
    ];

    for (const intent of intents) {
      if (intent.keys.some((k) => q.includes(k))) {
        return KB.faqs.find((f) => f.id === intent.id)?.answer || null;
      }
    }

    return null;
  }

  /* ===============================
     Handle User Query
  =============================== */
  function handleQuery(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    appendMessage("user", escapeHtml(trimmed));
    input.value = "";

    const typingNode = appendTyping();

    setTimeout(() => {
      typingNode.remove();

      const answer = findAnswer(trimmed);
      if (answer) {
        appendMessage("bot", formatAnswer(answer));
      } else {
        appendMessage(
          "bot",
          escapeHtml(KB.fallback || "I'm still learning. Please check our Help pages.")
        );
      }
    }, 500);
  }

  /* ===============================
     Quick Replies
  =============================== */
  function renderQuickReplies() {
    quickEl.innerHTML = "";

    if (!Array.isArray(KB.helpTopics) || !KB.helpTopics.length) return;

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
      btn.onclick = () => handleQuery(topic);
      list.appendChild(btn);
    }

    quickEl.appendChild(list);
  }

  /* ===============================
     Open / Close Widget
  =============================== */
  function openWidget() {
    if (isOpen) return;
    isOpen = true;

    widget.removeAttribute("hidden");
    bubble.classList.add("hidden");
    input.focus();

    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        appendMessage("bot", escapeHtml(KB.greeting || "Hi! I'm ShareBot."));
        if (KB.shortIntro) {
          setTimeout(() => {
            appendMessage("bot", escapeHtml(KB.shortIntro));
            renderQuickReplies();
          }, 500);
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

  /* ===============================
     Session Persistence
  =============================== */
  function saveSession() {
    sessionStorage.setItem(STORAGE_KEY, messagesEl.innerHTML);
  }

  function restoreSession() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) messagesEl.innerHTML = saved;
  }

  restoreSession();

  /* ===============================
     Events
  =============================== */
  bubble.addEventListener("click", openWidget);
  closeBtn.addEventListener("click", closeWidget);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleQuery(input.value);
  });

  widget.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeWidget();
  });

  bubble.setAttribute(
    "aria-label",
    "Open ShareBot chat to get help with ShareBite"
  );

  /* ===============================
     Public API
  =============================== */
  window.ShareBot = {
    open: openWidget,
    close: closeWidget,
    sendMessage(msg) {
      openWidget();
      setTimeout(() => handleQuery(msg), 400);
    },
  };

  console.log("✅ ShareBot initialized successfully!");
})();
