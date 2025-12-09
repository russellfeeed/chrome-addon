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

### Option 4: Enterprise Policy Deployment (Managed Chrome)

**For organizations with managed Chrome (check at `chrome://management/`):**

This is the cleanest deployment method - extensions appear automatically for users with no interaction needed.

#### Step 1: Package Your Extension and Get Extension ID

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select your extension directory
5. Leave private key field empty (first time)
6. Chrome creates:
   - `extension-name.crx` - The packaged extension
   - `extension-name.pem` - Private key (keep this secure!)
7. Note the Extension ID (shown after packing, looks like: `abcdefghijklmnopqrstuvwxyzabcdef`)

#### Step 2: Choose Hosting Method

**Option A: Chrome Web Store (Recommended)**
- Upload to Chrome Web Store as "Private" or "Unlisted"
- Get the Web Store URL or Extension ID
- No separate hosting needed
- Automatic updates

**Option B: Self-Hosted**
- Host the `.crx` file on an internal HTTPS server
- Create an `updates.xml` file (see Option 2 above)
- Host both files on your server

#### Step 3: Provide Info to IT Department

Give your IT team:
- **Extension ID** (from Step 1)
- **Installation source:**
  - Chrome Web Store ID/URL, OR
  - Your server URL with updates.xml

#### Step 4: IT Deploys via Group Policy or Google Admin Console

**Method A: Google Admin Console (if using Google Workspace)**

Your IT admin will:
1. Log into [admin.google.com](https://admin.google.com)
2. Go to: Devices → Chrome → Apps & Extensions
3. Click "Add" and select organizational unit
4. Add extension by:
   - Chrome Web Store URL, OR
   - Upload the .crx file directly
5. Set installation policy to "Force install"
6. Save changes

Extensions will auto-install on user devices within minutes.

**Method B: Windows Group Policy (if using Active Directory)**

Your IT admin will:

1. **Download Chrome ADMX templates** (if not already installed):
   - Download from: https://chromeenterprise.google/browser/download/
   - Extract `policy_templates.zip`
   - Copy `windows/admx/chrome.admx` to `C:\Windows\PolicyDefinitions\`
   - Copy `windows/admx/en-US/chrome.adml` to `C:\Windows\PolicyDefinitions\en-US\`

2. **Configure Group Policy**:
   - Open Group Policy Management Console (gpmc.msc)
   - Edit the appropriate GPO for your users
   - Navigate to: Computer Configuration → Policies → Administrative Templates → Google → Google Chrome → Extensions
   - Configure "Configure the list of force-installed apps and extensions"
   - Click "Enabled"
   - Click "Show" next to the list
   - Add entry in format:
     ```
     extension_id;update_url
     ```
   
   **Examples:**
   - Chrome Web Store: `abcdefghijklmnopqrstuvwxyzabcdef;https://clients2.google.com/service/update2/crx`
   - Self-hosted: `abcdefghijklmnopqrstuvwxyzabcdef;https://yourserver.com/updates.xml`

3. **Apply the policy**:
   - Run `gpupdate /force` on domain computers, OR
   - Wait for automatic Group Policy refresh (90 minutes default)

4. **Verify deployment**:
   - On a user's computer, go to `chrome://policy/`
   - Look for "ExtensionInstallForcelist"
   - Extension should appear in `chrome://extensions/` automatically

**Method C: Windows Registry (Single Computer Testing)**

For testing on a single Windows machine without full Group Policy:

1. Open Registry Editor (regedit.exe) as Administrator
2. Navigate to: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist`
3. If the key doesn't exist, create it
4. Create a new String Value:
   - Name: `1` (increment for each extension: 1, 2, 3, etc.)
   - Value: `extension_id;update_url`
5. Restart Chrome
6. Extension should auto-install

**Registry example:**
```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist]
"1"="abcdefghijklmnopqrstuvwxyzabcdef;https://clients2.google.com/service/update2/crx"
```

### Option 5: Developer Mode (Testing Only)

**Not recommended for production:**
- Users load unpacked extension manually
- Requires Developer mode enabled
- Shows warning banner
- Good for testing only

## Recommended Approach

**If Chrome is managed** (check at `chrome://management/`):
- **Enterprise Policy Deployment (Option 4)** - Best option! Extensions auto-install, no user interaction, no warnings
- Upload to Chrome Web Store as "Private" for easiest IT deployment
- Work with your IT department to deploy via Group Policy or Google Admin Console

**If Chrome is NOT managed:**
- **Chrome Web Store (Unlisted)** - Easiest for small teams, automatic updates, no warnings
- **Chrome Web Store (Private)** - Best for organizations with Google Workspace
- **Direct .crx distribution** - Fast but shows warnings, good for quick testing

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
