# Simple Chrome Extension

A minimal Chrome extension for testing private deployment.

## Features

- Simple popup interface with a clickable button
- Displays current time and active tab information
- Uses Manifest V3 (latest Chrome extension format)

## Local Testing

### Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select this extension's folder
5. The extension icon should appear in your toolbar

## Private Deployment Options

### Option 1: Direct Distribution (.crx file)

**Create the package:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select your extension directory
5. Leave private key field empty (first time) or select existing key
6. Chrome creates a `.crx` file and `.pem` key file

**Distribute:**
- Share the `.crx` file with users
- Users drag and drop it onto `chrome://extensions/`
- Note: Chrome may show warnings for extensions not from the Web Store

### Option 2: Self-Hosted with Update URL

**Setup:**
1. Package your extension (see Option 1)
2. Host the `.crx` file on your server (HTTPS required)
3. Create an `updates.xml` file:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='YOUR_EXTENSION_ID'>
    <updatecheck codebase='https://yourserver.com/extension.crx' version='1.0.0' />
  </app>
</gupdate>
```

4. Add to manifest.json:
```json
"update_url": "https://yourserver.com/updates.xml"
```

### Option 3: Chrome Web Store (Private/Unlisted)

**Best for organizations:**
1. Create a Chrome Web Store developer account ($5 one-time fee)
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Click "New Item" and upload your extension as a ZIP file
4. Set visibility to "Private" or "Unlisted":
   - **Private**: Only specific Google accounts/groups can access
   - **Unlisted**: Anyone with the link can install
5. Submit for review
6. Share the private link with your users

### Option 4: Enterprise Policy Deployment

**For organizations with managed Chrome:**
1. Package your extension
2. Host it on your internal server
3. Use Chrome Enterprise policies to force-install:
   - ExtensionInstallForcelist policy
   - Requires Chrome managed by Google Admin Console or Windows Group Policy

**Group Policy example:**
```
ExtensionInstallForcelist = ["extension_id;https://yourserver.com/updates.xml"]
```

### Option 5: Developer Mode (Testing Only)

**Not recommended for production:**
- Users load unpacked extension manually
- Requires Developer mode enabled
- Shows warning banner
- Good for testing only

## Recommended Approach

For private deployment to a small team:
- **Chrome Web Store (Unlisted)** - Easiest, most reliable, automatic updates
- **Chrome Web Store (Private)** - Best for organizations with Google Workspace

For internal corporate use:
- **Enterprise Policy** - Best control, no user interaction needed

For quick testing:
- **Direct .crx distribution** - Fast but shows warnings

## Creating Icons

The extension references three icon sizes. Create simple placeholder icons or use these commands:

**Using ImageMagick (if installed):**
```bash
convert -size 16x16 xc:#4CAF50 icon16.png
convert -size 48x48 xc:#4CAF50 icon48.png
convert -size 128x128 xc:#4CAF50 icon128.png
```

**Or create them manually** using any image editor with these dimensions:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

## Files Structure

```
.
├── manifest.json       # Extension configuration
├── popup.html         # Popup UI
├── popup.js           # Popup logic
├── icon16.png         # Small icon
├── icon48.png         # Medium icon
├── icon128.png        # Large icon
└── README.md          # This file
```

## Security Notes

- Keep your `.pem` private key file secure - it's used to sign updates
- Use HTTPS for hosting `.crx` files and update manifests
- Chrome Web Store handles security and signing automatically
- Extensions not from the Web Store show warnings to users

## Updating Your Extension

1. Increment version in `manifest.json`
2. Repackage using the same `.pem` key
3. Distribute updated `.crx` or update on Web Store
4. Chrome checks for updates automatically (if update_url is configured)
