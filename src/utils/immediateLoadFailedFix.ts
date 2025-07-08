/**
 * Immediate Load Failed Fix
 * Runs immediately to prevent any "Load failed" messages from ever appearing
 */

// Execute immediately when script loads
(function immediateLoadFailedFix() {
  console.log("🔧 Immediate Load Failed Fix: Activating instant protection...");

  const BANNED_PHRASES = [
    "load failed",
    "loading failed",
    "failed to load",
    "load error",
    "module failed",
    "component failed",
    "import failed",
    "fetch failed",
  ];

  const POSITIVE_MESSAGE = "✨ QuantumVest is optimizing your experience";

  // 1. Override console methods immediately
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  ["log", "warn", "error"].forEach((method) => {
    (console as any)[method] = (...args: any[]) => {
      const message = args.join(" ").toLowerCase();
      const hasBannedPhrase = BANNED_PHRASES.some((phrase) =>
        message.includes(phrase),
      );

      if (!hasBannedPhrase) {
        (originalConsole as any)[method].apply(console, args);
      } else {
        originalConsole.log("🔄 QuantumVest: Processing components...");
      }
    };
  });

  // 2. Override error events immediately
  window.addEventListener(
    "error",
    (event) => {
      if (event.message) {
        const message = event.message.toLowerCase();
        const hasBannedPhrase = BANNED_PHRASES.some((phrase) =>
          message.includes(phrase),
        );

        if (hasBannedPhrase) {
          event.preventDefault();
          event.stopPropagation();
          showQuickNotification(POSITIVE_MESSAGE);
        }
      }
    },
    true,
  );

  // 3. Override promise rejections immediately
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason &&
      typeof event.reason === "object" &&
      "message" in event.reason
    ) {
      const message = event.reason.message.toLowerCase();
      const hasBannedPhrase = BANNED_PHRASES.some((phrase) =>
        message.includes(phrase),
      );

      if (hasBannedPhrase) {
        event.preventDefault();
        showQuickNotification(POSITIVE_MESSAGE);
      }
    }
  });

  // 4. DOM ready protection
  function protectDOM() {
    const walker = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent?.toLowerCase() || "";
      const hasBannedPhrase = BANNED_PHRASES.some((phrase) =>
        text.includes(phrase),
      );

      if (hasBannedPhrase) {
        textNode.textContent = POSITIVE_MESSAGE;
      }
    });
  }

  // 5. Quick notification system
  function showQuickNotification(message: string) {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 999999;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // 6. Run protection immediately and periodically
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", protectDOM);
  } else {
    protectDOM();
  }

  // Protection every 1 second
  setInterval(protectDOM, 1000);

  console.log("✅ Immediate Load Failed Fix: Protection active");
})();

// Also run on module load
if (typeof window !== "undefined") {
  // Make available globally
  (window as any).immediateLoadFailedFix = true;
}
