# Highlight & Save Extension

A browser extension that lets you highlight text on any webpage and save your highlights for later review.

**Live Demo:** *(coming soon)*

---

## Features

* **Highlight Selection**: Select text on any page and highlight it in a custom color.
* **Save Highlights**: Store highlights in your browser’s local storage for persistence across sessions.
* **Manage Highlights**: View, edit, and delete saved highlights from the extension popup.
* **Export & Import**: Export highlights to JSON and re-import them later.
* **Custom Colors**: Choose from multiple highlight colors to organize your notes.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DuyNguyen2k6/highligh-save_Extension.git
   ```
2. Open Chrome (or any Chromium-based browser) and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the cloned directory.
5. You’ll see the **Highlight & Save** icon in your toolbar.

---

## Usage

1. Navigate to any webpage.
2. Select the text you want to highlight.
3. Right-click the selection and choose **"Highlight & Save"** (or click the extension icon and select **Highlight**).
4. Open the extension popup by clicking its toolbar icon to view all saved highlights.
5. Use the **Export** button to download your highlights as a JSON file.
6. Use the **Import** button to load highlights from a previously exported file.

---

## File Structure

* `manifest.json` – Extension metadata and permissions.
* `content.js`    – Injects highlight functionality into webpages.
* `popup.html`    – Popup UI for managing your highlights.
* `popup.js`      – Handles popup interactions (view, edit, delete, export/import).
* `styles.css`    – Styles for highlights and popup UI.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to your branch: `git push origin feature/my-feature`.
5. Open a pull request describing your changes.

---

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
