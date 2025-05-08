// Chrome extension service worker
// This service worker handles browser events like installation, activation, and message passing
// It also opens the index.html page in a new tab when the extension icon is clicked

// Listen for when the browser installs the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for when the user clicks on the extension icon
chrome.action.onClicked.addListener(() => {
  // Open the index.html page in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html'),
  });
});

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  // Process the message based on the action
  if (message && message.action === 'hello') {
    // Send a more detailed response for our AboutView button
    sendResponse({
      status: 'success',
      message: 'Message received by the background script module!',
      receivedData: message.data,
      timestamp: new Date().toISOString(),
      sender: sender.url || 'Unknown source',
    });
  } else {
    // Default response for other messages
    sendResponse({
      status: 'received',
      timestamp: new Date().toISOString(),
    });
  }

  return true; // Keep the message channel open for async responses
});
