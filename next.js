setTimeout(() => {
  // Find first shadow DOM
  const shadowDom1 = document.querySelector('c-snhu-ap-app-action-item-layout');
  if (!shadowDom1 || !shadowDom1.shadowRoot) return;

  const shadowDom1inside = shadowDom1.shadowRoot;
  const shadowDom2 = shadowDom1inside.querySelector('c-snhu-ap-app-action-item-grouping');
  if (!shadowDom2) return;

  // Use shadowRoot if it exists, otherwise use the element itself
  const shadowDom2inside = shadowDom2.shadowRoot ? shadowDom2.shadowRoot : shadowDom2;
  if (!shadowDom2inside) return;

  // Change header
   const headerchange = groupingInside.querySelector('.snhu-document-heading');
  const uploadText = groupingInside.querySelector('.snhu-upload-text')
  if (headerchange) {
    headerchange.innerHTML = `
      <span class="snhu-content-heading snhu-document-content-heading" lwc-6pustum0aq9="">
        If we reached out to you
        <span class="snhu-content-inner" lwc-6pustum0aq9="">
          for specific documents, please upload them on our document upload page.
        </span>
      </span>
    `;
  }

  // Optional Docs Button logic
  const optionalDocsButton = shadowDom2inside.querySelector('[data-optional-document="true"]');
  if (optionalDocsButton) {
    optionalDocsButton.addEventListener("click", function () {
      const shadowDomadditionaldocs = shadowDom1inside.querySelector('c-snhu-ap-app-additional-document-upload');
      if (!shadowDomadditionaldocs || !shadowDomadditionaldocs.shadowRoot) return;
      const shadowDomadditionaldocsinside = shadowDomadditionaldocs.shadowRoot;

      const copychange = shadowDomadditionaldocsinside.querySelector('.slds-p-bottom_x-small');
      if (copychange) {
        copychange.innerHTML = 'SNHU may have requested certain documents from you. These documents will be added to your official admission record. You can upload requested documents on this page. If you need assistance, please don’t hesitate to reach out to the admission team by text or phone at <a href="tel:888.387.0861">888.387.0861</a> or email them at <a href="mailto:admissions@snhu.edu">admissions@snhu.edu</a>. <br><br> <strong style="font-family: Snhu_font_bold;">IMPORTANT: Please do not upload any document (like driver’s license or diploma) unless we’ve specifically requested it.</strong> ';
      }
      const headerchange2 = shadowDomadditionaldocsinside.querySelector('.slds-p-top_x-large');
      if (headerchange2) {
        headerchange2.innerHTML = 'If we reached out to you...';
      }
    });
  } else {
    console.error("optionalDocsButton not found inside shadowDom2inside");
  }
}, 1000);