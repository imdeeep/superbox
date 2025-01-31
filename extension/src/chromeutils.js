const axios = require("axios");
import { BASE_URL } from "./constant/data";

// Main function that capture DOM content
export const saveContext = async (setContexts,uid) => {
  console.log(uid);
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => {
            const extensionElements = document.querySelectorAll('[id^="chrome-extension"], .extension-class');
            extensionElements.forEach(el => el.remove());
            return document.body.innerText || document.body.outerHTML;
          },
        },
        async (injectionResults) => {
          if (injectionResults && injectionResults[0].result) {
            const capturedContent = injectionResults[0].result;

            try {
              const response = await axios.post(`${BASE_URL}api/v1/context/temp`, {
                oldContext: capturedContent,
                title: "defaultTitle",
                userId : uid,
              });
              console.log(response.data.refineContext);
              setContexts((prevContexts) => [...prevContexts, response.data.refineContext]);
            } catch (error) {
              console.log("Error in saving Context:", error);
              setContexts((prevContexts) => [...prevContexts, capturedContent]);
            }
          }
        }
      );
    }
  });
};

export const saveContextWithOrg = async (setContexts, orgId,uid) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => {
            const extensionElements = document.querySelectorAll('[id^="chrome-extension"], .extension-class');
            extensionElements.forEach(el => el.remove());
            return document.body.innerText || document.body.outerHTML;
          },
        },
        async (injectionResults) => {
          if (injectionResults && injectionResults[0].result) {
            const capturedContent = injectionResults[0].result;

            try {
              console.log("Working ...")
              const response = await axios.post(`${BASE_URL}api/v1/context/continue`, {
                oldContext: capturedContent,
                orgId: orgId,
                temporary : false,
                userId : uid,
              });
              console.log("Done")
              console.log(response.data.refineContext);
              setContexts((prevContexts) => [...prevContexts, response.data.refineContext]);
            } catch (error) {
              console.log("Error in saving Context:", error);
              setContexts((prevContexts) => [...prevContexts, capturedContent]);
            }
          }
        }
      );
    }
  });
}