window.openpgp = openpgp
// createEncryptButton
function createEncryptButton() {
  const button = document.createElement('button');
  button.id = 'encrypt-email-button';
  // Create a container for flexible layout
  const contentDiv = document.createElement('div');
  contentDiv.style.display = 'flex';
  contentDiv.style.alignItems = 'center';
  contentDiv.style.justifyContent = 'center';
  contentDiv.style.width = '100%';
  contentDiv.style.overflow = 'hidden';
  contentDiv.style.whiteSpace = 'nowrap';
  contentDiv.style.textOverflow = 'ellipsis';
  
  // Add text content
  contentDiv.textContent = '🔒 Encrypt';
  
  // Add the content to the button
  button.appendChild(contentDiv);
  
  // Apply styles to match Gmail's Compose button
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#c2e7ff';
  button.style.color = '#001d35';
  button.style.border = 'none';
  button.style.borderRadius = '16px';
  button.style.cursor = 'pointer';
  button.style.fontFamily = 'Google Sans, Roboto, sans-serif';
  button.style.fontSize = '14px';
  button.style.fontWeight = '500';
  button.style.minWidth = 'min-content';
  button.style.maxWidth = '100%';
  button.style.marginBottom = '16px';
  button.style.marginLeft = '8px';
  button.style.marginRight = '8px';
  button.style.marginTop = '8px';
  button.style.boxSizing = 'border-box';
  button.style.transition = 'box-shadow .08s linear,min-width .15s cubic-bezier(0.4,0.0,0.2,1)';
  
    // Responsive handling for narrow sidebar
    const checkWidth = () => {
      const sidebarWidth = button.parentElement ? button.parentElement.offsetWidth : 0;
      if (sidebarWidth < 120) {
        // When sidebar is collapsed/narrow
        contentDiv.style.display = 'inline-block';
        contentDiv.style.width = 'fit-content';
        contentDiv.style.maxWidth = (sidebarWidth - 30) + 'px'; // Adjust based on padding
        button.style.justifyContent = 'center';
        button.style.padding = '10px';
      } else {
        // When sidebar is expanded
        contentDiv.style.display = 'block';
        contentDiv.style.width = '100%';
        button.style.padding = '10px 15px';
      }
    };
    
    // Set up a MutationObserver to watch for DOM changes
    setTimeout(() => {
      if (button.parentElement) {
        const observer = new MutationObserver(checkWidth);
        observer.observe(button.parentElement, { attributes: true, subtree: true });
        checkWidth(); // Initial check
        
        // Also check on window resize
        window.addEventListener('resize', checkWidth);
      }
    }, 100);
    
    // Add hover effect
    button.onmouseover = function() {
      this.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)';
    };
    button.onmouseout = function() {
      this.style.boxShadow = 'none';
    };



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

// createDecryptButton
function createDecryptButton() {
  const button = document.createElement('button');
  button.id = 'decrypt-email-button';
  // Create a container for flexible layout
  const contentDiv = document.createElement('div');
  contentDiv.style.display = 'flex';
  contentDiv.style.alignItems = 'center';
  contentDiv.style.justifyContent = 'center';
  contentDiv.style.width = '100%';
  contentDiv.style.overflow = 'hidden';
  contentDiv.style.whiteSpace = 'nowrap';
  contentDiv.style.textOverflow = 'ellipsis';
  contentDiv.textContent = '🔓 Decrypt';

  button.appendChild(contentDiv);
  // Apply styles to match Gmail's Compose button
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#c2e7ff';
  button.style.color = '#001d35';
  button.style.border = 'none';
  button.style.borderRadius = '16px';
  button.style.cursor = 'pointer';
  button.style.fontFamily = 'Google Sans, Roboto, sans-serif';
  button.style.fontSize = '14px';
  button.style.fontWeight = '500';
  button.style.minWidth = 'min-content';
  button.style.maxWidth = '100%';
  button.style.marginBottom = '16px';
  button.style.marginLeft = '8px';
  button.style.marginRight = '8px';
  button.style.marginTop = '8px';
  button.style.boxSizing = 'border-box';
  button.style.transition = 'box-shadow .08s linear,min-width .15s cubic-bezier(0.4,0.0,0.2,1)';

  // Responsive handling for narrow sidebar
  const checkWidth = () => {
    const sidebarWidth = button.parentElement ? button.parentElement.offsetWidth : 0;
    if (sidebarWidth < 120) {
      // When sidebar is collapsed/narrow
      contentDiv.style.display = 'inline-block';
      contentDiv.style.width = 'fit-content';
      contentDiv.style.maxWidth = (sidebarWidth - 30) + 'px'; // Adjust based on padding
      button.style.justifyContent = 'center';
      button.style.padding = '10px';
    } else {
      // When sidebar is expanded
      contentDiv.style.display = 'block';
      contentDiv.style.width = '100%';
      button.style.padding = '10px 15px';
    }
  };
  
  // Set up a MutationObserver to watch for DOM changes
  setTimeout(() => {
    if (button.parentElement) {
      const observer = new MutationObserver(checkWidth);
      observer.observe(button.parentElement, { attributes: true, subtree: true });
      checkWidth(); // Initial check
      
      // Also check on window resize
      window.addEventListener('resize', checkWidth);
    }
  }, 100);

  // Add hover effect
  button.onmouseover = function() {
    this.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)';
  };
  button.onmouseout = function() {
    this.style.boxShadow = 'none';
  };

  button.addEventListener('click', () => {
    chrome.storage.local.get('accounts', (result) => {
      if (chrome.runtime.lastError) {
        console.error(':', chrome.runtime.lastError);
        return;
      }
      const userIdElement = document.getElementsByClassName('gb_B gb_Za gb_0')[0];
      if (!userIdElement) {
        console.error('User ID element not found.');
        return;
      }
      const userId = userIdElement.getAttribute('aria-label').match(/[\w.-]+@[\w.-]+/)[0];
      const accounts = result.accounts || {};
      const account = accounts[userId];
      if (account) {
        const privateKeyArmored = account.privateKey;
        decryptEmailContent(privateKeyArmored);
      } else {
        console.error('Private key not found for user email:', userId);
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
    targetElement.appendChild(createDecryptButton());
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

// async function decryptEmailContent(privateKeyArmored) {
//   const textArea = document.getElementsByClassName('a3s aiL')[0];
//   if (!textArea) {
//     console.error('Email textarea not found.');
//     return;
//   }
//   const replace_text = 'The content belowed is encrypted by sender. Please decrypt using your own private key.\n';
//   const emailContent = textArea.textContent.replace(replace_text, '').trim(); // get the email content from the textarea
//   if (!emailContent) {
//     console.error('Email content is empty.');
//     return;
//   }

//   try {
//     const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });

//     const decrypted = await openpgp.decrypt({
//       message: await openpgp.readMessage({ armoredMessage: emailContent }), // parse armored message
//       decryptionKeys: privateKey, // decrypt with the private key
//     });

//     textArea.textContent = `Decrypted content:\n\n${decrypted.data}`;
//     console.log('Email content decrypted successfully.');
//   } catch (error) {
//     console.error('Error decrypting email content:', error);
//     alert('Failed to decrypt email content. Check the console for details.');
//   }
  
// }

async function decryptEmailContent(privateKeyArmored) {
  const textArea = document.getElementsByClassName('a3s aiL')[0];
  if (!textArea) {
    console.error('Email textarea not found.');
    return;
  }
  const replace_text = 'The content belowed is encrypted by sender. Please decrypt using your own private key.\n';
  const emailContent = textArea.textContent.replace(replace_text, '').trim(); // get the email content from the textarea
  if (!emailContent) {
    console.error('Email content is empty.');
    return;
  }

  try {
    // Read the private key
    const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
    // Prompt the user for the passphrase
    const passphrase = prompt('Please enter your passphrase:');
    if (passphrase === null) {
      console.error('Passphrase input cancelled by user.');
      return;
    }

    // Decrypt the private key if it is encrypted (has a passphrase)
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey: privateKey,
      passphrase: passphrase // Use an empty string if there is no passphrase
    });

    const decrypted = await openpgp.decrypt({
      message: await openpgp.readMessage({ armoredMessage: emailContent }), // parse armored message
      decryptionKeys: decryptedPrivateKey // decrypt with the decrypted private key
    });

    textArea.textContent = `Decrypted content:\n\n${decrypted.data}`;
    console.log('Email content decrypted successfully.');
  } catch (error) {
    console.error('Error decrypting email content:', error);
    alert('Failed to decrypt email content. Check the console for details.');
  }
}