// BrowserBot Tracking Script
(function() {
  const sendPageView = () => {
    const data = {
      customer_id: window.customer_id,
      page: window.location.href,
      referrer: document.referrer
    };

    console.log('Sending pageview data:', data);

    fetch('https://dbellcreations.com/browserbot/api/pixel.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Pageview response:', data);
    })
    .catch(error => {
      console.error('Error sending pageview:', error);
    });
  };

  // Send pageview when script loads
  if (document.readyState === 'complete') {
    sendPageView();
  } else {
    window.addEventListener('load', sendPageView);
  }
})();