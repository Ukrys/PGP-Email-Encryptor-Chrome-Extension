// Description: This file contains the JavaScript code for the popup window.

document.getElementById('generate-key').addEventListener('click', async () => {
  console.log('generate-key clicked');
  const userId = document.getElementById('userid').value.trim();
  const passphrase = document.getElementById('passphrase').value.trim();

  console.log(userId
    , passphrase)

  if (!userId || !passphrase) {
    alert('Please enter both User ID and Passphrase.');
    return;
  }

  try {
    // generate a new key pair
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: 'rsa', // RSA key type
      rsaBits: 2048, // length of the key in bits
      userIDs: [{ name: userId }], // userId / email
      passphrase: passphrase // passphrase used to protect the private key
    });


    chrome.storage.local.get('accounts', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Reading Failed:', chrome.runtime.lastError);
        return;
      }

      const accounts = result.accounts || {};
      accounts[userId] = {
        publicKey: publicKey,
        privateKey: privateKey
      }

      chrome.storage.local.set({ accounts }, () => {
        if (chrome.runtime.lastError) {
          console.error('Storage Failed:', chrome.runtime.lastError);
        } else {
          console.log('Successfully saved the key pair to storage.');
        }
      });
    });


    // remove the '-----BEGIN PGP PRIVATE KEY BLOCK-----' and '-----END PGP PRIVATE KEY BLOCK-----' from the private key
    const stripped_privateKey = privateKey
    .replace(/-----BEGIN PGP PRIVATE KEY BLOCK-----/, '')
    .replace(/-----END PGP PRIVATE KEY BLOCK-----/, '')
    .trim();

    const stripped_publicKey = publicKey
    .replace(/-----BEGIN PGP PUBLIC KEY BLOCK-----/, '')
    .replace(/-----END PGP PUBLIC KEY BLOCK-----/, '')
    .trim();

    // show the key pair in the popup
    document.getElementById('public-key').value = stripped_publicKey;
    document.getElementById('private-key').value = stripped_privateKey;

    alert('Key pair generated successfully!');

  } catch (error) {
    console.error('Error generating key pair:', error);
    alert('Failed to generate key pair. See console for details.');
  }
});

document.getElementById('save-public-key').addEventListener('click', () => {
  console.log('save-public-key clicked');
  const friendId = document.getElementById('friend-id').value.trim();
  const publicKeyArmored = document.getElementById('friend-public-key').value.trim();

  if (!publicKeyArmored) {
    alert('Please enter a public key.');
    return;
  }

  // check if the public key is in the correct format
  const publicKeyRegex = /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]*-----END PGP PUBLIC KEY BLOCK-----/;
  if (!publicKeyRegex.test(publicKeyArmored)) {
    alert('Invalid public key format.');
    return;
  }


  chrome.storage.local.get('accounts', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Reading Failed:', chrome.runtime.lastError);
      return;
    }

    const accounts = result.accounts || {};
    accounts[friendId] = {
      publicKey: publicKeyArmored,
      privateKey: '' // private key is empty, because it is not owned by the user
    };

    chrome.storage.local.set({ accounts }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage Failed:', chrome.runtime.lastError);
      } else {
        console.log('Successfully saved the public key to storage.');
        alert('Public key saved successfully!');
      }
    });
  });
});