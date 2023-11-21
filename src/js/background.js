chrome.runtime.onInstalled.addListener(async () => {
    await chrome.action.setBadgeText({ text: "OFF",});
    await chrome.action.setBadgeBackgroundColor({ color: 'red', });
});

const css = `[enei] {border: 1px dashed #468cff!important;}`

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith('http')) {
        const prevState = await chrome.action.getBadgeText({tabId: tab.id})
        const nextState = prevState === 'ON' ? 'OFF' : 'ON'
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        })
        await chrome.action.setBadgeBackgroundColor({
            tabId: tab.id,
            color: nextState === 'ON' ? 'green' : 'red'
        })
        await chrome.tabs.sendMessage(tab.id, {
            action: nextState
        })
        if (nextState === 'ON') {
            await chrome.scripting.insertCSS({
                target: {tabId: tab.id},
                css
            })
        } else {
            await chrome.scripting.removeCSS({
                target: {tabId: tab.id},
                css
            })
        }
    }
})