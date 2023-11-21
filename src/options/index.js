window.addEventListener("load", async () => {
    chrome.storage.sync.get(['ENEI_SERVER_ENPOINT'], (result) => {
        const input = document.querySelector("#enei_server_endpoint")
        input.value = result.ENEI_SERVER_ENPOINT
    })

    const saveBtn = document.querySelector("#js-enei-save")
    saveBtn.addEventListener("click", () => {
        chrome.storage.sync.set({ENEI_SERVER_ENPOINT: document.querySelector("#enei_server_endpoint").value})
        close()
    })

    const cancelBtn = document.querySelector("#js-enei-cancel")
    cancelBtn.addEventListener("click", () => {
        close()
    })
})

