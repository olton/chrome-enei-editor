const {
    Editor,
    ContentEdit,
    Paste,
    HyperLink,
    ImageEdit,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    toggleListType,
    setAlignment,
    toggleBlockQuote,
    toggleCodeBlock,
    setDirection,
    clearFormat, toggleSuperscript, toggleSubscript, setIndentation,
    createElement,
    insertImage,
    getFormatState,
    createLink, removeLink,
    setHeadingLevel,
} = roosterjs

const enei_storage = chrome.storage.local

const BUILD_VERSION = "0.1.0"

class EneiEditor {
    overlay = null
    editor = null
    container = null
    body = null
    canSave = false
    options = null

    constructor(options) {
        this.options = merge({
            serverEndpoint: '',
            maxHeight: 0,
        }, options)
        this.body = document.querySelector("body")
        this.restoreBlocks().then(()=>{})
    }

    createOverlay(){
        this.overlay = document.createElement("div")
        this.overlay.classList.add("enei__overlay")
        this.body.append(this.overlay)
        this.overlay.addEventListener('wheel', e => {
            e.stopPropagation()
        })
    }

    createEditor(){
        this.container = document.createElement("div")
        this.container.className = 'enei__editor'
        this.container.innerHTML = ENEI_EDITOR_HTML.replaceAll('__VERSION__', BUILD_VERSION)
        this.container.querySelectorAll("[data-i18n]").forEach(el => {
            const translation = chrome.i18n.getMessage(el.getAttribute("data-i18n"))
            el.setAttribute("title", translation)
        })
        this.overlay.append(this.container)
    }

    openEditor(){
        const self = this, forElement = this.current, o = this.options
        let {top, left, width} = forElement.getBoundingClientRect()
        if (top < 56) {
            top = 112
        }
        top -= 56
        if (window.innerHeight - top < 300) {
            top -= 100
        }
        this.createOverlay()
        this.createEditor()
        this.originalContent = forElement.innerHTML
        this.linkDialog = document.querySelector("#enei-dialog-link")
        this.content = this.container.querySelector(".enei__text")
        this.toolbar = this.container.querySelector(".enei__toolbar")
        this.container.style.top = `${top}px`
        this.container.style.left = `${left}px`
        this.container.style.width = `${width}px`
        this.container.style.maxHeight = `${o.maxHeight || window.innerHeight - top - 56}px`
        this.editor = new Editor(this.content, {
            plugins: [
                new ContentEdit(),
                new Paste(true),
                new HyperLink(href => 'Ctrl+click to open link ' + href),
                new ImageEdit(),
            ],
            initialContent: this.originalContent,
            inDarkMode: false,
        })

        const updateEditorHeight = () => {
            self.container.style.height = `${this.content.height + this.toolbar.scrollHeight + 70}px`
        }

        const button = name => this.container.querySelector(`.js-enei-${name}`)
        const setButtonState = (name, state) => button(name).classList[state ? 'add' : 'remove']('active')

        const updateButtonState = editorState => {

                const {isBold, isItalic, isUnderline, isStrikeThrough, isSubscript, isSuperscript, isBlockQuote,
                    isCodeInline, isCodeBlock, direction, canUndo, canRedo, textAlign, isBullet, isNumbering,
                    canUnlink, headingLevel, headerLevel} = editorState

                setButtonState('bold', isBold)
                setButtonState('italic', isItalic)
                setButtonState('underline', isUnderline)
                setButtonState('strike', isStrikeThrough)
                setButtonState('subscript', isSubscript)
                setButtonState('superscript', isSuperscript)
                setButtonState('quote', isBlockQuote)
                setButtonState('code', isCodeBlock || isCodeInline)
                setButtonState('ltr', direction === 'ltr')
                setButtonState('rtl', direction === 'rtl')
                setButtonState('p-left', ['start', 'left'].includes(textAlign))
                setButtonState('p-center', textAlign === 'center')
                setButtonState('p-right', ['end', 'right'].includes(textAlign))
                setButtonState('list-num', isNumbering)
                setButtonState('list-bull', isBullet)

                button('unlink').disabled = !canUnlink
                button('undo').disabled = !canUndo
                button('redo').disabled = !canRedo
                button('revert').disabled = !(canRedo || canUndo)

                button('heading').innerHTML = headingLevel > 0 ? `H${headingLevel}` : "R"
                button('heading').setAttribute('title', headingLevel > 0 ? chrome.i18n.getMessage(`heading${headingLevel}`) : chrome.i18n.getMessage(`regular`))

                this.canSave = canRedo || canUndo
                button('save').disabled = !this.canSave
            }

        ;["keyup", "mouseup", "input", "click", "contentchanged"].forEach( ev => {
            this.content.addEventListener(ev, () => {updateButtonState(getFormatState(this.editor))})
        })

        const focus = () => {
            this.content.focus()
            updateEditorHeight()
            updateButtonState(getFormatState(this.editor))
        }

        focus()

        this.content.addEventListener("input", () => {
            updateEditorHeight()
        })

        const addEvent = (btn, fun) => {this.container.querySelector(`.js-enei-${btn}`).addEventListener("click", fun)}

        addEvent('cancel', () => {
            this.closeEditor()
        })

        addEvent('save', async () => {
            await this.saveEditor()
        })

        addEvent('heading', (e) => {
            const btn = e.target
            btn.classList.toggle('active')
        })

        this.toolbar.querySelectorAll(".js-enei-heading + ul > li").forEach(el => {
            el.addEventListener("click", () => {
                const level = +el.getAttribute('value')
                setHeadingLevel(this.editor, level)
                this.toolbar.querySelector(`.js-enei-heading`).classList.remove("active")
                focus()
            })
        })

        addEvent("bold", () => {
            toggleBold(this.editor)
            focus()
        })

        addEvent("italic", () => {
            toggleItalic(this.editor)
            focus()
        })

        addEvent("underline", () => {
            toggleUnderline(this.editor)
            focus()
        })

        addEvent("strike", () => {
            toggleStrikethrough(this.editor)
            focus()
        })

        addEvent("superscript", () => {
            toggleSuperscript(this.editor)
            focus()
        })

        addEvent("subscript", () => {
            toggleSubscript(this.editor)
            focus()
        })

        addEvent("list-num", () => {
            toggleListType(this.editor, 1)
            focus()
        })

        addEvent("list-bull", () => {
            toggleListType(this.editor, 2)
            focus()
        })

        addEvent("p-left", () => {
            setAlignment(this.editor, 0)
            focus()
        })

        addEvent("p-center", () => {
            setAlignment(this.editor, 1)
            focus()
        })

        addEvent("p-right", () => {
            setAlignment(this.editor, 2)
            focus()
        })

        addEvent("quote", () => {
            toggleBlockQuote(this.editor)
            focus()
        })

        addEvent("code", () => {
            toggleCodeBlock(this.editor)
            focus()
        })

        addEvent("indent-increase", () => {
            setIndentation(this.editor, 0)
            focus()
        })

        addEvent("indent-decrease", () => {
            setIndentation(this.editor, 1)
            focus()
        })

        addEvent("undo", () => {
            this.editor.undo()
            focus()
        })

        addEvent("redo", () => {
            this.editor.redo()
            focus()
        })

        addEvent("ltr", () => {
            setDirection(this.editor, 0)
            focus()
        })

        addEvent("rtl", () => {
            setDirection(this.editor, 1)
            focus()
        })

        addEvent("clear-format", () => {
            clearFormat(this.editor, 0)
            focus()
        })

        addEvent('unlink', () => {
            removeLink(this.editor)
            focus()
        })

        addEvent("link", () => {
            this.linkDialog.querySelector('[name=enei-dialog-link__display]').value = this.editor.getSelectionRange()
            this.linkDialog.showModal()
            focus()
        })

        this.linkDialog.querySelector(".js-enei-dialog-link__button-cancel").addEventListener("click", () => {
            this.linkDialog.close();
        })

        this.linkDialog.addEventListener("close", () => {
            if (this.linkDialog.returnValue !== "ok") {
                return
            }
            let link = this.linkDialog.querySelector('[name=enei-dialog-link__url]').value.trim()
            let display = this.linkDialog.querySelector('[name=enei-dialog-link__display]').value.trim()
            if (!link) {
                return
            }
            if (!display) {
                display = link
            }
            createLink(this.editor, link, display, display, "_blank")
        })

        addEvent("image", () => {
            const document = this.editor.getDocument()
            const fileInput = createElement({
                tag: "input",
                attributes: {
                    type: "file",
                    accept: "image/*",
                    display: "none"
                }
            }, this.editor.getDocument())
            document.body.appendChild(fileInput)
            fileInput.addEventListener('change', () => {
                if (fileInput.files) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        insertImage(this.editor, fileInput.files[i]);
                    }
                }
            })
            try {
                fileInput.click()
            } finally {
                document.body.removeChild(fileInput)
            }

            focus()
        })

        addEvent('revert', () => {
            this.editor.setContent(this.originalContent)
        })

        window.addEventListener("keydown", this.keyDownHandle.bind(this) )
    }

    closeEditor(){
        this.canSave = false
        this.editor.dispose()
        this.overlay.remove()
        window.removeEventListener("keydown", this.keyDownHandle )
    }

    async keyDownHandle(event){
        if (event.repeat) return
        if (event.key === "Escape") {
            this.closeEditor()
            return
        }
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            await this.saveEditor()
        }
    }

    async saveEditor(){
        const newContent = this.content.innerHTML
        const forElement = this.current
        if (this.canSave) {
            forElement.innerHTML = newContent
            const id = forElement.getAttribute('enei')
            const result = this.options.serverEndpoint ? await this.commitBlock(id, newContent) : [id]
            if (result.includes(id)) {
                await this.saveBlock(id, newContent)
            } else {
                this.current.innerHTML = this.originalContent
            }
        }
        this.closeEditor()
    }

    async commitBlock(id, content){
        const {serverEndpoint} = this.options
        const res = await fetch(`${serverEndpoint}/commit-blocks`, {
            method: "POST",
            body: JSON.stringify([{
                id,
                content
            }]),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) {
            alert(`Block not committed!`)
            return null
        }
        return await res.json()
    }

    async saveBlock(id, content){
        let data = await enei_storage.get(["ENEI"])
        if (!data || !data["ENEI"]) {
            data = {"ENEI": {}}
        }
        data["ENEI"][id] = content
        await enei_storage.set({"ENEI": data["ENEI"]})
    }

    async saveBlocks(){
        const data = {"ENEI": {}}
        const blocks = document.querySelectorAll("[enei]")
        blocks.forEach(el => {
            data["ENEI"][el.getAttribute("enei")] = el.innerHTML.trim()
        })
        await enei_storage.set({"ENEI": data})
    }

    async restoreBlocks(){
        let data = await enei_storage.get(["ENEI"])
        for(let id in data["ENEI"]) {
            const el = document.querySelector(`[enei=${id}]`)
            if (el) el.innerHTML = data["ENEI"][id]
        }
    }

    async restoreBlock(id){
        let data = await enei_storage.get(["ENEI"])
        if (!data || !data["ENEI"][id]) {
            return
        }
        document.querySelector(`[enei=${id}]`).innerHTML = data["ENEI"][id]
    }

    open(target){
        this.current = target
        this.openEditor()
    }
}

const eneiEditor = new EneiEditor({
    serverEndpoint: ''
})

const eneiClickHandler = function() {
    eneiEditor.open(this)
}

chrome.runtime.onMessage.addListener((req, ...rest)=>{
    const eneiEls = document.querySelectorAll("[enei]")
    if (req.action === 'ON') {
        ;[...eneiEls].forEach(el => {
            el.addEventListener("click", eneiClickHandler)
        })
    } else {
        ;[...eneiEls].forEach(el => {
            el.removeEventListener("click", eneiClickHandler)
        })
    }
})