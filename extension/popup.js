document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("code-editor")
  const preview = document.getElementById("preview-pane")
  const pushBtn = document.getElementById("push-btn")
  const templateSelector = document.getElementById("template-selector")
  const statusText = document.getElementById("status-text")
  const saveTplBtn = document.getElementById("save-tpl-btn")
  const deleteTplBtn = document.getElementById("delete-tpl-btn")
  const exportTplBtn = document.getElementById("export-tpl-btn")
  const importTplBtn = document.getElementById("import-tpl-btn")
  const importInput = document.getElementById("import-input")

  // Verify elements exist
  if (
    !editor ||
    !preview ||
    !pushBtn ||
    !templateSelector ||
    !statusText ||
    !saveTplBtn ||
    !deleteTplBtn ||
    !exportTplBtn ||
    !importTplBtn ||
    !importInput
  ) {
    console.error("Missing DOM elements. Check popup.html IDs.")
    return
  }

  const defaultTemplates = {
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
    "aesthetic-card": `
<div style="font-family: 'Inter', sans-serif; color: #4a3f55; background: #fff; padding: 32px; border: 1px solid #f0edff; border-radius: 24px; max-width: 500px; margin: auto; box-shadow: 0 20px 40px rgba(157, 141, 241, 0.08);">
  <div style="background: #f8f7ff; height: 200px; border-radius: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; color: #9d8df1; font-size: 40px; font-weight: bold;">
    ✨
  </div>
  <h2 style="color: #9d8df1; margin: 0 0 12px 0; font-size: 24px; font-weight: 700;">Aesthetic Update</h2>
  <p style="margin: 0 0 24px 0; line-height: 1.6; color: #7d6e83;">This is an example template designed to showcase the MatrixMail Editor's new pastel aesthetic. Minimal, clean, and professional.</p>
  <div style="display: flex; gap: 12px;">
    <span style="background: #f0edff; color: #9d8df1; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">PORTFOLIO</span>
    <span style="background: #f8f7ff; color: #a1a1a1; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">NEW DESIGN</span>
  </div>
</div>
    `,
  }

  let userTemplates = {}

  const updateDeleteButtonVisibility = () => {
    const currentVal = templateSelector.value
    if (userTemplates[currentVal]) {
      deleteTplBtn.style.display = "flex"
    } else {
      deleteTplBtn.style.display = "none"
    }
  }

  const refreshTemplates = async () => {
    try {
      const data = await chrome.storage.local.get("userTemplates")
      userTemplates = data.userTemplates || {}

      const allTemplates = { ...defaultTemplates, ...userTemplates }

      const currentVal = templateSelector.value
      templateSelector.innerHTML = ""

      Object.keys(allTemplates).forEach((key) => {
        const option = document.createElement("option")
        option.value = key
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1)
        templateSelector.appendChild(option)
      })

      if (allTemplates[currentVal]) {
        templateSelector.value = currentVal
      }

      updateDeleteButtonVisibility()
    } catch (err) {
      console.error("Refresh info error:", err)
    }
  }

  const updatePreview = () => {
    const htmlCode = editor.value
    const doc = preview.contentDocument || preview.contentWindow.document
    if (doc) {
      doc.open()
      doc.write(htmlCode)
      doc.close()
      statusText.innerText = "Changes synced"
    }
  }

  // 1. Live Preview Logic
  editor.addEventListener("input", updatePreview)

  // 2. Template Selection Logic
  templateSelector.addEventListener("change", async (e) => {
    const selectedTemplate = e.target.value
    const allTemplates = { ...defaultTemplates, ...userTemplates }
    editor.value = (allTemplates[selectedTemplate] || "").trim()
    updatePreview()
    updateDeleteButtonVisibility()
    statusText.innerText = `Loaded: ${selectedTemplate}`
  })

  // 3. Save Template Logic
  saveTplBtn.addEventListener("click", async () => {
    const name = prompt("Enter a name for your custom template:")
    if (name && name.trim()) {
      const cleanName = name.trim().toLowerCase().replace(/\s+/g, "-")
      userTemplates[cleanName] = editor.value
      await chrome.storage.local.set({ userTemplates })
      await refreshTemplates()
      templateSelector.value = cleanName
      updateDeleteButtonVisibility()
      statusText.innerText = `Saved: ${cleanName}`
    }
  })

  // 4. Delete Template Logic
  deleteTplBtn.addEventListener("click", async () => {
    const currentVal = templateSelector.value
    if (userTemplates[currentVal]) {
      if (
        confirm(`Are you sure you want to delete the template "${currentVal}"?`)
      ) {
        delete userTemplates[currentVal]
        await chrome.storage.local.set({ userTemplates })
        await refreshTemplates()
        templateSelector.value = "protocol"
        editor.value = defaultTemplates.protocol.trim()
        updatePreview()
        updateDeleteButtonVisibility()
        statusText.innerText = `Deleted: ${currentVal}`
      }
    }
  })

  // 5. Export Logic
  exportTplBtn.addEventListener("click", () => {
    if (Object.keys(userTemplates).length === 0) {
      alert("No custom templates to export.")
      return
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(userTemplates, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "matrixmail-templates.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    statusText.innerText = "Templates exported"
  })

  // 6. Import Logic
  importTplBtn.addEventListener("click", () => importInput.click())

  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const content = event.target.result
        if (!content || content.trim() === "") {
          throw new Error("File is empty")
        }

        const imported = JSON.parse(content)
        if (
          imported &&
          typeof imported === "object" &&
          !Array.isArray(imported)
        ) {
          userTemplates = { ...userTemplates, ...imported }
          await chrome.storage.local.set({ userTemplates })
          await refreshTemplates()

          const firstKey = Object.keys(imported)[0]
          if (firstKey) {
            templateSelector.value = firstKey
            editor.value = imported[firstKey].trim()
            updatePreview()
            updateDeleteButtonVisibility()
          }

          statusText.innerText = "Imported successfully"
          importInput.value = ""
        } else {
          throw new Error("Invalid format: Expected a JSON object")
        }
      } catch (err) {
        console.error("Import error details:", err)
        alert("Import failed: " + err.message)
        statusText.innerText = "Import failed"
        importInput.value = ""
      }
    }
    reader.readAsText(file)
  })

  // 7. Push to Gmail Logic
  pushBtn.addEventListener("click", async () => {
    try {
      statusText.innerText = "Connecting to Gmail..."
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

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
            setTimeout(() => window.close(), 1500)
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

  // Initial load
  const initialize = async () => {
    await refreshTemplates()
    const allTemplates = { ...defaultTemplates, ...userTemplates }
    editor.value = (allTemplates.protocol || "").trim()
    updatePreview()
  }

  initialize()
})
