//NOTE: Adding this async function to wait for the web component to load so the content will render correctly
// Sometimes the Shadow DOM wouldnt load before the code started causing the code not to function properly so this just waits on the Shadow DOM 

async function waitFor(selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(res => setTimeout(res, 100));
  }
  return null;
}

async function waitForShadowSelector(host, selector, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (host.shadowRoot) {
      const el = host.shadowRoot.querySelector(selector);
      if (el) return el;
    }
    await new Promise(res => setTimeout(res, 100));
  }
  return null;
}

(async function main() {
  // Wait for main layout
  const layout = await waitFor('c-snhu-ap-app-action-item-layout');
  if (!layout || !layout.shadowRoot) return;

  // Wait for grouping
  const shadowParent = layout.shadowRoot.querySelector('c-snhu-ap-app-action-item-grouping');
  if (!shadowParent) return;

  // Wait for grouping content inside shadow DOM
  const shadowChild = await waitForShadowSelector(shadowParent, '.snhu-grouping-content');
  if (!shadowChild) return;

  // Now continue with your logic, using shadowChild, snhuButtons, etc.
  //NOTE: This Delays the script a bit to give the page time to load
setTimeout(async () => {
  function waitFor(selector) {
    return new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    });
  }
  /*NOTE: setting a variable for the elements in the ShadowDOM 
  Documentation on ShadowDOM: we must use the Shadow DOM API and a function called shadowRoot to access the inner contents of each custom HTML element */
  const layout = await waitFor('c-snhu-ap-app-action-item-layout');
  const shadowRoot = layout.shadowRoot;
  const shadowParent = shadowRoot.querySelector('c-snhu-ap-app-action-item-grouping');
  const shadowChild = await waitForShadowSelector(shadowParent, '.snhu-grouping-content');
  const snhuButtons = Array.from(shadowChild.querySelectorAll('.snhu-statusWrap'));
  const rightLayout = shadowRoot.querySelector('.snhu-rightLayout');
  const leftLayout = shadowRoot.querySelector('.snhu-leftLayout');
  rightLayout.classList.add('right-layout');
    //Button for Optional Document
const optionalBtn = shadowChild.querySelector('button[data-optional-document="true"]');
if (optionalBtn) {
  optionalBtn.addEventListener('click', function() {
    rightLayout.classList.remove('snhu-rightLayout');
  });
} else {
  rightLayout.classList.add('snhu-rightLayout');
}
/*NOTE: Here we need to loop through all the buttons with the class name 'snhu-statusWrap'  -1 because we do not want to include the last button (optional Documents) */
  for (let index = 0; index < snhuButtons.length - 1; index++) {
    const button = snhuButtons[index];
    //NOTE: Wanted to Simulate click to show right panel so we can clone its contents under the button being clicked
    //Sidenote: The right layout only exist when each button is clicked so this is needed to render all an append under each button
    button.click();
    await new Promise(res => setTimeout(res, 500)); // Wait for panel to update
  /* NOTE: Found out that cloning the buttons from the rightlayout renders the buttons non functional, This code finds the button in the Shadow DOM  and delegates the clicks
  from the cloned button to the original  */
    let realBtn = null;
    const eSignEl = rightLayout?.querySelector('c-snhu-ap-e-sign-redirection');
    if (eSignEl) {
      while (!eSignEl.shadowRoot) await new Promise(res => setTimeout(res, 50));
      realBtn = eSignEl.shadowRoot.querySelector('button');
    }
    /* NOTE: since the ask is to keep the optional document button functionality the same as mobile  
 this code will hide and show the right layout when its clicked   */
const optionalBtn = shadowChild.querySelector('button[data-optional-document="true"]');
if (optionalBtn) {
  optionalBtn.addEventListener('click', function() {
    rightLayout.classList.remove('snhu-rightLayout');
  });
} else {
  button.addEventListener('click', function() {
    rightLayout.classList.add('snhu-rightLayout');
  });
}
// Adding a button to close the right Layout if the user wanted to 
const newBtn = document.createElement('button');
newBtn.textContent = '<';
newBtn.className = 'option-close'; 
newBtn.addEventListener('click', function() {
   rightLayout.classList.add('snhu-rightLayout');
});
if (!rightLayout.querySelector('.option-close')) {
  rightLayout.insertBefore(newBtn, rightLayout.firstChild);
}
    // Extract content for rendering
    //NOTE: All elements rendered are NOT the same so added conditionals here to account for content outside of specific templates
    let progressHtml = '';
    const progressEl = rightLayout?.querySelector('c-snhu-ap-app-action-item-status-progress-indicator');
    if (progressEl && progressEl.shadowRoot) {
      const todoIcon = progressEl.shadowRoot.querySelector('.snhu-firstSection');
      const onItIcon = progressEl.shadowRoot.querySelector('.snhu-secondSection ');
      const completeIcon = progressEl.shadowRoot.querySelector('.snhu-thirdSection');
      let progressText = snhuButtons[index].querySelector('.snhu-link-heading').textContent;
  switch (progressText) {
  case "SNHU's on it":
    progressHtml = onItIcon.outerHTML;
    break;
  case "Completed":
  progressHtml = completeIcon.outerHTML;
    break;
  case "Todo":
  progressHtml = todoIcon.outerHTML;
   todoIcon
    break;
  default:
    console.log("Unknown Text");
     progressHtml = todoIcon.outerHTML;
    break;
}
    }
    if (progressHtml) {
  // Create a temporary container to parse the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = progressHtml;
  // Insert each child node at the beginning of the button
  Array.from(tempDiv.childNodes).reverse().forEach(node => {
    button.insertBefore(node, button.firstChild);
  });
}
    let rejectHtml = '';
    const rejectEl = rightLayout?.querySelector('c-snhu-ap-app-document-reject-section');
    if (rejectEl && rejectEl.shadowRoot) {
      rejectHtml = rejectEl.shadowRoot.innerHTML;
    }
    let snhuContentHtml = '';
    const snhuContentEl = rightLayout?.querySelector('.snhu-content');
    if (snhuContentEl) {
      snhuContentHtml = snhuContentEl.outerHTML;
    } else if (eSignEl && eSignEl.shadowRoot) {
      // Try to find .snhu-content inside the e-sign redirection shadow DOM
      const snhuContentInESign = eSignEl.shadowRoot.querySelector('.snhu-content');
      if (snhuContentInESign) {
        snhuContentHtml = snhuContentInESign.outerHTML;
      }
    }
    // Render your custom content
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-clone';
    wrapper.innerHTML = `
      <div class="document-reject">${rejectHtml}</div>
      <div class="snhu-content-block">${snhuContentHtml}</div>
      ${eSignEl && realBtn ? `<div class="e-sign"><button class="my-custom-esign">${realBtn.textContent.trim()}</button></div>` : ''}
    `;
    // Delegate custom button click to the real e-sign button
    const customBtn = wrapper.querySelector('.my-custom-esign');
    if (customBtn && realBtn) {
      customBtn.addEventListener('click', () => {
        realBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
        realBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
        realBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      });
    }
    button.insertAdjacentElement('afterend', wrapper);
    setTimeout(() => {
  wrapper.classList.add('animated-in');
}, 10);
  }
  snhuButtons.forEach(btn => btn.classList.remove('snhu-active'));
shadowChild.addEventListener('click', function(event) {
  const btn = event.target.closest('.snhu-statusWrap');
  if (!btn) return;
  // Remove active class from all buttons
  snhuButtons.forEach(b => b.classList.remove('snhu-active'));
  btn.classList.add('snhu-active');
  // Show/hide rightLayout based on button type
  if (btn.dataset.optionalDocument === "true") {
    rightLayout.classList.remove('snhu-rightLayout');
  } else {
    rightLayout.classList.add('snhu-rightLayout');
  }
});
}, 2000);

})();



