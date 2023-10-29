// For bookmarks creation
chrome.bookmarks.onCreated.addListener((id, bookmarkNode) => {
  if (!bookmarkNode.url) return;

    chrome.tabs.query({url: bookmarkNode.url}, (tabs) => {
        if (tabs.length === 0) return;
        
        const tab = tabs[0];
        promptUserForPreference(bookmarkNode.url);
        console.log(JSON.stringify(tab.url));
        console.log(JSON.stringify(tab.title));
        console.log(JSON.stringify(tab.favIconUrl));
        sendDataToServer(tab.title, tab.url, tab.favIconUrl);
    });
  
  
    
});
chrome.tabs.onCreated.addListener((tab) => {
  promptUserForPreference(tab.url);
  // You can add additional logic here
});
  function showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'https://icon.horse/icon/youtube.com',  // Path to your extension's icon or any other asset
      title: title,
      message: message
    });
  }

  function promptUserForPreference(url) {
    chrome.notifications.create ({
        type: "basic",
        title: "URL Preference",
        message: `Do you like the website: ${url}?`,
        iconUrl: 'https://icon.horse/icon/youtube.com',
        buttons: [
            { title: "Good" },
            { title: "Bad" }
        ]
    });
  }
  function sendDataToServer(title, url, icon) {
    fetch('http://localhost:3000/storeBookmarkDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            url: url,
            icon: icon
        
        }),
    })
    .then(response => {console.log(response)})

    .catch(error => console.error('Error sending data:', error));
}
