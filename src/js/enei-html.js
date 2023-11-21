const ENEI_EDITOR_HTML =  `
<dialog id="enei-dialog-link" class="enei-dialog js-enei-dialog-link">
    <form method="dialog">
        <header>
            <h3>Create Link</h3>        
        </header>
        <main>    
            <div>
                <label>Web Address (URL)</label>
                <input type="url" name="enei-dialog-link__url" placeholder="https://domain.com">
            </div>
            
            <div style="margin-top: 10px">
                <label>Display as</label>
                <input type="text" name="enei-dialog-link__display">
            </div>
        </main>
        <div class="enei-dialog__actions">
            <button class="enei__button js-enei-dialog-link__button-ok" type="submit" value="ok">OK</button>
            <button class="enei__button js-enei-dialog-link__button-cancel" type="reset" value="cancel">Cancel</button>
        </div>
    </form>
</dialog>
<div class="enei__toolbar">
    <button data-i18n="bold" class="enei__tool-button js-enei-bold" title="Bold"><span class="ei-bold"></span></button>
    <button data-i18n="italic" class="enei__tool-button js-enei-italic" title="Italic"><span class="ei-italic"></span></button>
    <button data-i18n="underline" class="enei__tool-button js-enei-underline" title="Underline"><span class="ei-underline"></span></button>
    <button data-i18n="strike" class="enei__tool-button js-enei-strike" title="Strike"><span class="ei-strike"></span></button>

    <button data-i18n="superscript" class="enei__tool-button js-enei-superscript" title="Superscript"><span class="ei-superscript"></span></button>
    <button data-i18n="subscript" class="enei__tool-button js-enei-subscript" title="Subscript"><span class="ei-subscript"></span></button>

    <button data-i18n="list_num" class="enei__tool-button js-enei-list-num" title="Numbered List"><span class="ei-list1"></span></button>
    <button data-i18n="list_bull" class="enei__tool-button js-enei-list-bull" title="Bulleted List"><span class="ei-list2"></span></button>
    
    <div class="enei__dropdown">
        <button data-i18n="heading" class="enei__tool-button js-enei-heading" title="Heading">R</button>
        <ul>
            <li data-i18n="heading1" class="js-enei-heading1" value="1">Heading 1</li>
            <li data-i18n="heading2" class="js-enei-heading2" value="2">Heading 2</li>
            <li data-i18n="heading3" class="js-enei-heading3" value="3">Heading 3</li>
            <li data-i18n="heading4" class="js-enei-heading4" value="4">Heading 4</li>
            <li data-i18n="heading5" class="js-enei-heading5" value="5">Heading 5</li>
            <li data-i18n="heading6" class="js-enei-heading6" value="6">Heading 6</li>
            <li class="divider"></li>
            <li data-i18n="regular" class="js-enei-regular" value="0">Regular Text</li>
        </ul>
    </div>

    <button data-i18n="p_left" class="enei__tool-button js-enei-p-left" title="Align Left"><span class="ei-paragraph-left"></span></button>
    <button data-i18n="p_center" class="enei__tool-button js-enei-p-center" title="Align Center"><span class="ei-paragraph-center"></span></button>
    <button data-i18n="p_right" class="enei__tool-button js-enei-p-right" title="Align Right"><span class="ei-paragraph-right"></span></button>

    <button data-i18n="link" class="enei__tool-button js-enei-link" title="Insert Link"><span class="ei-link"></span></button>
    <button data-i18n="unlink" class="enei__tool-button js-enei-unlink" title="Remove Link"><span class="ei-switch"></span></button>
    <button data-i18n="image" class="enei__tool-button js-enei-image" title="Insert Image"><span class="ei-image"></span></button>
    <button data-i18n="quote" class="enei__tool-button js-enei-quote" title="Quoted text"><span class="ei-quotes-right"></span></button>
    <button data-i18n="code" class="enei__tool-button js-enei-code" title="Code"><span class="ei-embed"></span></button>

    <button data-i18n="indent_increase" class="enei__tool-button js-enei-indent-increase" title="Increase Indent"><span class="ei-indent-increase"></span></button>
    <button data-i18n="indent_decrease" class="enei__tool-button js-enei-indent-decrease" title="Decrease Indent"><span class="ei-indent-decrease"></span></button>

    <button data-i18n="ltr" class="enei__tool-button js-enei-ltr" title="LTR Text"><span class="ei-ltr"></span></button>
    <button data-i18n="rtl" class="enei__tool-button js-enei-rtl" title="RTL Text"><span class="ei-rtl"></span></button>

    <button data-i18n="clear_format" class="enei__tool-button js-enei-clear-format" title="Clear Format"><span class="ei-paint-format"></span></button>

    <button data-i18n="undo" class="enei__tool-button js-enei-undo" title="Undo Operation"><span class="ei-undo"></span></button>
    <button data-i18n="redo" class="enei__tool-button js-enei-redo" title="Redo Operation"><span class="ei-redo"></span></button>
    <button data-i18n="revert" class="enei__tool-button js-enei-revert" title="Revert Content"><span class="ei-revert"></span></button>

</div>
<div class="enei__text"></div>
<div class="enei__actions">
    <button data-i18n="save" class="enei__button js-enei-save">Save</button>
    <button data-i18n="cancel" class="enei__button js-enei-cancel">Cancel</button>
    <div style="margin-left: auto;">
        <span style="font-size: 10px;">__VERSION__</span>
        <a href="https://github.com/olton/chrome-enei-editor" target="_blank" class="enei__button js-enei-github" style="background-color: transparent;"><span class="ei-github"></span></a>
    </div>
</div>
`
