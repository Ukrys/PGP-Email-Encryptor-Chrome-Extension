// Description: This file contains the JavaScript code for the popup window.

// Navigate between different sections of the popup
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-button');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      // hide all sections
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });
      
      // remove active class from all buttons
      navButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // show the clicked section
      const sectionId = button.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
      
      // add active class to the clicked button
      button.classList.add('active');
    });
  });
});


function downloadStringAsFile(content, filename) {
  const blob = new Blob([content], { type:  "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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
    // .replace(/-----BEGIN PGP PRIVATE KEY BLOCK-----/, '')
    // .replace(/-----END PGP PRIVATE KEY BLOCK-----/, '')
    // .trim();

    const stripped_publicKey = publicKey
    // .replace(/-----BEGIN PGP PUBLIC KEY BLOCK-----/, '')
    // .replace(/-----END PGP PUBLIC KEY BLOCK-----/, '')
    // .trim();

    // show the key pair in the popup
    document.getElementById('public-key').value = stripped_publicKey;
    document.getElementById('private-key').value = stripped_privateKey;

    alert('Key pair generated successfully!');

  } catch (error) {
    console.error('Error generating key pair:', error);
    alert('Failed to generate key pair. See console for details.');
  }
});

// download public key
document.getElementById('download-public-key').addEventListener('click', () => {
  downloadStringAsFile(
    document.getElementById('public-key').value.trim(),
    document.getElementById('userid').value.trim() + ".pub");
});
// download private key
document.getElementById('download-private-key').addEventListener('click', () => {
  downloadStringAsFile(
    document.getElementById('private-key').value.trim(),
    document.getElementById('userid').value.trim() + ".pem");
});
// import public key
document.getElementById('import-public-key').addEventListener('click', () => {
  document.getElementById("pubkeyInput").click();
});

document.getElementById("pubkeyInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const pemString = e.target.result;
    document.getElementById("import-friend-public-key").value = pemString;
    const fileName = file.name;
    const importUserId = fileName.replace(/\.pub$/i, "");
    document.getElementById("import-friend-id").value = importUserId;

    // save to localstorage
    chrome.storage.local.get('accounts', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Reading Failed:', chrome.runtime.lastError);
        return;
      }

      const accounts = result.accounts || {};
      if (!(importUserId in accounts)) {
        accounts[importUserId] = {
          publicKey: pemString,
          privateKey: '' // private key is empty, because it is not owned by the user
        };

        chrome.storage.local.set({ accounts }, () => {
          if (chrome.runtime.lastError) {
            console.error('Storage Failed:', chrome.runtime.lastError);
          } else {
            console.log('Successfully saved the public key to storage.');
            alert('Public key import successfully! You can use it to encrypt when you finish write email');
          }
        });
      }
    });
  };

  reader.readAsText(file);
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
    if (!(friendId in accounts)) {
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
    }
  });
});