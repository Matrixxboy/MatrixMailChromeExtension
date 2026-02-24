const editor = document.getElementById("code-editor")
const preview = document.getElementById("preview-pane")
const pushBtn = document.getElementById("push-btn")
const templateSelector = document.getElementById("template-selector")
const statusText = document.getElementById("status-text")

const templates = {
  protocol: `
<div style="font-family: 'Inter', sans-serif; color: #2d232e; background: #ffffff; padding: 40px; border: 1px solid rgba(157, 141, 241, 0.2); border-radius: 16px; max-width: 600px; margin: auto; box-shadow: 0 10px 40px rgba(157, 141, 241, 0.1);">
  <h1 style="color: #9d8df1; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 24px; font-size: 28px;">Lavender Protocol</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #7d6e83;">Hello <strong>Cipher</strong>,</p>
  <p style="font-size: 16px; line-height: 1.6; color: #7d6e83;">Your secure environment has been successfully refactored to the new minimal aesthetic. Enjoy the clarity.</p>
  <div style="margin-top: 32px; padding: 16px; background: #f8f7ff; border-radius: 12px; border-left: 4px solid #9d8df1; font-size: 14px; color: #9d8df1; font-weight: 500;">
    SYSTEM STATUS: OPTIMIZED | THEME: PASTEL ZEN
  </div>
</div>
  `,
  system: `
<div style="font-family: 'Inter', sans-serif; color: #2d232e; background: #fffcfc; padding: 40px; border: 1px solid rgba(255, 126, 179, 0.2); border-radius: 16px; max-width: 600px; margin: auto; box-shadow: 0 10px 40px rgba(255, 126, 179, 0.05);">
  <h1 style="color: #ff7eb3; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 20px;">Soft Alert</h1>
  <p style="color: #7d6e83; line-height: 1.6;">Minor adjustment needed in the design module. Please verify the component alignment.</p>
  <button style="background: #ff7eb3; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; margin-top: 24px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(255, 126, 179, 0.2);">VIEW DETAILS</button>
</div>
  `,
  void: `
<div style="font-family: 'Inter', sans-serif; color: #7d6e83; background: #ffffff; padding: 60px; text-align: center; border: 1px solid #f0f0f0; border-radius: 16px; max-width: 600px; margin: auto;">
  <div style="font-size: 48px; margin-bottom: 24px; color: #e0e0e0;">✦</div>
  <p style="font-weight: 500; letter-spacing: 2px; color: #2d232e; text-transform: uppercase; font-size: 14px;">Minimal Zen</p>
  <div style="width: 40px; height: 2px; background: #9d8df1; margin: 20px auto;"></div>
  <p style="font-size: 13px; color: #a0a0a0; font-style: italic;">Where simplicity meets function.</p>
</div>
  `,
}

const updatePreview = () => {
  const htmlCode = editor.value
  const doc = preview.contentDocument || preview.contentWindow.document
  doc.open()
  doc.write(htmlCode)
  doc.close()
  statusText.innerText = "Changes synced"
}

// 1. Live Preview Logic
editor.addEventListener("input", updatePreview)

// 2. Template Selection Logic
templateSelector.addEventListener("change", (e) => {
  const selectedTemplate = e.target.value
  editor.value = templates[selectedTemplate].trim()
  updatePreview()
  statusText.innerText = `Loaded: ${selectedTemplate}`
})

// Initial load
editor.value = templates.protocol.trim()
updatePreview()

// 3. Push to Gmail Logic
pushBtn.addEventListener("click", async () => {
  try {
    statusText.innerText = "Connecting to Gmail..."
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab || !tab.url.includes("mail.google.com")) {
      statusText.innerText = "Error: Open Gmail"
      alert("Please open Gmail before pushing.")
      return
    }

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "inject",
        html: editor.value,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          statusText.innerText = "Script error"
          alert(
            "Error: Gmail content script not ready. Refresh Gmail and try again.",
          )
          return
        }

        if (response?.status === "Injected") {
          statusText.innerText = "Injected successfully!"
          pushBtn.innerText = "Injected!"
          pushBtn.disabled = true

          setTimeout(() => {
            window.close()
          }, 1500)
        } else {
          statusText.innerText = "Compose not found"
          alert("Could not inject. Make sure a compose window is open.")
        }
      },
    )
  } catch (err) {
    console.error(err)
    statusText.innerText = "Runtime error"
  }
})
