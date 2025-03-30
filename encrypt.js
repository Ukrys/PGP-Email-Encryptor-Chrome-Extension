window.openpgp = openpgp
// createEncryptButton
function createEncryptButton() {
  const button = document.createElement('button');
  button.id = 'encrypt-email-button';
  button.textContent = '🔒';
  // button.style.marginTop = '10px';
  // button.style.padding = '10px';
  // button.style.backgroundColor = '#4CAF50';
  // button.style.color = 'white';
  // button.style.border = 'none';
  // button.style.cursor = 'pointer';
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
    // contentDiv.textContent = 'Encrypt Email ';
    
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
    button.style.fontSize = '20px';
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