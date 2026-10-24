# AU Studio — Fake Social Media Story Creator

A self-contained, mobile-first web app for building **fictional social media AUs** (alternate universes). Make fake, realistic-looking iMessage chats, Instagram posts/stories, X posts & threads, Threads, TikToks, WhatsApp, Discord, Facebook posts, and Lock Screen notifications — then preview them live on an iPhone frame and save them.

> Made for fictional creativity and self-indulgent AU storytelling. Nothing is posted to real social media. Nothing leaves your device unless you choose to export it.

## 📱 How to use it (no coding needed)

### Option 1: Open the live site (easiest)
1. On your phone, open **Safari** (iPhone) or **Chrome** (Android).
2. Go to: `https://anpark101.github.io/for-au/`
3. Tap **"Start writing"**, pick a platform, fill in the blanks — the phone preview updates live as you type.

### Option 2: Run it yourself
1. Download or clone this repository.
2. Open `index.html` in any browser (double-click it). No install, no build step, no internet needed once the page is open.

## How saving works

**Your work saves automatically to your device** (your browser's local storage) every time you change something. You'll see "Saved to device" at the top of the editor.

- Close the tab, come back later — your drafts are still there under **"My projects"**.
- It is saved **only on this phone/browser**. If you clear your browser data, your drafts will be gone — so keep backups.

### Backing up to the "cloud" (Google Drive, iCloud, email, etc.)
Because this app runs entirely in your browser with no account, there's no server-based cloud account. Instead:

1. In the editor, tap **Export project** → downloads a `.json` backup file.
2. Save that `.json` to Google Drive, iCloud Drive, Dropbox, or email it to yourself.
3. To bring it back later, open the app, go to the editor, and tap **Import project** → pick your `.json` file.

You can also tap **Export image** to save a picture of your post straight to your photos.

## Platforms included
- iMessage (text bubbles + voice notes + read receipts)
- WhatsApp
- Instagram Feed post
- Instagram Story (music sticker, live badge, viewers)
- X (Twitter) post
- X Thread
- Threads
- TikTok (video, caption, music, stats)
- Discord (server chat + embeds)
- Facebook post
- Lock Screen (time, date, notification stack)

## Credits
Image export uses [html2canvas](https://html2canvas.hertssted.com/) (MIT license), vendored in `js/vendor/html2canvas.min.js`.

---

This is a fan-made, fictional AU tool. Not affiliated with any real social media platform.