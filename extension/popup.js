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

  // Modal Elements
  const modalOverlay = document.getElementById("modal-overlay")
  const modalTitle = document.getElementById("modal-title")
  const modalMessage = document.getElementById("modal-message")
  const modalInput = document.getElementById("modal-input")
  const modalCancel = document.getElementById("modal-cancel")
  const modalConfirm = document.getElementById("modal-confirm")

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
    !importInput ||
    !modalOverlay
  ) {
    console.error("Missing DOM elements. Check popup.html IDs.")
    return
  }

  const defaultTemplates = {
    protocol: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f0; background: #0a0a0a; padding: 40px; border: 1px solid #262626; border-radius: 12px; max-width: 600px; margin: 20px auto; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
  <h1 style="color: #ffffff; font-weight: 700; letter-spacing: -1px; margin: 0 0 16px 0; font-size: 32px;">Encrypted Message</h1>
  <p style="font-size: 16px; line-height: 1.7; color: #a1a1aa; margin-bottom: 24px;">Hello <strong>{{name}}</strong>,</p>
  <p style="font-size: 16px; line-height: 1.7; color: #a1a1aa;">The requested deployment has been finalized. Your environment is now synchronized with the latest MatrixMail aesthetic standards.</p>
  <div style="margin-top: 40px; padding: 20px; background: #111; border: 1px solid #262626; border-radius: 8px; border-left: 4px solid #7c3aed;">
    <p style="margin: 0; font-family: monospace; font-size: 13px; color: #7c3aed;">STATUS: SUCCESSFUL // PORT_OPEN: 8080</p>
  </div>
</div>
    `,

    alert: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; padding: 0; border: 1px solid #eaeaea; border-radius: 16px; max-width: 550px; margin: 20px auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
  <div style="background: #7c3aed; padding: 20px; text-align: center;">
     <span style="color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px;">Security Alert</span>
  </div>
  <div style="padding: 40px 30px; text-align: center;">
    <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">Action Required</h2>
    <p style="color: #666; line-height: 1.6; font-size: 15px; margin-bottom: 30px;">We detected an unusual login attempt from a new device. If this was not you, please secure your account immediately.</p>
    <a href="#" style="background: #000000; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">Verify Activity</a>
  </div>
  <div style="background: #fafafa; padding: 15px; text-align: center; border-top: 1px solid #eaeaea;">
    <p style="margin: 0; font-size: 11px; color: #999;">MatrixMail Secure Link &copy; 2026</p>
  </div>
</div>
    `,
    "aesthetic-card": `
    <div style="font-family: -apple-system, sans-serif; background: #ffffff; padding: 32px; border: 1px solid #f3f0ff; border-radius: 24px; max-width: 500px; margin: 20px auto; box-shadow: 0 20px 40px rgba(124, 58, 237, 0.06);">
  
  <div style="background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); height: 220px; border-radius: 16px; margin-bottom: 24px; overflow: hidden;">
    
    <img 
      src="https://picsum.photos/536/354" 
      alt="Image"
      style="width: 100%; height: 100%; object-fit: cover; display: block;"
    />

  </div>

  <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Matrix Update</h2>

  <p style="margin: 0 0 24px 0; line-height: 1.6; color: #4b5563; font-size: 15px;">
    Discover the new standard of communication. Fast, secure, and aesthetically superior.
  </p>

  <div style="display: flex; align-items: center;">
    <span style="background: #f5f3ff; color: #7c3aed; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; border: 1px solid #ddd6fe;">
      REFERRAL ACTIVE
    </span>
    <span style="margin-left: auto; color: #9ca3af; font-size: 12px;">
      v2.4.0
    </span>
  </div>

</div>
    `,
  }

  let userTemplates = {}

  /**
   * Custom aesthetic notification modal
   * @param {Object} options - mode (alert/confirm/prompt), title, message, defaultValue
   * @returns {Promise<any>}
   */
  const showModal = ({
    mode = "alert",
    title = "Notification",
    message = "",
    defaultValue = "",
  }) => {
    return new Promise((resolve) => {
      modalTitle.innerText = title
      modalMessage.innerText = message
      modalInput.value = defaultValue

      // Setup UI based on mode
      if (mode === "prompt") {
        modalInput.style.display = "block"
        modalCancel.style.display = "block"
        setTimeout(() => modalInput.focus(), 100)
      } else if (mode === "confirm") {
        modalInput.style.display = "none"
        modalCancel.style.display = "block"
      } else {
        modalInput.style.display = "none"
        modalCancel.style.display = "none"
      }

      modalOverlay.style.display = "flex"

      const cleanup = (value) => {
        modalOverlay.style.display = "none"
        modalConfirm.removeEventListener("click", onConfirm)
        modalCancel.removeEventListener("click", onCancel)
        resolve(value)
      }

      const onConfirm = () => {
        if (mode === "prompt") {
          cleanup(modalInput.value)
        } else {
          cleanup(true)
        }
      }

      const onCancel = () => {
        cleanup(null)
      }

      modalConfirm.addEventListener("click", onConfirm)
      modalCancel.addEventListener("click", onCancel)
    })
  }

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
    const name = await showModal({
      mode: "prompt",
      title: "Save Template",
      message: "Enter a name for your custom template:",
      defaultValue: "",
    })

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
      const confirmed = await showModal({
        mode: "confirm",
        title: "Delete Template",
        message: `Are you sure you want to delete the template "${currentVal}"?`,
      })

      if (confirmed) {
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
  exportTplBtn.addEventListener("click", async () => {
    if (Object.keys(userTemplates).length === 0) {
      await showModal({
        mode: "alert",
        title: "Export Failed",
        message: "No custom templates to export.",
      })
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
        await showModal({
          mode: "alert",
          title: "Import Failed",
          message: err.message,
        })
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
        await showModal({
          mode: "alert",
          title: "Action Required",
          message: "Please open Gmail before pushing.",
        })
        return
      }

      chrome.tabs.sendMessage(
        tab.id,
        {
          action: "inject",
          html: editor.value,
        },
        async (response) => {
          if (chrome.runtime.lastError) {
            statusText.innerText = "Script error"
            await showModal({
              mode: "alert",
              title: "Script Error",
              message:
                "Gmail content script not ready. Refresh Gmail and try again.",
            })
            return
          }

          if (response?.status === "Injected") {
            statusText.innerText = "Injected successfully!"
            pushBtn.innerText = "Injected!"
            pushBtn.disabled = true
            setTimeout(() => window.close(), 1500)
          } else {
            statusText.innerText = "Compose not found"
            await showModal({
              mode: "alert",
              title: "Compose Box Missing",
              message: "Could not inject. Make sure a compose window is open.",
            })
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
