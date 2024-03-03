// add option to exclude some websites
// add storage sync implementation

const visitedWebsites = [];
const excludeWebsites = [
    "chrome://new-tab-page/",
    "chrome://newtab/",
];

const VISITED_COLOR = "#FF0000";
const UNVISITED_COLOR = "#00FF00";
const VISITED_DOMAIN_COLOR = "#FFA500";

const VISITED_ICON = "icons/eye-bg-w.png";
const UNVISITED_ICON = "icons/hidden-bg-w.png"; 
const VISITED_DOMAIN_ICON = "icons/eye-greyed.png"; 

function changeIcon(icon) {
    // const canvas = new OffscreenCanvas(16, 16);
    // const context = canvas.getContext("2d");
    // context.clearRect(0, 0, 16, 16);
    // context.fillStyle = color; // Green
    // context.fillRect(0, 0, 16, 16);
    // const imageData = context.getImageData(0, 0, 16, 16);

    chrome.action.setIcon({ path: icon }, () => { });
}

// changeIcon("#00FF00");
changeIcon(UNVISITED_ICON);

async function getTabData(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);
        return tab;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function pushUrl(url, activated = false) {
    if (excludeWebsites.includes(url)) return;

    const visitedWebsiteIndex = visitedWebsites.findIndex(
        item => item.visitedUrl === url
    );

    const urlObj = new URL(url);
    const { hostname } = urlObj;

    const visitedDomain = visitedWebsites?.some(website => website?.visitedUrl?.includes(hostname));

    console.log(visitedWebsites);

    console.log("1");

    if (visitedWebsiteIndex === -1) {
        visitedWebsites.push({
            visitedUrl: url,
            visitedCount: 1,
        });

        if (visitedDomain)
            // changeIcon(VISITED_DOMAIN_COLOR);
            changeIcon(VISITED_DOMAIN_ICON);
        else
            // changeIcon(UNVISITED_COLOR);
            changeIcon(UNVISITED_ICON);
        console.log("2")
        return;
    }

    const visitedWebsite = visitedWebsites[visitedWebsiteIndex];

    if (visitedWebsite.visitedCount < 2 && !activated) {
        visitedWebsite.visitedCount++;
        // changeIcon(VISITED_COLOR);
        changeIcon(VISITED_ICON);
        return;
    }

    console.log("3")
    if (visitedWebsite.visitedCount === 2) {
        console.log(visitedWebsite.visitedCount);
        changeIcon(VISITED_ICON);
        // changeIcon(VISITED_COLOR);
        return;
    }
    // changeIcon(UNVISITED_COLOR);
    changeIcon(UNVISITED_ICON);
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     const { url, status } = changeInfo;

//     if (url) {
//         console.log("updated", url);
//         pushUrl(url);
//     }
// });

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0 && details.tabId !== -1) {
        pushUrl(details.url);
    }
});

chrome.tabs.onActivated.addListener(async activeInfo => {
    const { tabId } = activeInfo;
    const { url } = (await getTabData(tabId)) || {};

    if (url) {
        pushUrl(url, true);
    }

});
