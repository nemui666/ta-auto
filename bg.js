chrome.contextMenus.create({
	"title": "TA一括前日コピー",
	"type": "normal",
	"contexts": ["all"],
	"onclick": function(info) {
		getTabId("www.tamgr.com")
		.then(tabId => {
			updateTab(tabId, "https://www.tamgr.com/IBS/work-condition?ta-auto-copy", _ => {})
		})
		.catch(
		_ => {
			alert("TA-Managerを開いてください。")
		})
	}
});

var updateTab = (tabId, url, callback) => {
	//update url of current tab
		chrome.tabs.update(tabId, { url: url }, () => {
		chrome.tabs.onUpdated.addListener(function listenTab(tabnumber, info, tab) {
			if (tab.url.indexOf(url) > -1 && info.status == "complete") {
				chrome.tabs.onUpdated.removeListener(listenTab)
				callback()
			}
		})
	})
}

var getTabId = (dn) => {
	return new Promise(function(accept, reject) {
		chrome.tabs.query({}, tabs => {
				for (var tab in tabs) {
						if (tabs[tab].url.indexOf(dn) > -1) {
							accept(tabs[tab].id)
							break
						}
						else if (tab == tabs.length - 1)
							reject()
					}
		})
	})
}
