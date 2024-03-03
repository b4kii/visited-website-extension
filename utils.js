export const excludeWebsites = [
    "chrome://new-tab-page/",
    "chrome://newtab/",
    "chrome://extensions"
];

export const VISITED_ICON = "icons/eye-bg-w.png";
export const UNVISITED_ICON = "icons/hidden-bg-w.png"; 
export const VISITED_DOMAIN_ICON = "icons/eye-greyed.png"; 

export function changeIcon(icon) {
    // const canvas = new OffscreenCanvas(16, 16);
    // const context = canvas.getContext("2d");
    // context.clearRect(0, 0, 16, 16);
    // context.fillStyle = color; // Green
    // context.fillRect(0, 0, 16, 16);
    // const imageData = context.getImageData(0, 0, 16, 16);

    chrome.action.setIcon({ path: icon }, () => { });
}

export async function getTabData(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);
        return tab;
    } catch (error) {
        console.log(error);
        return null;
    }
}