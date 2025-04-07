# PGP Email Encryptor Chrome Extension 💌🔒

**PGP Email Encryptor** is a Chrome extension designed to bring **PGP (Pretty Good Privacy)** encryption and decryption functionality directly to Gmail. This extension allows users to encrypt email content before sending and decrypt received emails, ensuring privacy and security.

------

## 🌟 Features

1. **Generate PGP Key Pair**:
   - Create your own PGP public and private key pair.
   - Keys are securely stored in the browser's local storage.
2. **Encrypt Email Content**:
   - Add an "🔒 Encrypt" button to Gmail's compose window.
   - Encrypt email content before sending using the recipient's public key.
3. **Decrypt Email Content**:
   - Add a "🔓 Decrypt" button to Gmail's read window.
   - Decrypt received emails using your private key and passphrase.
4. **Save/Import Public Keys**:
   - Save a friend's public key for future encryption.
   - Import public keys from `.pub` files and automatically add them to the list.
5. **Export Keys**:
   - Download your public and private keys for backup or use on other devices.

------

## 📂 Project Structure

- **popup.html**: The popup interface for generating keys and managing public keys.
- **popup.js**: Logic for generating keys, saving keys, and importing keys.
- **content.js**: Script for Gmail integration, adding buttons for encryption and decryption.
- **manifest.json**: Chrome extension configuration file, defining permissions and entry points.
- **openpgp.min.js**: Third-party library for handling PGP encryption and decryption.

------

## 🛠️ Installation

1. Clone or download the repository:

2. Open Chrome and navigate to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode** in the top-right corner.

4. Click **Load unpacked**, then select the project folder.

5. Once installed, the extension icon will appear in the top-right corner of your browser.

------

## 📝 Usage Guide

### 1. Generate a Key Pair 🔑

- Open the extension by clicking the icon in the browser toolbar.
- Enter your **User ID** (e.g., `Your Name <your-email@example.com>`) and **Passphrase**.
- Click **Generate Key Pair** to create your keys.
- The public and private keys will appear in the respective text areas. You can also download them for backup.

### 2. Save a Friend's Public Key 🤝

- Enter your friend's **User ID** and their **Public Key** in the popup interface.
- Click **Save Public Key** to store it in the local storage.
- Alternatively, click **Import Public Key** to upload a `.pub` file.

### 3. Encrypt an Email ✉️🔒

- Open Gmail and compose a new email.
- Write your email content, then click the **"Encrypt"** button.
- The system will use the recipient's email address to find their public key and encrypt the email content.
- Send the encrypted email as usual.

### 4. Decrypt an Email ✉️🔓

- Open a received encrypted email in Gmail.
- Click the **"Decrypt"** button and enter your private key passphrase.
- The email content will be decrypted and displayed.

------

## ⚠️ Important Notes

1. **Private Key Security**:
   - Your private key is stored locally in the browser's storage. Ensure your browser environment is secure.
   - Always use a strong passphrase and keep a backup of your private key.
2. **Encryption Limitations**:
   - Encrypting an email requires the recipient's public key. Ensure you have saved their key before sending an encrypted email.
3. **Browser Compatibility**:
   - This extension is designed for the latest version of Chrome. It is currently optimized for Gmail's web interface on desktop.

------

## 💻 Technology Stack

- **OpenPGP.js**: A JavaScript library for PGP encryption and decryption.
- **HTML/CSS/JavaScript**: Used to build the extension's UI and functionality.
- **Chrome Extension API**: For interacting with Gmail and the browser.

------

## 👨‍💻 Developer Guide

1. **Local Development**:
   - After making changes to the code, reload the extension in Chrome for the updates to take effect.
2. **Common Issues**:
   - If the extension cannot access Gmail, ensure the required permissions are granted in the `manifest.json`.
   - For encryption or decryption errors, check the browser console (`F12`) for detailed logs.

------

## 📸 Screenshots

### Popup Interface

|                      Generate Key Pair                       |                 Encrypt and Decrypt Buttons                  |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://raw.githubusercontent.com/Ukrys/DFintech_Courses_images/master/202504061702246.png" style="zoom:25%;" /> | <img src="https://raw.githubusercontent.com/Ukrys/DFintech_Courses_images/master/202504061703165.png" style="zoom:25%;" /> |

