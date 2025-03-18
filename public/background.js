chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveData") {
      chrome.storage.local.set({ savedText: request.data }, () => {
        console.log("Data saved in storage:", request.data);
        sendResponse({ success: true });
      });
      return true;
    }
  
    if (request.action === "getData") {
      chrome.storage.local.get(["savedText"], (result) => {
        sendResponse({ data: result.savedText || "" });
      });
      return true;
    }
  });