(function() {
  'use strict';
  let userSortedReplies = false;
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (url.includes('/TweetDetail?')) {
      try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        if (params.has('variables')) {
          const variables = JSON.parse(decodeURIComponent(params.get('variables')));

          if (!userSortedReplies) {
            variables.rankingMode = "Likes";
            params.set('variables', JSON.stringify(variables));
            url = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
          }
        }
      } catch (error) {
        console.error('Twitter Sort By Likes script error:', error);
      }
    }

    return originalOpen.apply(this, [method, url]);
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const $popup = /** @type {HTMLElement} */ (node);

          if ($popup.innerHTML.includes('>Sort replies by<')) {
            handleSortRepliesPopup($popup);
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  async function handleSortRepliesPopup($popup) {
    try {
      const $dropdown = await getElement('[role="menu"] [data-testid="Dropdown"]');
      const $menuItems = $dropdown.querySelectorAll('div[role="menuitem"]');
      const $selectedSvg = $popup.querySelector('div[role="menuitem"] svg');

      for (let [index, $menuItem] of $menuItems.entries()) {
        const shouldBeSelected = index === 2; // 0: Relevant, 1: Recent, 2: Liked
        if (shouldBeSelected && $selectedSvg) {
          $menuItem.lastElementChild.append($selectedSvg);
        }
        $menuItem.addEventListener('click', () => {
          userSortedReplies = true;
        });
      }
    } catch (error) {
      console.error('Twitter Sort By Likes menu error:', error);
    }
  }

  function getElement(selector) {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
      }, 50);
    });
  }

})();
