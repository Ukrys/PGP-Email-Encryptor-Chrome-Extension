window.openpgp = openpgp
// createEncryptButton
function createEncryptButton() {
  const button = document.createElement('button');
  button.id = 'encrypt-email-button';
  button.textContent = 'Encrypt Email';
  button.style.marginTop = '10px';
  button.style.padding = '10px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.addEventListener('click', () => {
    const publicKeyArmored = chrome.storage.local.get('accounts', (result)=>{
      if (chrome.runtime.lastError) {
        console.error(':', chrome.runtime.lastError);
        return;
      }
      userId = document.getElementsByClassName('afV')[0].getAttribute('data-hovercard-id')
      const accounts = result.accounts || {};
      const account = accounts[userId];
      if (account) {
        const publicKeyArmored = account.publicKey;
        encryptEmailContent(publicKeyArmored);
      } else {
        console.error('Public key not found for user email:', userEmail);
      }
    }); 
  });
  return button;
}

// insertEncryptButton
function insertEncryptButton() {
  const targetElements = document.getElementsByClassName('V3 aam');
  console.log(targetElements);
  if (targetElements.length > 0) {
    const targetElement = targetElements[0]; // Access the first element in the collection
    targetElement.appendChild(createEncryptButton());
  } else {
    console.error('Target element not found.');
  }
}

// Add the button when the page is loaded
window.addEventListener('load', () => {
  insertEncryptButton();
});


async function encryptEmailContent(publicKeyArmored) {
  const textArea = document.getElementsByClassName('Am aiL Al editable LW-avf tS-tW')[0];
  console.log(textArea.textContent);
  if (!textArea) {
    console.error('Email textarea not found.');
    return;
  }
  const emailContent = textArea.textContent.trim(); // get the email content from the textarea
  if (!emailContent) {
    console.error('Email content is empty.');
    return;
  }

  try {
    // load the public key
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    // encrypt the email content
    const encryptedContent = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: emailContent }), // create a message from the email content
      encryptionKeys: publicKey, // encrypt the email content using the public key
    });

    // show the encrypted content in the textarea
    textArea.textContent = 'The content belowed is encrypted by sender. Please decrypt using your own private key.\n' + encryptedContent; // show the encrypted content in the textarea
    console.log('Encrypted content:', encryptedContent);
    alert('Email content has been encrypted!');
  } catch (error) {
    console.error('Error encrypting email content:', error);
    alert('Failed to encrypt email content. Check the console for details.');
  }
  
}