# MatrixMail Editor v2.0 🚀

**MatrixMail Editor** is a high-aesthetic, widescreen Chrome extension designed for developers and power users to create, preview, and inject professional HTML email templates directly into Gmail.

Built with a **Precision Pastel Zen** theme, it features a side-by-side workspace that eliminates scrolling and provides instant visual feedback.

---

## ✨ Features

- **Widescreen Workspace**: Side-by-side Editor and Live Preview for maximum productivity.
- **Instant Sync**: Real-time rendering of HTML/CSS within the window.
- **Local Template Management**: Persistent storage using Chrome's local storage—no backend required.
- **Professional Icons**: High-fidelity SVG icon system with smooth hover states.
- **Aesthetic Notifications**: Custom glassmorphism modals for alerts, confirmations, and prompts.
- **Gmail Integration**: One-click injection into the Gmail compose body.

---

## 🛠️ How to Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the `/extension` folder of this project.

---

## 📖 How to Use

### 1. Basic Editing

1. Open Gmail and click the **Compose** button to open a message box.
2. Click the MatrixMail Editor icon in your extension bar.
3. Select a template from the dropdown or start typing your own HTML in the **Source Code** section.
4. Watch the **Live Output** update instantly on the right.
5. Click **Push to Gmail** to inject the code into your compose box.

### 2. Saving Custom Templates

1. Type or paste your custom HTML into the editor.
2. Click the **Save** (💾) icon.
3. Enter a name for your template in the aesthetic modal that appears.
4. Your template is now saved locally and will appear in the dropdown menu.

### 3. Deleting Templates

1. Select a custom template from the dropdown menu.
2. The **Delete** (🗑️) icon will appear. Click it to permanently remove the template from your local storage.

### 4. Exporting & Importing

- **Export (📤)**: Click the export icon to download a `matrixmail-templates.json` file containing all your custom templates. This is great for backups or moving to another machine.
- **Import (📥)**: Click the import icon and select a valid `.json` template file. The templates will be merged into your collection and the first one will be auto-loaded for you.

---

## 🎨 Aesthetic Guidelines

The project follows the **MatrixMail Pastel Zen** design system:

- **Background**: Pure white `#ffffff`
- **Accents**: Dull Lavender `#9d8df1`
- **Typography**: Inter (UI), Orbitron (Logo), JetBrains Mono (Code)
- **Effects**: Soft Glassmorphism (8px blur), Subtle Shadows

---

## 📄 License

MIT License
