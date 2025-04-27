(function() {
  'use strict';

  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(method, url) {
    if (url.includes('/TweetDetail?')) {
      try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);

        if (params.has('variables')) {
          const variables = JSON.parse(decodeURIComponent(params.get('variables')));
          variables.rankingMode = "Likes";
          params.set('variables', JSON.stringify(variables));

          url = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
        }
      } catch (error) {
        console.error('Twitter Sort By Likes script error:', error);
      }
    }

    return originalOpen.apply(this, [method, url]);
  };
})();
