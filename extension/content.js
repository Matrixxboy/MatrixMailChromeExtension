chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject") {
    const composeWindow = document.querySelector(
      'div[role="textbox"][aria-label*="Message Body"]',
    )

    if (composeWindow) {
      composeWindow.innerHTML = request.html
      sendResponse({ status: "Injected" })
    } else {
      sendResponse({ status: "Error", message: "Compose window not found" })
    }
  }
  return true // Keep channel open for async response
})
