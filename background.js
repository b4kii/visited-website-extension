// TODO: add option to exclude some websites

import {
    excludeWebsites,
    changeIcon,
    getTabData,
    UNVISITED_ICON,
    VISITED_ICON,
    VISITED_DOMAIN_ICON,
} from "./utils.js";

changeIcon(UNVISITED_ICON);

let visitedWebsites = [];

async function pushUrl(url, activated = false) {
    // await chrome.storage.sync.remove("urls");

    const { urls } = await chrome.storage.sync.get(["urls"]);

    visitedWebsites = urls ?? [];

    console.log(visitedWebsites);

    if (excludeWebsites.includes(url)) return;

    const visitedWebsiteIndex = visitedWebsites.findIndex(
        item => item.visitedUrl === url
    );

    const urlObj = new URL(url);
    const { hostname } = urlObj;

    const visitedDomain = visitedWebsites?.some(website =>
        website?.visitedUrl?.includes(hostname)
    );

    console.log(visitedWebsites);

    if (visitedWebsiteIndex === -1) {
        visitedWebsites.push({
            visitedUrl: url,
            visitedCount: 1,
        });

        await chrome.storage.sync.set({ urls: visitedWebsites });

        if (visitedDomain) changeIcon(VISITED_DOMAIN_ICON);
        else changeIcon(UNVISITED_ICON);
        return;
    }

    const visitedWebsite = visitedWebsites[visitedWebsiteIndex];

    if (visitedWebsite.visitedCount < 2 && !activated) {
        visitedWebsite.visitedCount++;
        changeIcon(VISITED_ICON);
        return;
    }

    if (visitedWebsite.visitedCount === 2) {
        console.log(visitedWebsite.visitedCount);
        changeIcon(VISITED_ICON);
        return;
    }
    changeIcon(UNVISITED_ICON);
}

chrome.webNavigation.onBeforeNavigate.addListener(details => {
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
