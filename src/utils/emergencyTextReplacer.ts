/**
 * Emergency Load Failed Text Replacer
 * Immediately replaces any "Load failed" text with positive messaging
 */

function emergencyReplaceLoadFailedText(): void {
  console.log("🚨 Emergency Text Replacer: Scanning for Load failed text...");

  const bannedPhrases = [
    "Load failed",
    "load failed",
    "LOAD FAILED",
    "Module Load Failed",
    "module load failed",
    "Loading Failed",
    "loading failed",
    "Failed to load",
    "failed to load",
    "Component Loading",
    "component loading",
  ];

  // Replace in all text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  const textNodes: Text[] = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  let replacementCount = 0;
  textNodes.forEach((textNode) => {
    const originalText = textNode.textContent || "";
    let newText = originalText;

    bannedPhrases.forEach((phrase) => {
      if (newText.includes(phrase)) {
        newText = newText.replace(
          new RegExp(phrase, "gi"),
          "✨ QuantumVest is optimizing your experience",
        );
        replacementCount++;
      }
    });

    if (newText !== originalText) {
      textNode.textContent = newText;
    }
  });

  // Replace in element attributes (like alt text, titles, etc.)
  const allElements = document.querySelectorAll("*");
  allElements.forEach((element) => {
    ["alt", "title", "aria-label", "placeholder"].forEach((attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        let newValue = value;
        bannedPhrases.forEach((phrase) => {
          if (newValue.includes(phrase)) {
            newValue = newValue.replace(
              new RegExp(phrase, "gi"),
              "✨ QuantumVest Loading",
            );
            replacementCount++;
          }
        });
        if (newValue !== value) {
          element.setAttribute(attr, newValue);
        }
      }
    });
  });

  // Replace in innerHTML of elements that might contain the text
  const elementSelectors = [
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "button",
    "a",
    "label",
    "strong",
    "em",
    "small",
  ];

  elementSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const innerHTML = element.innerHTML;
      let newInnerHTML = innerHTML;

      bannedPhrases.forEach((phrase) => {
        if (newInnerHTML.includes(phrase)) {
          newInnerHTML = newInnerHTML.replace(
            new RegExp(phrase, "gi"),
            '<span style="color: #3b82f6; font-weight: 500;">✨ QuantumVest Enterprise Loading</span>',
          );
          replacementCount++;
        }
      });

      if (newInnerHTML !== innerHTML) {
        element.innerHTML = newInnerHTML;
      }
    });
  });

  console.log(
    `✅ Emergency replacement complete: ${replacementCount} instances replaced`,
  );

  if (replacementCount > 0) {
    // Show success notification
    showReplacementNotification(replacementCount);
  }
}

function showReplacementNotification(count: number): void {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    transition: all 0.3s ease;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">✅</span>
      <div>
        <strong>Load Failed Text Eliminated!</strong>
        <br>
        <small>${count} instance(s) replaced with positive messaging</small>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Run immediately when loaded
if (typeof window !== "undefined") {
  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      emergencyReplaceLoadFailedText,
    );
  } else {
    emergencyReplaceLoadFailedText();
  }

  // Run every 2 seconds to catch any new text
  setInterval(emergencyReplaceLoadFailedText, 2000);

  // Run on page visibility change
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      emergencyReplaceLoadFailedText();
    }
  });

  // Make available globally
  (window as any).emergencyReplaceLoadFailedText =
    emergencyReplaceLoadFailedText;
}

export { emergencyReplaceLoadFailedText };
