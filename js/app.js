(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                headerItemHeight = document.querySelector(headerItem).offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Проснулся, построил селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, нет ни одного select zzZZZzZZz");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            selectItem.classList.add(originalSelect.getAttribute("class") ? `select_${originalSelect.getAttribute("class")}` : "");
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if ("click" === targetType) {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if ("focusin" === targetType || "focusout" === targetType) {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) "focusin" === targetType ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if ("keydown" === targetType && "Escape" === e.code) this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                _slideToggle(selectOptions, originalSelect.dataset.speed);
            }
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заполните атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            if (originalSelect.multiple) {
                optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                    originalSelectSelectedItem.removeAttribute("selected");
                }));
                const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                selectSelectedItems.forEach((selectSelectedItems => {
                    originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                }));
            } else {
                if (!originalSelect.hasAttribute("data-show-selected")) {
                    if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                    optionItem.hidden = true;
                }
                originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                this.selectAction(selectItem);
            }
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setSelectChange(originalSelect);
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().indexOf(selectInput.value.toUpperCase()) >= 0) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message}`) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (void 0 === delay) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (void 0 === axis) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = void 0 === _temp ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (void 0 === overrides) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (void 0 === options) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if ("function" !== typeof handler) return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) swiper.visibleSlides.each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (void 0 === translate) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (void 0 === axis) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (void 0 === translate) translate = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === translateBounds) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        const translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === threshold) threshold = .5;
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            if (index < swiper.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "-webkit-grabbing" : "-webkit-grab";
        el.style.cursor = moving ? "-moz-grabbin" : "-moz-grab";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (void 0 === base) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (-0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (void 0 === base) base = "window";
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (void 0 === obj) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (void 0 === view) view = "current";
            if (void 0 === exact) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (void 0 === needUpdate) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (void 0 === deleteInstance) deleteInstance = true;
            if (void 0 === cleanStyles) cleanStyles = true;
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            init();
            update();
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        Object.assign(swiper.navigation, {
            update,
            init,
            destroy
        });
    }
    function initSliders() {
        if (document.querySelector(".swiper")) new core(".swiper", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 2,
            spaceBetween: 0,
            autoHeight: false,
            speed: 800,
            loop: true,
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.5,
                    spaceBetween: 0,
                    autoHeight: false
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1268: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            },
            on: {}
        });
        if (document.querySelector(".swiperg")) new core(".swiperg", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 0,
            autoHeight: false,
            speed: 800,
            loop: true,
            navigation: {
                prevEl: ".swiperg-button-prev",
                nextEl: ".swiperg-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 2,
                    autoHeight: false
                },
                480: {
                    slidesPerView: 1.5,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1268: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
                return;
            }
            if ("prx" === paramsWatch.threshold) {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    $(document).ready((function() {
        $(".js-faq-item").each((function() {
            var flag = false;
            var $item = $(this);
            var $top = $item.find(".js-faq-item-top");
            var $content = $item.find(".js-faq-item-content");
            var accordionDuration = 500;
            var accordionCallback = function() {
                flag = false;
            };
            $top.on("click", (function() {
                if (flag) return false;
                flag = true;
                if ($top.hasClass("-active")) {
                    $top.removeClass("-active");
                    $content.slideUp(accordionDuration, accordionCallback);
                } else {
                    $top.addClass("-active");
                    $content.slideDown(accordionDuration, accordionCallback);
                }
            }));
        }));
        $(".js-scroll-to").on("click", (function() {
            var attr = $(this).data("type");
            var $anchor = $('.js-anchor[data-type="' + attr + '"]');
            if ($anchor.length) $("html, body").animate({
                scrollTop: $anchor.offset().top + 30
            }, 500);
        }));
    }));
    !function(e, t) {
        "use strict";
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e);
        } : t(e);
    }("undefined" != typeof window ? window : void 0, (function(e, t) {
        "use strict";
        function n(e, t) {
            t = t || ne;
            var n = t.createElement("script");
            n.text = e, t.head.appendChild(n).parentNode.removeChild(n);
        }
        function r(e) {
            var t = !!e && "length" in e && e.length, n = ge.type(e);
            return "function" !== n && !ge.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e);
        }
        function o(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
        }
        function i(e, t, n) {
            return ge.isFunction(t) ? ge.grep(e, (function(e, r) {
                return !!t.call(e, r, e) !== n;
            })) : t.nodeType ? ge.grep(e, (function(e) {
                return e === t !== n;
            })) : "string" != typeof t ? ge.grep(e, (function(e) {
                return se.call(t, e) > -1 !== n;
            })) : Se.test(t) ? ge.filter(t, e, n) : (t = ge.filter(t, e), ge.grep(e, (function(e) {
                return se.call(t, e) > -1 !== n && 1 === e.nodeType;
            })));
        }
        function a(e, t) {
            for (;(e = e[t]) && 1 !== e.nodeType; ) ;
            return e;
        }
        function s(e) {
            var t = {};
            return ge.each(e.match(De) || [], (function(e, n) {
                t[n] = !0;
            })), t;
        }
        function l(e) {
            return e;
        }
        function u(e) {
            throw e;
        }
        function c(e, t, n, r) {
            var o;
            try {
                e && ge.isFunction(o = e.promise) ? o.call(e).done(t).fail(n) : e && ge.isFunction(o = e.then) ? o.call(e, t, n) : t.apply(void 0, [ e ].slice(r));
            } catch (e) {
                n.apply(void 0, [ e ]);
            }
        }
        function f() {
            ne.removeEventListener("DOMContentLoaded", f), e.removeEventListener("load", f), 
            ge.ready();
        }
        function d() {
            this.expando = ge.expando + d.uid++;
        }
        function $(e) {
            return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Be.test(e) ? JSON.parse(e) : e);
        }
        function p(e, t, n) {
            var r;
            if (void 0 === n && 1 === e.nodeType) if (r = "data-" + t.replace(Fe, "-$&").toLowerCase(), 
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = $(n);
                } catch (e) {}
                Oe.set(e, t, n);
            } else n = void 0;
            return n;
        }
        function h(e, t, n, r) {
            var o, i = 1, a = 20, s = r ? function() {
                return r.cur();
            } : function() {
                return ge.css(e, t, "");
            }, l = s(), u = n && n[3] || (ge.cssNumber[t] ? "" : "px"), c = (ge.cssNumber[t] || "px" !== u && +l) && Ie.exec(ge.css(e, t));
            if (c && c[3] !== u) {
                u = u || c[3], n = n || [], c = +l || 1;
                do {
                    i = i || ".5", c /= i, ge.style(e, t, c + u);
                } while (i !== (i = s() / l) && 1 !== i && --a);
            }
            return n && (c = +c || +l || 0, o = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = u, 
            r.start = c, r.end = o)), o;
        }
        function g(e) {
            var t, n = e.ownerDocument, r = e.nodeName, o = Ve[r];
            return o || (t = n.body.appendChild(n.createElement(r)), o = ge.css(t, "display"), 
            t.parentNode.removeChild(t), "none" === o && (o = "block"), Ve[r] = o, o);
        }
        function v(e, t) {
            for (var n, r, o = [], i = 0, a = e.length; i < a; i++) r = e[i], r.style && (n = r.style.display, 
            t ? ("none" === n && (o[i] = He.get(r, "display") || null, o[i] || (r.style.display = "")), 
            "" === r.style.display && We(r) && (o[i] = g(r))) : "none" !== n && (o[i] = "none", 
            He.set(r, "display", n)));
            for (i = 0; i < a; i++) null != o[i] && (e[i].style.display = o[i]);
            return e;
        }
        function m(e, t) {
            var n;
            return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], 
            void 0 === t || t && o(e, t) ? ge.merge([ e ], n) : n;
        }
        function y(e, t) {
            for (var n = 0, r = e.length; n < r; n++) He.set(e[n], "globalEval", !t || He.get(t[n], "globalEval"));
        }
        function b(e, t, n, r, o) {
            for (var i, a, s, l, u, c, f = t.createDocumentFragment(), d = [], p = 0, h = e.length; p < h; p++) if ((i = e[p]) || 0 === i) if ("object" === ge.type(i)) ge.merge(d, i.nodeType ? [ i ] : i); else if (Ke.test(i)) {
                for (a = a || f.appendChild(t.createElement("div")), s = (Ue.exec(i) || [ "", "" ])[1].toLowerCase(), 
                l = Xe[s] || Xe._default, a.innerHTML = l[1] + ge.htmlPrefilter(i) + l[2], c = l[0]; c--; ) a = a.lastChild;
                ge.merge(d, a.childNodes), a = f.firstChild, a.textContent = "";
            } else d.push(t.createTextNode(i));
            for (f.textContent = "", p = 0; i = d[p++]; ) if (r && ge.inArray(i, r) > -1) o && o.push(i); else if (u = ge.contains(i.ownerDocument, i), 
            a = m(f.appendChild(i), "script"), u && y(a), n) for (c = 0; i = a[c++]; ) Ge.test(i.type || "") && n.push(i);
            return f;
        }
        function x() {
            return !0;
        }
        function w() {
            return !1;
        }
        function C() {
            try {
                return ne.activeElement;
            } catch (e) {}
        }
        function k(e, t, n, r, o, i) {
            var a, s;
            if ("object" == typeof t) {
                "string" != typeof n && (r = r || n, n = void 0);
                for (s in t) k(e, s, n, r, t[s], i);
                return e;
            }
            if (null == r && null == o ? (o = n, r = n = void 0) : null == o && ("string" == typeof n ? (o = r, 
            r = void 0) : (o = r, r = n, n = void 0)), !1 === o) o = w; else if (!o) return e;
            return 1 === i && (a = o, o = function(e) {
                return ge().off(e), a.apply(this, arguments);
            }, o.guid = a.guid || (a.guid = ge.guid++)), e.each((function() {
                ge.event.add(this, t, o, r, n);
            }));
        }
        function T(e, t) {
            return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") ? ge(">tbody", e)[0] || e : e;
        }
        function S(e) {
            return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e;
        }
        function E(e) {
            var t = rt.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e;
        }
        function A(e, t) {
            var n, r, o, i, a, s, l, u;
            if (1 === t.nodeType) {
                if (He.hasData(e) && (i = He.access(e), a = He.set(t, i), u = i.events)) {
                    delete a.handle, a.events = {};
                    for (o in u) for (n = 0, r = u[o].length; n < r; n++) ge.event.add(t, o, u[o][n]);
                }
                Oe.hasData(e) && (s = Oe.access(e), l = ge.extend({}, s), Oe.set(t, l));
            }
        }
        function j(e, t) {
            var n = t.nodeName.toLowerCase();
            "input" === n && ze.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue);
        }
        function N(e, t, r, o) {
            t = ie.apply([], t);
            var i, a, s, l, u, c, f = 0, d = e.length, p = d - 1, h = t[0], g = ge.isFunction(h);
            if (g || d > 1 && "string" == typeof h && !pe.checkClone && nt.test(h)) return e.each((function(n) {
                var i = e.eq(n);
                g && (t[0] = h.call(this, n, i.html())), N(i, t, r, o);
            }));
            if (d && (i = b(t, e[0].ownerDocument, !1, e, o), a = i.firstChild, 1 === i.childNodes.length && (i = a), 
            a || o)) {
                for (s = ge.map(m(i, "script"), S), l = s.length; f < d; f++) u = i, f !== p && (u = ge.clone(u, !0, !0), 
                l && ge.merge(s, m(u, "script"))), r.call(e[f], u, f);
                if (l) for (c = s[s.length - 1].ownerDocument, ge.map(s, E), f = 0; f < l; f++) u = s[f], 
                Ge.test(u.type || "") && !He.access(u, "globalEval") && ge.contains(c, u) && (u.src ? ge._evalUrl && ge._evalUrl(u.src) : n(u.textContent.replace(ot, ""), c));
            }
            return e;
        }
        function D(e, t, n) {
            for (var r, o = t ? ge.filter(t, e) : e, i = 0; null != (r = o[i]); i++) n || 1 !== r.nodeType || ge.cleanData(m(r)), 
            r.parentNode && (n && ge.contains(r.ownerDocument, r) && y(m(r, "script")), r.parentNode.removeChild(r));
            return e;
        }
        function q(e, t, n) {
            var r, o, i, a, s = e.style;
            return n = n || st(e), n && (a = n.getPropertyValue(t) || n[t], "" !== a || ge.contains(e.ownerDocument, e) || (a = ge.style(e, t)), 
            !pe.pixelMarginRight() && at.test(a) && it.test(t) && (r = s.width, o = s.minWidth, 
            i = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, 
            s.minWidth = o, s.maxWidth = i)), void 0 !== a ? a + "" : a;
        }
        function L(e, t) {
            return {
                get: function() {
                    return e() ? void delete this.get : (this.get = t).apply(this, arguments);
                }
            };
        }
        function M(e) {
            if (e in pt) return e;
            for (var t = e[0].toUpperCase() + e.slice(1), n = dt.length; n--; ) if ((e = dt[n] + t) in pt) return e;
        }
        function P(e) {
            var t = ge.cssProps[e];
            return t || (t = ge.cssProps[e] = M(e) || e), t;
        }
        function H(e, t, n) {
            var r = Ie.exec(t);
            return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
        }
        function O(e, t, n, r, o) {
            var i, a = 0;
            for (i = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0; i < 4; i += 2) "margin" === n && (a += ge.css(e, n + $e[i], !0, o)), 
            r ? ("content" === n && (a -= ge.css(e, "padding" + $e[i], !0, o)), "margin" !== n && (a -= ge.css(e, "border" + $e[i] + "Width", !0, o))) : (a += ge.css(e, "padding" + $e[i], !0, o), 
            "padding" !== n && (a += ge.css(e, "border" + $e[i] + "Width", !0, o)));
            return a;
        }
        function B(e, t, n) {
            var r, o = st(e), i = q(e, t, o), a = "border-box" === ge.css(e, "boxSizing", !1, o);
            return at.test(i) ? i : (r = a && (pe.boxSizingReliable() || i === e.style[t]), 
            "auto" === i && (i = e["offset" + t[0].toUpperCase() + t.slice(1)]), (i = parseFloat(i) || 0) + O(e, t, n || (a ? "border" : "content"), r, o) + "px");
        }
        function F(e, t, n, r, o) {
            return new F.prototype.init(e, t, n, r, o);
        }
        function R() {
            gt && (!1 === ne.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(R) : e.setTimeout(R, ge.fx.interval), 
            ge.fx.tick());
        }
        function I() {
            return e.setTimeout((function() {
                ht = void 0;
            })), ht = ge.now();
        }
        function W(e, t) {
            var n, r = 0, o = {
                height: e
            };
            for (t = t ? 1 : 0; r < 4; r += 2 - t) n = $e[r], o["margin" + n] = o["padding" + n] = e;
            return t && (o.opacity = o.width = e), o;
        }
        function _(e, t, n) {
            for (var r, o = (U.tweeners[t] || []).concat(U.tweeners["*"]), i = 0, a = o.length; i < a; i++) if (r = o[i].call(n, t, e)) return r;
        }
        function V(e, t, n) {
            var r, o, i, a, s, l, u, c, f = "width" in t || "height" in t, d = this, p = {}, h = e.style, g = e.nodeType && We(e), m = He.get(e, "fxshow");
            n.queue || (a = ge._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, 
            s = a.empty.fire, a.empty.fire = function() {
                a.unqueued || s();
            }), a.unqueued++, d.always((function() {
                d.always((function() {
                    a.unqueued--, ge.queue(e, "fx").length || a.empty.fire();
                }));
            })));
            for (r in t) if (o = t[r], vt.test(o)) {
                if (delete t[r], i = i || "toggle" === o, o === (g ? "hide" : "show")) {
                    if ("show" !== o || !m || void 0 === m[r]) continue;
                    g = !0;
                }
                p[r] = m && m[r] || ge.style(e, r);
            }
            if ((l = !ge.isEmptyObject(t)) || !ge.isEmptyObject(p)) {
                f && 1 === e.nodeType && (n.overflow = [ h.overflow, h.overflowX, h.overflowY ], 
                u = m && m.display, null == u && (u = He.get(e, "display")), c = ge.css(e, "display"), 
                "none" === c && (u ? c = u : (v([ e ], !0), u = e.style.display || u, c = ge.css(e, "display"), 
                v([ e ]))), ("inline" === c || "inline-block" === c && null != u) && "none" === ge.css(e, "float") && (l || (d.done((function() {
                    h.display = u;
                })), null == u && (c = h.display, u = "none" === c ? "" : c)), h.display = "inline-block")), 
                n.overflow && (h.overflow = "hidden", d.always((function() {
                    h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2];
                }))), l = !1;
                for (r in p) l || (m ? "hidden" in m && (g = m.hidden) : m = He.access(e, "fxshow", {
                    display: u
                }), i && (m.hidden = !g), g && v([ e ], !0), d.done((function() {
                    g || v([ e ]), He.remove(e, "fxshow");
                    for (r in p) ge.style(e, r, p[r]);
                }))), l = _(g ? m[r] : 0, r, d), r in m || (m[r] = l.start, g && (l.end = l.start, 
                l.start = 0));
            }
        }
        function z(e, t) {
            var n, r, o, i, a;
            for (n in e) if (r = ge.camelCase(n), o = t[r], i = e[n], Array.isArray(i) && (o = i[1], 
            i = e[n] = i[0]), n !== r && (e[r] = i, delete e[n]), (a = ge.cssHooks[r]) && "expand" in a) {
                i = a.expand(i), delete e[r];
                for (n in i) n in e || (e[n] = i[n], t[n] = o);
            } else t[r] = o;
        }
        function U(e, t, n) {
            var r, o, i = 0, a = U.prefilters.length, s = ge.Deferred().always((function() {
                delete l.elem;
            })), l = function() {
                if (o) return !1;
                for (var t = ht || I(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, i = 1 - r, a = 0, l = u.tweens.length; a < l; a++) u.tweens[a].run(i);
                return s.notifyWith(e, [ u, i, n ]), i < 1 && l ? n : (l || s.notifyWith(e, [ u, 1, 0 ]), 
                s.resolveWith(e, [ u ]), !1);
            }, u = s.promise({
                elem: e,
                props: ge.extend({}, t),
                opts: ge.extend(!0, {
                    specialEasing: {},
                    easing: ge.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: ht || I(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = ge.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r;
                },
                stop: function(t) {
                    var n = 0, r = t ? u.tweens.length : 0;
                    if (o) return this;
                    for (o = !0; n < r; n++) u.tweens[n].run(1);
                    return t ? (s.notifyWith(e, [ u, 1, 0 ]), s.resolveWith(e, [ u, t ])) : s.rejectWith(e, [ u, t ]), 
                    this;
                }
            }), c = u.props;
            for (z(c, u.opts.specialEasing); i < a; i++) if (r = U.prefilters[i].call(u, e, c, u.opts)) return ge.isFunction(r.stop) && (ge._queueHooks(u.elem, u.opts.queue).stop = ge.proxy(r.stop, r)), 
            r;
            return ge.map(c, _, u), ge.isFunction(u.opts.start) && u.opts.start.call(e, u), 
            u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), 
            ge.fx.timer(ge.extend(l, {
                elem: e,
                anim: u,
                queue: u.opts.queue
            })), u;
        }
        function G(e) {
            return (e.match(De) || []).join(" ");
        }
        function X(e) {
            return e.getAttribute && e.getAttribute("class") || "";
        }
        function K(e, t, n, r) {
            var o;
            if (Array.isArray(t)) ge.each(t, (function(t, o) {
                n || At.test(e) ? r(e, o) : K(e + "[" + ("object" == typeof o && null != o ? t : "") + "]", o, n, r);
            })); else if (n || "object" !== ge.type(t)) r(e, t); else for (o in t) K(e + "[" + o + "]", t[o], n, r);
        }
        function Q(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var r, o = 0, i = t.toLowerCase().match(De) || [];
                if (ge.isFunction(n)) for (;r = i[o++]; ) "+" === r[0] ? (r = r.slice(1) || "*", 
                (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n);
            };
        }
        function Y(e, t, n, r) {
            function o(s) {
                var l;
                return i[s] = !0, ge.each(e[s] || [], (function(e, s) {
                    var u = s(t, n, r);
                    return "string" != typeof u || a || i[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), 
                    o(u), !1);
                })), l;
            }
            var i = {}, a = e === Rt;
            return o(t.dataTypes[0]) || !i["*"] && o("*");
        }
        function J(e, t) {
            var n, r, o = ge.ajaxSettings.flatOptions || {};
            for (n in t) void 0 !== t[n] && ((o[n] ? e : r || (r = {}))[n] = t[n]);
            return r && ge.extend(!0, e, r), e;
        }
        function Z(e, t, n) {
            for (var r, o, i, a, s = e.contents, l = e.dataTypes; "*" === l[0]; ) l.shift(), 
            void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
            if (r) for (o in s) if (s[o] && s[o].test(r)) {
                l.unshift(o);
                break;
            }
            if (l[0] in n) i = l[0]; else {
                for (o in n) {
                    if (!l[0] || e.converters[o + " " + l[0]]) {
                        i = o;
                        break;
                    }
                    a || (a = o);
                }
                i = i || a;
            }
            if (i) return i !== l[0] && l.unshift(i), n[i];
        }
        function ee(e, t, n, r) {
            var o, i, a, s, l, u = {}, c = e.dataTypes.slice();
            if (c[1]) for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
            for (i = c.shift(); i; ) if (e.responseFields[i] && (n[e.responseFields[i]] = t), 
            !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = i, i = c.shift()) if ("*" === i) i = l; else if ("*" !== l && l !== i) {
                if (!(a = u[l + " " + i] || u["* " + i])) for (o in u) if (s = o.split(" "), s[1] === i && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                    !0 === a ? a = u[o] : !0 !== u[o] && (i = s[0], c.unshift(s[1]));
                    break;
                }
                if (!0 !== a) if (a && e.throws) t = a(t); else try {
                    t = a(t);
                } catch (e) {
                    return {
                        state: "parsererror",
                        error: a ? e : "No conversion from " + l + " to " + i
                    };
                }
            }
            return {
                state: "success",
                data: t
            };
        }
        var te = [], ne = e.document, re = Object.getPrototypeOf, oe = te.slice, ie = te.concat, ae = te.push, se = te.indexOf, le = {}, ue = le.toString, ce = le.hasOwnProperty, fe = ce.toString, de = fe.call(Object), pe = {}, he = "3.2.1", ge = function(e, t) {
            return new ge.fn.init(e, t);
        }, be = function(e, t) {
            return t.toUpperCase();
        };
        ge.fn = ge.prototype = {
            jquery: he,
            constructor: ge,
            length: 0,
            toArray: function() {
                return oe.call(this);
            },
            get: function(e) {
                return null == e ? oe.call(this) : e < 0 ? this[e + this.length] : this[e];
            },
            pushStack: function(e) {
                var t = ge.merge(this.constructor(), e);
                return t.prevObject = this, t;
            },
            each: function(e) {
                return ge.each(this, e);
            },
            map: function(e) {
                return this.pushStack(ge.map(this, (function(t, n) {
                    return e.call(t, n, t);
                })));
            },
            slice: function() {
                return this.pushStack(oe.apply(this, arguments));
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            eq: function(e) {
                var t = this.length, n = +e + (e < 0 ? t : 0);
                return this.pushStack(n >= 0 && n < t ? [ this[n] ] : []);
            },
            end: function() {
                return this.prevObject || this.constructor();
            },
            push: ae,
            sort: te.sort,
            splice: te.splice
        }, ge.extend = ge.fn.extend = function() {
            var e, t, n, r, o, i, a = arguments[0] || {}, s = 1, l = arguments.length, u = !1;
            for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || ge.isFunction(a) || (a = {}), 
            s === l && (a = this, s--); s < l; s++) if (null != (e = arguments[s])) for (t in e) n = a[t], 
            r = e[t], a !== r && (u && r && (ge.isPlainObject(r) || (o = Array.isArray(r))) ? (o ? (o = !1, 
            i = n && Array.isArray(n) ? n : []) : i = n && ge.isPlainObject(n) ? n : {}, a[t] = ge.extend(u, i, r)) : void 0 !== r && (a[t] = r));
            return a;
        }, ge.extend({
            expando: "jQuery" + (he + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e);
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === ge.type(e);
            },
            isWindow: function(e) {
                return null != e && e === e.window;
            },
            isNumeric: function(e) {
                var t = ge.type(e);
                return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
            },
            isPlainObject: function(e) {
                var t, n;
                return !(!e || "[object Object]" !== ue.call(e) || (t = re(e)) && ("function" != typeof (n = ce.call(t, "constructor") && t.constructor) || fe.call(n) !== de));
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0;
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? le[ue.call(e)] || "object" : typeof e;
            },
            globalEval: function(e) {
                n(e);
            },
            camelCase: function(e) {
                return e.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, be);
            },
            each: function(e, t) {
                var n, o = 0;
                if (r(e)) for (n = e.length; o < n && !1 !== t.call(e[o], o, e[o]); o++) ; else for (o in e) if (!1 === t.call(e[o], o, e[o])) break;
                return e;
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (r(Object(e)) ? ge.merge(n, "string" == typeof e ? [ e ] : e) : ae.call(n, e)), 
                n;
            },
            inArray: function(e, t, n) {
                return null == t ? -1 : se.call(t, e, n);
            },
            merge: function(e, t) {
                for (var n = +t.length, r = 0, o = e.length; r < n; r++) e[o++] = t[r];
                return e.length = o, e;
            },
            grep: function(e, t, n) {
                for (var o = [], i = 0, a = e.length, s = !n; i < a; i++) !t(e[i], i) !== s && o.push(e[i]);
                return o;
            },
            map: function(e, t, n) {
                var o, i, a = 0, s = [];
                if (r(e)) for (o = e.length; a < o; a++) null != (i = t(e[a], a, n)) && s.push(i); else for (a in e) null != (i = t(e[a], a, n)) && s.push(i);
                return ie.apply([], s);
            },
            guid: 1,
            proxy: function(e, t) {
                var n, r, o;
                if ("string" == typeof t && (n = e[t], t = e, e = n), ge.isFunction(e)) return r = oe.call(arguments, 2), 
                o = function() {
                    return e.apply(t || this, r.concat(oe.call(arguments)));
                }, o.guid = e.guid = e.guid || ge.guid++, o;
            },
            now: Date.now,
            support: pe
        }), "function" == typeof Symbol && (ge.fn[Symbol.iterator] = te[Symbol.iterator]), 
        ge.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), (function(e, t) {
            le["[object " + t + "]"] = t.toLowerCase();
        }));
        var xe = function(e) {
            function t(e, t, n, r) {
                var o, i, a, s, l, u, c, d = t && t.ownerDocument, h = t ? t.nodeType : 9;
                if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
                if (!r && ((t ? t.ownerDocument || t : W) !== M && L(t), t = t || M, H)) {
                    if (11 !== h && (l = ye.exec(e))) if (o = l[1]) {
                        if (9 === h) {
                            if (!(a = t.getElementById(o))) return n;
                            if (a.id === o) return n.push(a), n;
                        } else if (d && (a = d.getElementById(o)) && R(t, a) && a.id === o) return n.push(a), 
                        n;
                    } else {
                        if (l[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                        if ((o = l[3]) && C.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(o)), 
                        n;
                    }
                    if (C.qsa && !G[e + " "] && (!O || !O.test(e))) {
                        if (1 !== h) d = t, c = e; else if ("object" !== t.nodeName.toLowerCase()) {
                            for ((s = t.getAttribute("id")) ? s = s.replace(we, Ce) : t.setAttribute("id", s = I), 
                            u = E(e), i = u.length; i--; ) u[i] = "#" + s + " " + p(u[i]);
                            c = u.join(","), d = $.test(e) && f(t.parentNode) || t;
                        }
                        if (c) try {
                            return Z.apply(n, d.querySelectorAll(c)), n;
                        } catch (e) {} finally {
                            s === I && t.removeAttribute("id");
                        }
                    }
                }
                return j(e.replace(le, "$1"), t, n, r);
            }
            function n() {
                function e(n, r) {
                    return t.push(n + " ") > k.cacheLength && delete e[t.shift()], e[n + " "] = r;
                }
                var t = [];
                return e;
            }
            function r(e) {
                return e[I] = !0, e;
            }
            function o(e) {
                var t = M.createElement("fieldset");
                try {
                    return !!e(t);
                } catch (e) {
                    return !1;
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null;
                }
            }
            function i(e, t) {
                for (var n = e.split("|"), r = n.length; r--; ) k.attrHandle[n[r]] = t;
            }
            function a(e, t) {
                var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
                if (r) return r;
                if (n) for (;n = n.nextSibling; ) if (n === t) return -1;
                return e ? 1 : -1;
            }
            function s(e) {
                return function(t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e;
                };
            }
            function l(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e;
                };
            }
            function u(e) {
                return function(t) {
                    return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Te(t) === e : t.disabled === e : "label" in t && t.disabled === e;
                };
            }
            function c(e) {
                return r((function(t) {
                    return t = +t, r((function(n, r) {
                        for (var o, i = e([], n.length, t), a = i.length; a--; ) n[o = i[a]] && (n[o] = !(r[o] = n[o]));
                    }));
                }));
            }
            function f(e) {
                return e && void 0 !== e.getElementsByTagName && e;
            }
            function d() {}
            function p(e) {
                for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
                return r;
            }
            function h(e, t, n) {
                var r = t.dir, o = t.next, i = o || r, a = n && "parentNode" === i, s = V++;
                return t.first ? function(t, n, o) {
                    for (;t = t[r]; ) if (1 === t.nodeType || a) return e(t, n, o);
                    return !1;
                } : function(t, n, l) {
                    var u, c, f, d = [ _, s ];
                    if (l) {
                        for (;t = t[r]; ) if ((1 === t.nodeType || a) && e(t, n, l)) return !0;
                    } else for (;t = t[r]; ) if (1 === t.nodeType || a) if (f = t[I] || (t[I] = {}), 
                    c = f[t.uniqueID] || (f[t.uniqueID] = {}), o && o === t.nodeName.toLowerCase()) t = t[r] || t; else {
                        if ((u = c[i]) && u[0] === _ && u[1] === s) return d[2] = u[2];
                        if (c[i] = d, d[2] = e(t, n, l)) return !0;
                    }
                    return !1;
                };
            }
            function g(e) {
                return e.length > 1 ? function(t, n, r) {
                    for (var o = e.length; o--; ) if (!e[o](t, n, r)) return !1;
                    return !0;
                } : e[0];
            }
            function v(e, n, r) {
                for (var o = 0, i = n.length; o < i; o++) t(e, n[o], r);
                return r;
            }
            function m(e, t, n, r, o) {
                for (var i, a = [], s = 0, l = e.length, u = null != t; s < l; s++) (i = e[s]) && (n && !n(i, r, o) || (a.push(i), 
                u && t.push(s)));
                return a;
            }
            function y(e, t, n, o, i, a) {
                return o && !o[I] && (o = y(o)), i && !i[I] && (i = y(i, a)), r((function(r, a, s, l) {
                    var u, c, f, d = [], p = [], h = a.length, g = r || v(t || "*", s.nodeType ? [ s ] : s, []), y = !e || !r && t ? g : m(g, d, e, s, l), b = n ? i || (r ? e : h || o) ? [] : a : y;
                    if (n && n(y, b, s, l), o) for (u = m(b, p), o(u, [], s, l), c = u.length; c--; ) (f = u[c]) && (b[p[c]] = !(y[p[c]] = f));
                    if (r) {
                        if (i || e) {
                            if (i) {
                                for (u = [], c = b.length; c--; ) (f = b[c]) && u.push(y[c] = f);
                                i(null, b = [], u, l);
                            }
                            for (c = b.length; c--; ) (f = b[c]) && (u = i ? te(r, f) : d[c]) > -1 && (r[u] = !(a[u] = f));
                        }
                    } else b = m(b === a ? b.splice(h, b.length) : b), i ? i(null, a, b, l) : Z.apply(a, b);
                }));
            }
            function b(e) {
                for (var t, n, r, o = e.length, i = k.relative[e[0].type], a = i || k.relative[" "], s = i ? 1 : 0, l = h((function(e) {
                    return e === t;
                }), a, !0), u = h((function(e) {
                    return te(t, e) > -1;
                }), a, !0), c = [ function(e, n, r) {
                    var o = !i && (r || n !== N) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r));
                    return t = null, o;
                } ]; s < o; s++) if (n = k.relative[e[s].type]) c = [ h(g(c), n) ]; else {
                    if (n = k.filter[e[s].type].apply(null, e[s].matches), n[I]) {
                        for (r = ++s; r < o && !k.relative[e[r].type]; r++) ;
                        return y(s > 1 && g(c), s > 1 && p(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(le, "$1"), n, s < r && b(e.slice(s, r)), r < o && b(e = e.slice(r)), r < o && p(e));
                    }
                    c.push(n);
                }
                return g(c);
            }
            function x(e, n) {
                var o = n.length > 0, i = e.length > 0, a = function(r, a, s, l, u) {
                    var c, f, d, p = 0, h = "0", g = r && [], v = [], y = N, b = r || i && k.find.TAG("*", u), x = _ += null == y ? 1 : Math.random() || .1, w = b.length;
                    for (u && (N = a === M || a || u); h !== w && null != (c = b[h]); h++) {
                        if (i && c) {
                            for (f = 0, a || c.ownerDocument === M || (L(c), s = !H); d = e[f++]; ) if (d(c, a || M, s)) {
                                l.push(c);
                                break;
                            }
                            u && (_ = x);
                        }
                        o && ((c = !d && c) && p--, r && g.push(c));
                    }
                    if (p += h, o && h !== p) {
                        for (f = 0; d = n[f++]; ) d(g, v, a, s);
                        if (r) {
                            if (p > 0) for (;h--; ) g[h] || v[h] || (v[h] = Y.call(l));
                            v = m(v);
                        }
                        Z.apply(l, v), u && !r && v.length > 0 && p + n.length > 1 && t.uniqueSort(l);
                    }
                    return u && (_ = x, N = y), g;
                };
                return o ? r(a) : a;
            }
            var w, C, k, T, S, E, A, j, N, D, q, L, M, P, H, O, B, F, R, I = "sizzle" + 1 * new Date, W = e.document, _ = 0, V = 0, z = n(), U = n(), G = n(), X = function(e, t) {
                return e === t && (q = !0), 0;
            }, K = {}.hasOwnProperty, Q = [], Y = Q.pop, J = Q.push, Z = Q.push, ee = Q.slice, te = function(e, t) {
                for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
                return -1;
            }, ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", re = "[\\x20\\t\\r\\n\\f]", oe = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", ie = "\\[" + re + "*(" + oe + ")(?:" + re + "*([*^$|!~]?=)" + re + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + oe + "))|)" + re + "*\\]", ae = ":(" + oe + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ie + ")*)|.*)\\)|)", se = new RegExp(re + "+", "g"), le = new RegExp("^" + re + "+|((?:^|[^\\\\])(?:\\\\.)*)" + re + "+$", "g"), ue = new RegExp("^" + re + "*," + re + "*"), ce = new RegExp("^" + re + "*([>+~]|" + re + ")" + re + "*"), fe = new RegExp("=" + re + "*([^\\]'\"]*?)" + re + "*\\]", "g"), de = new RegExp(ae), pe = new RegExp("^" + oe + "$"), he = {
                ID: new RegExp("^#(" + oe + ")"),
                CLASS: new RegExp("^\\.(" + oe + ")"),
                TAG: new RegExp("^(" + oe + "|[*])"),
                ATTR: new RegExp("^" + ie),
                PSEUDO: new RegExp("^" + ae),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + re + "*(even|odd|(([+-]|)(\\d*)n|)" + re + "*(?:([+-]|)" + re + "*(\\d+)|))" + re + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ne + ")$", "i"),
                needsContext: new RegExp("^" + re + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + re + "*((?:-\\d)?\\d*)" + re + "*\\)|)(?=[^-]|$)", "i")
            }, ge = /^(?:input|select|textarea|button)$/i, ve = /^h\d$/i, me = /^[^{]+\{\s*\[native \w/, ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, $ = /[+~]/, be = new RegExp("\\\\([\\da-f]{1,6}" + re + "?|(" + re + ")|.)", "ig"), xe = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320);
            }, we = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, Ce = function(e, t) {
                return t ? "\0" === e ? "пїЅ" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e;
            }, ke = function() {
                L();
            }, Te = h((function(e) {
                return !0 === e.disabled && ("form" in e || "label" in e);
            }), {
                dir: "parentNode",
                next: "legend"
            });
            try {
                Z.apply(Q = ee.call(W.childNodes), W.childNodes), Q[W.childNodes.length].nodeType;
            } catch (e) {
                Z = {
                    apply: Q.length ? function(e, t) {
                        J.apply(e, ee.call(t));
                    } : function(e, t) {
                        for (var n = e.length, r = 0; e[n++] = t[r++]; ) ;
                        e.length = n - 1;
                    }
                };
            }
            C = t.support = {}, S = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName;
            }, L = t.setDocument = function(e) {
                var t, n, r = e ? e.ownerDocument || e : W;
                return r !== M && 9 === r.nodeType && r.documentElement ? (M = r, P = M.documentElement, 
                H = !S(M), W !== M && (n = M.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", ke, !1) : n.attachEvent && n.attachEvent("onunload", ke)), 
                C.attributes = o((function(e) {
                    return e.className = "i", !e.getAttribute("className");
                })), C.getElementsByTagName = o((function(e) {
                    return e.appendChild(M.createComment("")), !e.getElementsByTagName("*").length;
                })), C.getElementsByClassName = me.test(M.getElementsByClassName), C.getById = o((function(e) {
                    return P.appendChild(e).id = I, !M.getElementsByName || !M.getElementsByName(I).length;
                })), C.getById ? (k.filter.ID = function(e) {
                    var t = e.replace(be, xe);
                    return function(e) {
                        return e.getAttribute("id") === t;
                    };
                }, k.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && H) {
                        var n = t.getElementById(e);
                        return n ? [ n ] : [];
                    }
                }) : (k.filter.ID = function(e) {
                    var t = e.replace(be, xe);
                    return function(e) {
                        var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t;
                    };
                }, k.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && H) {
                        var n, r, o, i = t.getElementById(e);
                        if (i) {
                            if ((n = i.getAttributeNode("id")) && n.value === e) return [ i ];
                            for (o = t.getElementsByName(e), r = 0; i = o[r++]; ) if ((n = i.getAttributeNode("id")) && n.value === e) return [ i ];
                        }
                        return [];
                    }
                }), k.find.TAG = C.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : C.qsa ? t.querySelectorAll(e) : void 0;
                } : function(e, t) {
                    var n, r = [], o = 0, i = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (;n = i[o++]; ) 1 === n.nodeType && r.push(n);
                        return r;
                    }
                    return i;
                }, k.find.CLASS = C.getElementsByClassName && function(e, t) {
                    if (void 0 !== t.getElementsByClassName && H) return t.getElementsByClassName(e);
                }, B = [], O = [], (C.qsa = me.test(M.querySelectorAll)) && (o((function(e) {
                    P.appendChild(e).innerHTML = "<a id='" + I + "'></a><select id='" + I + "-\r\\' msallowcapture=''><option selected=''></option></select>", 
                    e.querySelectorAll("[msallowcapture^='']").length && O.push("[*^$]=" + re + "*(?:''|\"\")"), 
                    e.querySelectorAll("[selected]").length || O.push("\\[" + re + "*(?:value|" + ne + ")"), 
                    e.querySelectorAll("[id~=" + I + "-]").length || O.push("~="), e.querySelectorAll(":checked").length || O.push(":checked"), 
                    e.querySelectorAll("a#" + I + "+*").length || O.push(".#.+[+~]");
                })), o((function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = M.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && O.push("name" + re + "*[*^$|!~]?="), 
                    2 !== e.querySelectorAll(":enabled").length && O.push(":enabled", ":disabled"), 
                    P.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && O.push(":enabled", ":disabled"), 
                    e.querySelectorAll("*,:x"), O.push(",.*:");
                }))), (C.matchesSelector = me.test(F = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && o((function(e) {
                    C.disconnectedMatch = F.call(e, "*"), F.call(e, "[s!='']:x"), B.push("!=", ae);
                })), O = O.length && new RegExp(O.join("|")), B = B.length && new RegExp(B.join("|")), 
                t = me.test(P.compareDocumentPosition), R = t || me.test(P.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
                } : function(e, t) {
                    if (t) for (;t = t.parentNode; ) if (t === e) return !0;
                    return !1;
                }, X = t ? function(e, t) {
                    if (e === t) return q = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 
                    1 & n || !C.sortDetached && t.compareDocumentPosition(e) === n ? e === M || e.ownerDocument === W && R(W, e) ? -1 : t === M || t.ownerDocument === W && R(W, t) ? 1 : D ? te(D, e) - te(D, t) : 0 : 4 & n ? -1 : 1);
                } : function(e, t) {
                    if (e === t) return q = !0, 0;
                    var n, r = 0, o = e.parentNode, i = t.parentNode, s = [ e ], l = [ t ];
                    if (!o || !i) return e === M ? -1 : t === M ? 1 : o ? -1 : i ? 1 : D ? te(D, e) - te(D, t) : 0;
                    if (o === i) return a(e, t);
                    for (n = e; n = n.parentNode; ) s.unshift(n);
                    for (n = t; n = n.parentNode; ) l.unshift(n);
                    for (;s[r] === l[r]; ) r++;
                    return r ? a(s[r], l[r]) : s[r] === W ? -1 : l[r] === W ? 1 : 0;
                }, M) : M;
            }, t.matches = function(e, n) {
                return t(e, null, null, n);
            }, t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== M && L(e), n = n.replace(fe, "='$1']"), C.matchesSelector && H && !G[n + " "] && (!B || !B.test(n)) && (!O || !O.test(n))) try {
                    var r = F.call(e, n);
                    if (r || C.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r;
                } catch (e) {}
                return t(n, M, null, [ e ]).length > 0;
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== M && L(e), R(e, t);
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== M && L(e);
                var n = k.attrHandle[t.toLowerCase()], r = n && K.call(k.attrHandle, t.toLowerCase()) ? n(e, t, !H) : void 0;
                return void 0 !== r ? r : C.attributes || !H ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
            }, t.escape = function(e) {
                return (e + "").replace(we, Ce);
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e);
            }, t.uniqueSort = function(e) {
                var t, n = [], r = 0, o = 0;
                if (q = !C.detectDuplicates, D = !C.sortStable && e.slice(0), e.sort(X), q) {
                    for (;t = e[o++]; ) t === e[o] && (r = n.push(o));
                    for (;r--; ) e.splice(n[r], 1);
                }
                return D = null, e;
            }, T = t.getText = function(e) {
                var t, n = "", r = 0, o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += T(e);
                    } else if (3 === o || 4 === o) return e.nodeValue;
                } else for (;t = e[r++]; ) n += T(t);
                return n;
            }, k = t.selectors = {
                cacheLength: 50,
                createPseudo: r,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(be, xe), e[3] = (e[3] || e[4] || e[5] || "").replace(be, xe), 
                        "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), 
                        e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), 
                        e;
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && de.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), 
                        e[2] = n.slice(0, t)), e.slice(0, 3));
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(be, xe).toLowerCase();
                        return "*" === e ? function() {
                            return !0;
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t;
                        };
                    },
                    CLASS: function(e) {
                        var t = z[e + " "];
                        return t || (t = new RegExp("(^|" + re + ")" + e + "(" + re + "|$)")) && z(e, (function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "");
                        }));
                    },
                    ATTR: function(e, n, r) {
                        return function(o) {
                            var i = t.attr(o, e);
                            return null == i ? "!=" === n : !n || (i += "", "=" === n ? i === r : "!=" === n ? i !== r : "^=" === n ? r && 0 === i.indexOf(r) : "*=" === n ? r && i.indexOf(r) > -1 : "$=" === n ? r && i.slice(-r.length) === r : "~=" === n ? (" " + i.replace(se, " ") + " ").indexOf(r) > -1 : "|=" === n && (i === r || i.slice(0, r.length + 1) === r + "-"));
                        };
                    },
                    CHILD: function(e, t, n, r, o) {
                        var i = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t;
                        return 1 === r && 0 === o ? function(e) {
                            return !!e.parentNode;
                        } : function(t, n, l) {
                            var u, c, f, d, p, h, g = i !== a ? "nextSibling" : "previousSibling", v = t.parentNode, m = s && t.nodeName.toLowerCase(), y = !l && !s, b = !1;
                            if (v) {
                                if (i) {
                                    for (;g; ) {
                                        for (d = t; d = d[g]; ) if (s ? d.nodeName.toLowerCase() === m : 1 === d.nodeType) return !1;
                                        h = g = "only" === e && !h && "nextSibling";
                                    }
                                    return !0;
                                }
                                if (h = [ a ? v.firstChild : v.lastChild ], a && y) {
                                    for (d = v, f = d[I] || (d[I] = {}), c = f[d.uniqueID] || (f[d.uniqueID] = {}), 
                                    u = c[e] || [], p = u[0] === _ && u[1], b = p && u[2], d = p && v.childNodes[p]; d = ++p && d && d[g] || (b = p = 0) || h.pop(); ) if (1 === d.nodeType && ++b && d === t) {
                                        c[e] = [ _, p, b ];
                                        break;
                                    }
                                } else if (y && (d = t, f = d[I] || (d[I] = {}), c = f[d.uniqueID] || (f[d.uniqueID] = {}), 
                                u = c[e] || [], p = u[0] === _ && u[1], b = p), !1 === b) for (;(d = ++p && d && d[g] || (b = p = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== m : 1 !== d.nodeType) || !++b || (y && (f = d[I] || (d[I] = {}), 
                                c = f[d.uniqueID] || (f[d.uniqueID] = {}), c[e] = [ _, b ]), d !== t)); ) ;
                                return (b -= o) === r || b % r == 0 && b / r >= 0;
                            }
                        };
                    },
                    PSEUDO: function(e, n) {
                        var o, i = k.pseudos[e] || k.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return i[I] ? i(n) : i.length > 1 ? (o = [ e, e, "", n ], k.setFilters.hasOwnProperty(e.toLowerCase()) ? r((function(e, t) {
                            for (var r, o = i(e, n), a = o.length; a--; ) r = te(e, o[a]), e[r] = !(t[r] = o[a]);
                        })) : function(e) {
                            return i(e, 0, o);
                        }) : i;
                    }
                },
                pseudos: {
                    not: r((function(e) {
                        var t = [], n = [], o = A(e.replace(le, "$1"));
                        return o[I] ? r((function(e, t, n, r) {
                            for (var i, a = o(e, null, r, []), s = e.length; s--; ) (i = a[s]) && (e[s] = !(t[s] = i));
                        })) : function(e, r, i) {
                            return t[0] = e, o(t, null, i, n), t[0] = null, !n.pop();
                        };
                    })),
                    has: r((function(e) {
                        return function(n) {
                            return t(e, n).length > 0;
                        };
                    })),
                    contains: r((function(e) {
                        return e = e.replace(be, xe), function(t) {
                            return (t.textContent || t.innerText || T(t)).indexOf(e) > -1;
                        };
                    })),
                    lang: r((function(e) {
                        return pe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(be, xe).toLowerCase(), 
                        function(t) {
                            var n;
                            do {
                                if (n = H ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-");
                            } while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1;
                        };
                    })),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id;
                    },
                    root: function(e) {
                        return e === P;
                    },
                    focus: function(e) {
                        return e === M.activeElement && (!M.hasFocus || M.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                    },
                    enabled: u(!1),
                    disabled: u(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected;
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return !1;
                        return !0;
                    },
                    parent: function(e) {
                        return !k.pseudos.empty(e);
                    },
                    header: function(e) {
                        return ve.test(e.nodeName);
                    },
                    input: function(e) {
                        return ge.test(e.nodeName);
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t;
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase());
                    },
                    first: c((function() {
                        return [ 0 ];
                    })),
                    last: c((function(e, t) {
                        return [ t - 1 ];
                    })),
                    eq: c((function(e, t, n) {
                        return [ n < 0 ? n + t : n ];
                    })),
                    even: c((function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e;
                    })),
                    odd: c((function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e;
                    })),
                    lt: c((function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; --r >= 0; ) e.push(r);
                        return e;
                    })),
                    gt: c((function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
                        return e;
                    }))
                }
            }, k.pseudos.nth = k.pseudos.eq;
            for (w in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) k.pseudos[w] = s(w);
            for (w in {
                submit: !0,
                reset: !0
            }) k.pseudos[w] = l(w);
            return d.prototype = k.filters = k.pseudos, k.setFilters = new d, E = t.tokenize = function(e, n) {
                var r, o, i, a, s, l, u, c = U[e + " "];
                if (c) return n ? 0 : c.slice(0);
                for (s = e, l = [], u = k.preFilter; s; ) {
                    r && !(o = ue.exec(s)) || (o && (s = s.slice(o[0].length) || s), l.push(i = [])), 
                    r = !1, (o = ce.exec(s)) && (r = o.shift(), i.push({
                        value: r,
                        type: o[0].replace(le, " ")
                    }), s = s.slice(r.length));
                    for (a in k.filter) !(o = he[a].exec(s)) || u[a] && !(o = u[a](o)) || (r = o.shift(), 
                    i.push({
                        value: r,
                        type: a,
                        matches: o
                    }), s = s.slice(r.length));
                    if (!r) break;
                }
                return n ? s.length : s ? t.error(e) : U(e, l).slice(0);
            }, A = t.compile = function(e, t) {
                var n, r = [], o = [], i = G[e + " "];
                if (!i) {
                    for (t || (t = E(e)), n = t.length; n--; ) i = b(t[n]), i[I] ? r.push(i) : o.push(i);
                    i = G(e, x(o, r)), i.selector = e;
                }
                return i;
            }, j = t.select = function(e, t, n, r) {
                var o, i, a, s, l, u = "function" == typeof e && e, c = !r && E(e = u.selector || e);
                if (n = n || [], 1 === c.length) {
                    if (i = c[0] = c[0].slice(0), i.length > 2 && "ID" === (a = i[0]).type && 9 === t.nodeType && H && k.relative[i[1].type]) {
                        if (!(t = (k.find.ID(a.matches[0].replace(be, xe), t) || [])[0])) return n;
                        u && (t = t.parentNode), e = e.slice(i.shift().value.length);
                    }
                    for (o = he.needsContext.test(e) ? 0 : i.length; o-- && (a = i[o], !k.relative[s = a.type]); ) if ((l = k.find[s]) && (r = l(a.matches[0].replace(be, xe), $.test(i[0].type) && f(t.parentNode) || t))) {
                        if (i.splice(o, 1), !(e = r.length && p(i))) return Z.apply(n, r), n;
                        break;
                    }
                }
                return (u || A(e, c))(r, t, !H, n, !t || $.test(e) && f(t.parentNode) || t), n;
            }, C.sortStable = I.split("").sort(X).join("") === I, C.detectDuplicates = !!q, 
            L(), C.sortDetached = o((function(e) {
                return 1 & e.compareDocumentPosition(M.createElement("fieldset"));
            })), o((function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
            })) || i("type|href|height|width", (function(e, t, n) {
                if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
            })), C.attributes && o((function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
            })) || i("value", (function(e, t, n) {
                if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
            })), o((function(e) {
                return null == e.getAttribute("disabled");
            })) || i(ne, (function(e, t, n) {
                var r;
                if (!n) return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
            })), t;
        }(e);
        ge.find = xe, ge.expr = xe.selectors, ge.expr[":"] = ge.expr.pseudos, ge.uniqueSort = ge.unique = xe.uniqueSort, 
        ge.text = xe.getText, ge.isXMLDoc = xe.isXML, ge.contains = xe.contains, ge.escapeSelector = xe.escape;
        var we = function(e, t, n) {
            for (var r = [], o = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; ) if (1 === e.nodeType) {
                if (o && ge(e).is(n)) break;
                r.push(e);
            }
            return r;
        }, Ce = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n;
        }, ke = ge.expr.match.needsContext, Te = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i, Se = /^.[^:#\[\.,]*$/;
        ge.filter = function(e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? ge.find.matchesSelector(r, e) ? [ r ] : [] : ge.find.matches(e, ge.grep(t, (function(e) {
                return 1 === e.nodeType;
            })));
        }, ge.fn.extend({
            find: function(e) {
                var t, n, r = this.length, o = this;
                if ("string" != typeof e) return this.pushStack(ge(e).filter((function() {
                    for (t = 0; t < r; t++) if (ge.contains(o[t], this)) return !0;
                })));
                for (n = this.pushStack([]), t = 0; t < r; t++) ge.find(e, o[t], n);
                return r > 1 ? ge.uniqueSort(n) : n;
            },
            filter: function(e) {
                return this.pushStack(i(this, e || [], !1));
            },
            not: function(e) {
                return this.pushStack(i(this, e || [], !0));
            },
            is: function(e) {
                return !!i(this, "string" == typeof e && ke.test(e) ? ge(e) : e || [], !1).length;
            }
        });
        var Ee, Ae = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        (ge.fn.init = function(e, t, n) {
            var r, o;
            if (!e) return this;
            if (n = n || Ee, "string" == typeof e) {
                if (!(r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [ null, e, null ] : Ae.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                if (r[1]) {
                    if (t = t instanceof ge ? t[0] : t, ge.merge(this, ge.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : ne, !0)), 
                    Te.test(r[1]) && ge.isPlainObject(t)) for (r in t) ge.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                    return this;
                }
                return o = ne.getElementById(r[2]), o && (this[0] = o, this.length = 1), this;
            }
            return e.nodeType ? (this[0] = e, this.length = 1, this) : ge.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(ge) : ge.makeArray(e, this);
        }).prototype = ge.fn, Ee = ge(ne);
        var je = /^(?:parents|prev(?:Until|All))/, Ne = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
        ge.fn.extend({
            has: function(e) {
                var t = ge(e, this), n = t.length;
                return this.filter((function() {
                    for (var e = 0; e < n; e++) if (ge.contains(this, t[e])) return !0;
                }));
            },
            closest: function(e, t) {
                var n, r = 0, o = this.length, i = [], a = "string" != typeof e && ge(e);
                if (!ke.test(e)) for (;r < o; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && ge.find.matchesSelector(n, e))) {
                    i.push(n);
                    break;
                }
                return this.pushStack(i.length > 1 ? ge.uniqueSort(i) : i);
            },
            index: function(e) {
                return e ? "string" == typeof e ? se.call(ge(e), this[0]) : se.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            },
            add: function(e, t) {
                return this.pushStack(ge.uniqueSort(ge.merge(this.get(), ge(e, t))));
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
            }
        }), ge.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null;
            },
            parents: function(e) {
                return we(e, "parentNode");
            },
            parentsUntil: function(e, t, n) {
                return we(e, "parentNode", n);
            },
            next: function(e) {
                return a(e, "nextSibling");
            },
            prev: function(e) {
                return a(e, "previousSibling");
            },
            nextAll: function(e) {
                return we(e, "nextSibling");
            },
            prevAll: function(e) {
                return we(e, "previousSibling");
            },
            nextUntil: function(e, t, n) {
                return we(e, "nextSibling", n);
            },
            prevUntil: function(e, t, n) {
                return we(e, "previousSibling", n);
            },
            siblings: function(e) {
                return Ce((e.parentNode || {}).firstChild, e);
            },
            children: function(e) {
                return Ce(e.firstChild);
            },
            contents: function(e) {
                return o(e, "iframe") ? e.contentDocument : (o(e, "template") && (e = e.content || e), 
                ge.merge([], e.childNodes));
            }
        }, (function(e, t) {
            ge.fn[e] = function(n, r) {
                var o = ge.map(this, t, n);
                return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (o = ge.filter(r, o)), 
                this.length > 1 && (Ne[e] || ge.uniqueSort(o), je.test(e) && o.reverse()), this.pushStack(o);
            };
        }));
        var De = /[^\x20\t\r\n\f]+/g;
        ge.Callbacks = function(e) {
            e = "string" == typeof e ? s(e) : ge.extend({}, e);
            var t, n, r, o, i = [], a = [], l = -1, u = function() {
                for (o = o || e.once, r = t = !0; a.length; l = -1) for (n = a.shift(); ++l < i.length; ) !1 === i[l].apply(n[0], n[1]) && e.stopOnFalse && (l = i.length, 
                n = !1);
                e.memory || (n = !1), t = !1, o && (i = n ? [] : "");
            }, c = {
                add: function() {
                    return i && (n && !t && (l = i.length - 1, a.push(n)), function t(n) {
                        ge.each(n, (function(n, r) {
                            ge.isFunction(r) ? e.unique && c.has(r) || i.push(r) : r && r.length && "string" !== ge.type(r) && t(r);
                        }));
                    }(arguments), n && !t && u()), this;
                },
                remove: function() {
                    return ge.each(arguments, (function(e, t) {
                        for (var n; (n = ge.inArray(t, i, n)) > -1; ) i.splice(n, 1), n <= l && l--;
                    })), this;
                },
                has: function(e) {
                    return e ? ge.inArray(e, i) > -1 : i.length > 0;
                },
                empty: function() {
                    return i && (i = []), this;
                },
                disable: function() {
                    return o = a = [], i = n = "", this;
                },
                disabled: function() {
                    return !i;
                },
                lock: function() {
                    return o = a = [], n || t || (i = n = ""), this;
                },
                locked: function() {
                    return !!o;
                },
                fireWith: function(e, n) {
                    return o || (n = n || [], n = [ e, n.slice ? n.slice() : n ], a.push(n), t || u()), 
                    this;
                },
                fire: function() {
                    return c.fireWith(this, arguments), this;
                },
                fired: function() {
                    return !!r;
                }
            };
            return c;
        }, ge.extend({
            Deferred: function(t) {
                var n = [ [ "notify", "progress", ge.Callbacks("memory"), ge.Callbacks("memory"), 2 ], [ "resolve", "done", ge.Callbacks("once memory"), ge.Callbacks("once memory"), 0, "resolved" ], [ "reject", "fail", ge.Callbacks("once memory"), ge.Callbacks("once memory"), 1, "rejected" ] ], r = "pending", o = {
                    state: function() {
                        return r;
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this;
                    },
                    catch: function(e) {
                        return o.then(null, e);
                    },
                    pipe: function() {
                        var e = arguments;
                        return ge.Deferred((function(t) {
                            ge.each(n, (function(n, r) {
                                var o = ge.isFunction(e[r[4]]) && e[r[4]];
                                i[r[1]]((function() {
                                    var e = o && o.apply(this, arguments);
                                    e && ge.isFunction(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, o ? [ e ] : arguments);
                                }));
                            })), e = null;
                        })).promise();
                    },
                    then: function(t, r, o) {
                        function i(t, n, r, o) {
                            return function() {
                                var s = this, c = arguments, f = function() {
                                    var e, f;
                                    if (!(t < a)) {
                                        if ((e = r.apply(s, c)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                        f = e && ("object" == typeof e || "function" == typeof e) && e.then, ge.isFunction(f) ? o ? f.call(e, i(a, n, l, o), i(a, n, u, o)) : (a++, 
                                        f.call(e, i(a, n, l, o), i(a, n, u, o), i(a, n, l, n.notifyWith))) : (r !== l && (s = void 0, 
                                        c = [ e ]), (o || n.resolveWith)(s, c));
                                    }
                                }, d = o ? f : function() {
                                    try {
                                        f();
                                    } catch (e) {
                                        ge.Deferred.exceptionHook && ge.Deferred.exceptionHook(e, d.stackTrace), t + 1 >= a && (r !== u && (s = void 0, 
                                        c = [ e ]), n.rejectWith(s, c));
                                    }
                                };
                                t ? d() : (ge.Deferred.getStackHook && (d.stackTrace = ge.Deferred.getStackHook()), 
                                e.setTimeout(d));
                            };
                        }
                        var a = 0;
                        return ge.Deferred((function(e) {
                            n[0][3].add(i(0, e, ge.isFunction(o) ? o : l, e.notifyWith)), n[1][3].add(i(0, e, ge.isFunction(t) ? t : l)), 
                            n[2][3].add(i(0, e, ge.isFunction(r) ? r : u));
                        })).promise();
                    },
                    promise: function(e) {
                        return null != e ? ge.extend(e, o) : o;
                    }
                }, i = {};
                return ge.each(n, (function(e, t) {
                    var a = t[2], s = t[5];
                    o[t[1]] = a.add, s && a.add((function() {
                        r = s;
                    }), n[3 - e][2].disable, n[0][2].lock), a.add(t[3].fire), i[t[0]] = function() {
                        return i[t[0] + "With"](this === i ? void 0 : this, arguments), this;
                    }, i[t[0] + "With"] = a.fireWith;
                })), o.promise(i), t && t.call(i, i), i;
            },
            when: function(e) {
                var t = arguments.length, n = t, r = Array(n), o = oe.call(arguments), i = ge.Deferred(), a = function(e) {
                    return function(n) {
                        r[e] = this, o[e] = arguments.length > 1 ? oe.call(arguments) : n, --t || i.resolveWith(r, o);
                    };
                };
                if (t <= 1 && (c(e, i.done(a(n)).resolve, i.reject, !t), "pending" === i.state() || ge.isFunction(o[n] && o[n].then))) return i.then();
                for (;n--; ) c(o[n], a(n), i.reject);
                return i.promise();
            }
        });
        var qe = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        ge.Deferred.exceptionHook = function(t, n) {
            e.console && e.console.warn && t && qe.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n);
        }, ge.readyException = function(t) {
            e.setTimeout((function() {
                throw t;
            }));
        };
        var Le = ge.Deferred();
        ge.fn.ready = function(e) {
            return Le.then(e).catch((function(e) {
                ge.readyException(e);
            })), this;
        }, ge.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(e) {
                (!0 === e ? --ge.readyWait : ge.isReady) || (ge.isReady = !0, !0 !== e && --ge.readyWait > 0 || Le.resolveWith(ne, [ ge ]));
            }
        }), ge.ready.then = Le.then, "complete" === ne.readyState || "loading" !== ne.readyState && !ne.documentElement.doScroll ? e.setTimeout(ge.ready) : (ne.addEventListener("DOMContentLoaded", f), 
        e.addEventListener("load", f));
        var Me = function(e, t, n, r, o, i, a) {
            var s = 0, l = e.length, u = null == n;
            if ("object" === ge.type(n)) {
                o = !0;
                for (s in n) Me(e, t, s, n[s], !0, i, a);
            } else if (void 0 !== r && (o = !0, ge.isFunction(r) || (a = !0), u && (a ? (t.call(e, r), 
            t = null) : (u = t, t = function(e, t, n) {
                return u.call(ge(e), n);
            })), t)) for (;s < l; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return o ? e : u ? t.call(e) : l ? t(e[0], n) : i;
        }, Pe = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
        };
        d.uid = 1, d.prototype = {
            cache: function(e) {
                var t = e[this.expando];
                return t || (t = {}, Pe(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0
                }))), t;
            },
            set: function(e, t, n) {
                var r, o = this.cache(e);
                if ("string" == typeof t) o[ge.camelCase(t)] = n; else for (r in t) o[ge.camelCase(r)] = t[r];
                return o;
            },
            get: function(e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][ge.camelCase(t)];
            },
            access: function(e, t, n) {
                return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), 
                void 0 !== n ? n : t);
            },
            remove: function(e, t) {
                var n, r = e[this.expando];
                if (void 0 !== r) {
                    if (void 0 !== t) {
                        Array.isArray(t) ? t = t.map(ge.camelCase) : (t = ge.camelCase(t), t = t in r ? [ t ] : t.match(De) || []), 
                        n = t.length;
                        for (;n--; ) delete r[t[n]];
                    }
                    (void 0 === t || ge.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
                }
            },
            hasData: function(e) {
                var t = e[this.expando];
                return void 0 !== t && !ge.isEmptyObject(t);
            }
        };
        var He = new d, Oe = new d, Be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Fe = /[A-Z]/g;
        ge.extend({
            hasData: function(e) {
                return Oe.hasData(e) || He.hasData(e);
            },
            data: function(e, t, n) {
                return Oe.access(e, t, n);
            },
            removeData: function(e, t) {
                Oe.remove(e, t);
            },
            _data: function(e, t, n) {
                return He.access(e, t, n);
            },
            _removeData: function(e, t) {
                He.remove(e, t);
            }
        }), ge.fn.extend({
            data: function(e, t) {
                var n, r, o, i = this[0], a = i && i.attributes;
                if (void 0 === e) {
                    if (this.length && (o = Oe.get(i), 1 === i.nodeType && !He.get(i, "hasDataAttrs"))) {
                        for (n = a.length; n--; ) a[n] && (r = a[n].name, 0 === r.indexOf("data-") && (r = ge.camelCase(r.slice(5)), 
                        p(i, r, o[r])));
                        He.set(i, "hasDataAttrs", !0);
                    }
                    return o;
                }
                return "object" == typeof e ? this.each((function() {
                    Oe.set(this, e);
                })) : Me(this, (function(t) {
                    var n;
                    if (i && void 0 === t) {
                        if (void 0 !== (n = Oe.get(i, e))) return n;
                        if (void 0 !== (n = p(i, e))) return n;
                    } else this.each((function() {
                        Oe.set(this, e, t);
                    }));
                }), null, t, arguments.length > 1, null, !0);
            },
            removeData: function(e) {
                return this.each((function() {
                    Oe.remove(this, e);
                }));
            }
        }), ge.extend({
            queue: function(e, t, n) {
                var r;
                if (e) return t = (t || "fx") + "queue", r = He.get(e, t), n && (!r || Array.isArray(n) ? r = He.access(e, t, ge.makeArray(n)) : r.push(n)), 
                r || [];
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = ge.queue(e, t), r = n.length, o = n.shift(), i = ge._queueHooks(e, t), a = function() {
                    ge.dequeue(e, t);
                };
                "inprogress" === o && (o = n.shift(), r--), o && ("fx" === t && n.unshift("inprogress"), 
                delete i.stop, o.call(e, a, i)), !r && i && i.empty.fire();
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return He.get(e, n) || He.access(e, n, {
                    empty: ge.Callbacks("once memory").add((function() {
                        He.remove(e, [ t + "queue", n ]);
                    }))
                });
            }
        }), ge.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? ge.queue(this[0], e) : void 0 === t ? this : this.each((function() {
                    var n = ge.queue(this, e, t);
                    ge._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && ge.dequeue(this, e);
                }));
            },
            dequeue: function(e) {
                return this.each((function() {
                    ge.dequeue(this, e);
                }));
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", []);
            },
            promise: function(e, t) {
                var n, r = 1, o = ge.Deferred(), i = this, a = this.length, s = function() {
                    --r || o.resolveWith(i, [ i ]);
                };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--; ) (n = He.get(i[a], e + "queueHooks")) && n.empty && (r++, 
                n.empty.add(s));
                return s(), o.promise(t);
            }
        });
        var Re = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Ie = new RegExp("^(?:([+-])=|)(" + Re + ")([a-z%]*)$", "i"), $e = [ "Top", "Right", "Bottom", "Left" ], We = function(e, t) {
            return e = t || e, "none" === e.style.display || "" === e.style.display && ge.contains(e.ownerDocument, e) && "none" === ge.css(e, "display");
        }, _e = function(e, t, n, r) {
            var o, i, a = {};
            for (i in t) a[i] = e.style[i], e.style[i] = t[i];
            o = n.apply(e, r || []);
            for (i in t) e.style[i] = a[i];
            return o;
        }, Ve = {};
        ge.fn.extend({
            show: function() {
                return v(this, !0);
            },
            hide: function() {
                return v(this);
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each((function() {
                    We(this) ? ge(this).show() : ge(this).hide();
                }));
            }
        });
        var ze = /^(?:checkbox|radio)$/i, Ue = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i, Ge = /^$|\/(?:java|ecma)script/i, Xe = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            thead: [ 1, "<table>", "</table>" ],
            col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            _default: [ 0, "", "" ]
        };
        Xe.optgroup = Xe.option, Xe.tbody = Xe.tfoot = Xe.colgroup = Xe.caption = Xe.thead, 
        Xe.th = Xe.td;
        var Ke = /<|&#?\w+;/;
        !function() {
            var e = ne.createDocumentFragment(), t = e.appendChild(ne.createElement("div")), n = ne.createElement("input");
            n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), 
            t.appendChild(n), pe.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, 
            t.innerHTML = "<textarea>x</textarea>", pe.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue;
        }();
        var Qe = ne.documentElement, Ye = /^key/, Je = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Ze = /^([^.]*)(?:\.(.+)|)/;
        ge.event = {
            global: {},
            add: function(e, t, n, r, o) {
                var i, a, s, l, u, c, f, d, p, h, g, v = He.get(e);
                if (v) for (n.handler && (i = n, n = i.handler, o = i.selector), o && ge.find.matchesSelector(Qe, o), 
                n.guid || (n.guid = ge.guid++), (l = v.events) || (l = v.events = {}), (a = v.handle) || (a = v.handle = function(t) {
                    return void 0 !== ge && ge.event.triggered !== t.type ? ge.event.dispatch.apply(e, arguments) : void 0;
                }), t = (t || "").match(De) || [ "" ], u = t.length; u--; ) s = Ze.exec(t[u]) || [], 
                p = g = s[1], h = (s[2] || "").split(".").sort(), p && (f = ge.event.special[p] || {}, 
                p = (o ? f.delegateType : f.bindType) || p, f = ge.event.special[p] || {}, c = ge.extend({
                    type: p,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: o,
                    needsContext: o && ge.expr.match.needsContext.test(o),
                    namespace: h.join(".")
                }, i), (d = l[p]) || (d = l[p] = [], d.delegateCount = 0, f.setup && !1 !== f.setup.call(e, r, h, a) || e.addEventListener && e.addEventListener(p, a)), 
                f.add && (f.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), o ? d.splice(d.delegateCount++, 0, c) : d.push(c), 
                ge.event.global[p] = !0);
            },
            remove: function(e, t, n, r, o) {
                var i, a, s, l, u, c, f, d, p, h, g, v = He.hasData(e) && He.get(e);
                if (v && (l = v.events)) {
                    for (t = (t || "").match(De) || [ "" ], u = t.length; u--; ) if (s = Ze.exec(t[u]) || [], 
                    p = g = s[1], h = (s[2] || "").split(".").sort(), p) {
                        for (f = ge.event.special[p] || {}, p = (r ? f.delegateType : f.bindType) || p, 
                        d = l[p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                        a = i = d.length; i--; ) c = d[i], !o && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (d.splice(i, 1), 
                        c.selector && d.delegateCount--, f.remove && f.remove.call(e, c));
                        a && !d.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || ge.removeEvent(e, p, v.handle), 
                        delete l[p]);
                    } else for (p in l) ge.event.remove(e, p + t[u], n, r, !0);
                    ge.isEmptyObject(l) && He.remove(e, "handle events");
                }
            },
            dispatch: function(e) {
                var n, r, o, i, a, s, t = ge.event.fix(e), l = new Array(arguments.length), u = (He.get(this, "events") || {})[t.type] || [], c = ge.event.special[t.type] || {};
                for (l[0] = t, n = 1; n < arguments.length; n++) l[n] = arguments[n];
                if (t.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, t)) {
                    for (s = ge.event.handlers.call(this, t, u), n = 0; (i = s[n++]) && !t.isPropagationStopped(); ) for (t.currentTarget = i.elem, 
                    r = 0; (a = i.handlers[r++]) && !t.isImmediatePropagationStopped(); ) t.rnamespace && !t.rnamespace.test(a.namespace) || (t.handleObj = a, 
                    t.data = a.data, void 0 !== (o = ((ge.event.special[a.origType] || {}).handle || a.handler).apply(i.elem, l)) && !1 === (t.result = o) && (t.preventDefault(), 
                    t.stopPropagation()));
                    return c.postDispatch && c.postDispatch.call(this, t), t.result;
                }
            },
            handlers: function(e, t) {
                var n, r, o, i, a, s = [], l = t.delegateCount, u = e.target;
                if (l && u.nodeType && !("click" === e.type && e.button >= 1)) for (;u !== this; u = u.parentNode || this) if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                    for (i = [], a = {}, n = 0; n < l; n++) r = t[n], o = r.selector + " ", void 0 === a[o] && (a[o] = r.needsContext ? ge(o, this).index(u) > -1 : ge.find(o, this, null, [ u ]).length), 
                    a[o] && i.push(r);
                    i.length && s.push({
                        elem: u,
                        handlers: i
                    });
                }
                return u = this, l < t.length && s.push({
                    elem: u,
                    handlers: t.slice(l)
                }), s;
            },
            addProp: function(e, t) {
                Object.defineProperty(ge.Event.prototype, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: ge.isFunction(t) ? function() {
                        if (this.originalEvent) return t(this.originalEvent);
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[e];
                    },
                    set: function(t) {
                        Object.defineProperty(this, e, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: t
                        });
                    }
                });
            },
            fix: function(e) {
                return e[ge.expando] ? e : new ge.Event(e);
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== C() && this.focus) return this.focus(), !1;
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === C() && this.blur) return this.blur(), !1;
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if ("checkbox" === this.type && this.click && o(this, "input")) return this.click(), 
                        !1;
                    },
                    _default: function(e) {
                        return o(e.target, "a");
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result);
                    }
                }
            }
        }, ge.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n);
        }, ge.Event = function(e, t) {
            return this instanceof ge.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, 
            this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? x : w, 
            this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, 
            this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, 
            t && ge.extend(this, t), this.timeStamp = e && e.timeStamp || ge.now(), void (this[ge.expando] = !0)) : new ge.Event(e, t);
        }, ge.Event.prototype = {
            constructor: ge.Event,
            isDefaultPrevented: w,
            isPropagationStopped: w,
            isImmediatePropagationStopped: w,
            isSimulated: !1,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = x, e && !this.isSimulated && e.preventDefault();
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = x, e && !this.isSimulated && e.stopPropagation();
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = x, e && !this.isSimulated && e.stopImmediatePropagation(), 
                this.stopPropagation();
            }
        }, ge.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(e) {
                var t = e.button;
                return null == e.which && Ye.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Je.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which;
            }
        }, ge.event.addProp), ge.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, (function(e, t) {
            ge.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this, o = e.relatedTarget, i = e.handleObj;
                    return o && (o === r || ge.contains(r, o)) || (e.type = i.origType, n = i.handler.apply(this, arguments), 
                    e.type = t), n;
                }
            };
        })), ge.fn.extend({
            on: function(e, t, n, r) {
                return k(this, e, t, n, r);
            },
            one: function(e, t, n, r) {
                return k(this, e, t, n, r, 1);
            },
            off: function(e, t, n) {
                var r, o;
                if (e && e.preventDefault && e.handleObj) return r = e.handleObj, ge(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), 
                this;
                if ("object" == typeof e) {
                    for (o in e) this.off(o, t, e[o]);
                    return this;
                }
                return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = w), 
                this.each((function() {
                    ge.event.remove(this, e, n, t);
                }));
            }
        });
        var tt = /<script|<style|<link/i, nt = /checked\s*(?:[^=]|=\s*.checked.)/i, rt = /^true\/(.*)/, ot = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        ge.extend({
            htmlPrefilter: function(e) {
                return e.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi, "<$1></$2>");
            },
            clone: function(e, t, n) {
                var r, o, i, a, s = e.cloneNode(!0), l = ge.contains(e.ownerDocument, e);
                if (!(pe.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ge.isXMLDoc(e))) for (a = m(s), 
                i = m(e), r = 0, o = i.length; r < o; r++) j(i[r], a[r]);
                if (t) if (n) for (i = i || m(e), a = a || m(s), r = 0, o = i.length; r < o; r++) A(i[r], a[r]); else A(e, s);
                return a = m(s, "script"), a.length > 0 && y(a, !l && m(e, "script")), s;
            },
            cleanData: function(e) {
                for (var t, n, r, o = ge.event.special, i = 0; void 0 !== (n = e[i]); i++) if (Pe(n)) {
                    if (t = n[He.expando]) {
                        if (t.events) for (r in t.events) o[r] ? ge.event.remove(n, r) : ge.removeEvent(n, r, t.handle);
                        n[He.expando] = void 0;
                    }
                    n[Oe.expando] && (n[Oe.expando] = void 0);
                }
            }
        }), ge.fn.extend({
            detach: function(e) {
                return D(this, e, !0);
            },
            remove: function(e) {
                return D(this, e);
            },
            text: function(e) {
                return Me(this, (function(e) {
                    return void 0 === e ? ge.text(this) : this.empty().each((function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e);
                    }));
                }), null, e, arguments.length);
            },
            append: function() {
                return N(this, arguments, (function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) T(this, e).appendChild(e);
                }));
            },
            prepend: function() {
                return N(this, arguments, (function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = T(this, e);
                        t.insertBefore(e, t.firstChild);
                    }
                }));
            },
            before: function() {
                return N(this, arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this);
                }));
            },
            after: function() {
                return N(this, arguments, (function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                }));
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (ge.cleanData(m(e, !1)), 
                e.textContent = "");
                return this;
            },
            clone: function(e, t) {
                return e = null != e && e, t = null == t ? e : t, this.map((function() {
                    return ge.clone(this, e, t);
                }));
            },
            html: function(e) {
                return Me(this, (function(e) {
                    var t = this[0] || {}, n = 0, r = this.length;
                    if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                    if ("string" == typeof e && !tt.test(e) && !Xe[(Ue.exec(e) || [ "", "" ])[1].toLowerCase()]) {
                        e = ge.htmlPrefilter(e);
                        try {
                            for (;n < r; n++) t = this[n] || {}, 1 === t.nodeType && (ge.cleanData(m(t, !1)), 
                            t.innerHTML = e);
                            t = 0;
                        } catch (e) {}
                    }
                    t && this.empty().append(e);
                }), null, e, arguments.length);
            },
            replaceWith: function() {
                var e = [];
                return N(this, arguments, (function(t) {
                    var n = this.parentNode;
                    ge.inArray(this, e) < 0 && (ge.cleanData(m(this)), n && n.replaceChild(t, this));
                }), e);
            }
        }), ge.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, (function(e, t) {
            ge.fn[e] = function(e) {
                for (var n, r = [], o = ge(e), i = o.length - 1, a = 0; a <= i; a++) n = a === i ? this : this.clone(!0), 
                ge(o[a])[t](n), ae.apply(r, n.get());
                return this.pushStack(r);
            };
        }));
        var it = /^margin/, at = new RegExp("^(" + Re + ")(?!px)[a-z%]+$", "i"), st = function(t) {
            var n = t.ownerDocument.defaultView;
            return n && n.opener || (n = e), n.getComputedStyle(t);
        };
        !function() {
            function t() {
                if (s) {
                    s.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", 
                    s.innerHTML = "", Qe.appendChild(a);
                    var t = e.getComputedStyle(s);
                    n = "1%" !== t.top, i = "2px" === t.marginLeft, r = "4px" === t.width, s.style.marginRight = "50%", 
                    o = "4px" === t.marginRight, Qe.removeChild(a), s = null;
                }
            }
            var n, r, o, i, a = ne.createElement("div"), s = ne.createElement("div");
            s.style && (s.style.backgroundClip = "content-box", s.cloneNode(!0).style.backgroundClip = "", 
            pe.clearCloneStyle = "content-box" === s.style.backgroundClip, a.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", 
            a.appendChild(s), ge.extend(pe, {
                pixelPosition: function() {
                    return t(), n;
                },
                boxSizingReliable: function() {
                    return t(), r;
                },
                pixelMarginRight: function() {
                    return t(), o;
                },
                reliableMarginLeft: function() {
                    return t(), i;
                }
            }));
        }();
        var lt = /^(none|table(?!-c[ea]).+)/, ut = /^--/, ct = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, ft = {
            letterSpacing: "0",
            fontWeight: "400"
        }, dt = [ "Webkit", "Moz", "ms" ], pt = ne.createElement("div").style;
        ge.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = q(e, "opacity");
                            return "" === n ? "1" : n;
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                float: "cssFloat"
            },
            style: function(e, t, n, r) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o, i, a, s = ge.camelCase(t), l = ut.test(t), u = e.style;
                    return l || (t = P(s)), a = ge.cssHooks[t] || ge.cssHooks[s], void 0 === n ? a && "get" in a && void 0 !== (o = a.get(e, !1, r)) ? o : u[t] : (i = typeof n, 
                    "string" === i && (o = Ie.exec(n)) && o[1] && (n = h(e, t, o), i = "number"), void (null != n && n === n && ("number" === i && (n += o && o[3] || (ge.cssNumber[s] ? "" : "px")), 
                    pe.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), 
                    a && "set" in a && void 0 === (n = a.set(e, n, r)) || (l ? u.setProperty(t, n) : u[t] = n))));
                }
            },
            css: function(e, t, n, r) {
                var o, i, a, s = ge.camelCase(t);
                return ut.test(t) || (t = P(s)), a = ge.cssHooks[t] || ge.cssHooks[s], a && "get" in a && (o = a.get(e, !0, n)), 
                void 0 === o && (o = q(e, t, r)), "normal" === o && t in ft && (o = ft[t]), "" === n || n ? (i = parseFloat(o), 
                !0 === n || isFinite(i) ? i || 0 : o) : o;
            }
        }), ge.each([ "height", "width" ], (function(e, t) {
            ge.cssHooks[t] = {
                get: function(e, n, r) {
                    if (n) return !lt.test(ge.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? B(e, t, r) : _e(e, ct, (function() {
                        return B(e, t, r);
                    }));
                },
                set: function(e, n, r) {
                    var o, i = r && st(e), a = r && O(e, t, r, "border-box" === ge.css(e, "boxSizing", !1, i), i);
                    return a && (o = Ie.exec(n)) && "px" !== (o[3] || "px") && (e.style[t] = n, n = ge.css(e, t)), 
                    H(e, n, a);
                }
            };
        })), ge.cssHooks.marginLeft = L(pe.reliableMarginLeft, (function(e, t) {
            if (t) return (parseFloat(q(e, "marginLeft")) || e.getBoundingClientRect().left - _e(e, {
                marginLeft: 0
            }, (function() {
                return e.getBoundingClientRect().left;
            }))) + "px";
        })), ge.each({
            margin: "",
            padding: "",
            border: "Width"
        }, (function(e, t) {
            ge.cssHooks[e + t] = {
                expand: function(n) {
                    for (var r = 0, o = {}, i = "string" == typeof n ? n.split(" ") : [ n ]; r < 4; r++) o[e + $e[r] + t] = i[r] || i[r - 2] || i[0];
                    return o;
                }
            }, it.test(e) || (ge.cssHooks[e + t].set = H);
        })), ge.fn.extend({
            css: function(e, t) {
                return Me(this, (function(e, t, n) {
                    var r, o, i = {}, a = 0;
                    if (Array.isArray(t)) {
                        for (r = st(e), o = t.length; a < o; a++) i[t[a]] = ge.css(e, t[a], !1, r);
                        return i;
                    }
                    return void 0 !== n ? ge.style(e, t, n) : ge.css(e, t);
                }), e, t, arguments.length > 1);
            }
        }), ge.Tween = F, F.prototype = {
            constructor: F,
            init: function(e, t, n, r, o, i) {
                this.elem = e, this.prop = n, this.easing = o || ge.easing._default, this.options = t, 
                this.start = this.now = this.cur(), this.end = r, this.unit = i || (ge.cssNumber[n] ? "" : "px");
            },
            cur: function() {
                var e = F.propHooks[this.prop];
                return e && e.get ? e.get(this) : F.propHooks._default.get(this);
            },
            run: function(e) {
                var t, n = F.propHooks[this.prop];
                return this.options.duration ? this.pos = t = ge.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, 
                this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                n && n.set ? n.set(this) : F.propHooks._default.set(this), this;
            }
        }, F.prototype.init.prototype = F.prototype, F.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = ge.css(e.elem, e.prop, ""), 
                    t && "auto" !== t ? t : 0);
                },
                set: function(e) {
                    ge.fx.step[e.prop] ? ge.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[ge.cssProps[e.prop]] && !ge.cssHooks[e.prop] ? e.elem[e.prop] = e.now : ge.style(e.elem, e.prop, e.now + e.unit);
                }
            }
        }, F.propHooks.scrollTop = F.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
            }
        }, ge.easing = {
            linear: function(e) {
                return e;
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2;
            },
            _default: "swing"
        }, ge.fx = F.prototype.init, ge.fx.step = {};
        var ht, gt, vt = /^(?:toggle|show|hide)$/, mt = /queueHooks$/;
        ge.Animation = ge.extend(U, {
            tweeners: {
                "*": [ function(e, t) {
                    var n = this.createTween(e, t);
                    return h(n.elem, e, Ie.exec(t), n), n;
                } ]
            },
            tweener: function(e, t) {
                ge.isFunction(e) ? (t = e, e = [ "*" ]) : e = e.match(De);
                for (var n, r = 0, o = e.length; r < o; r++) n = e[r], U.tweeners[n] = U.tweeners[n] || [], 
                U.tweeners[n].unshift(t);
            },
            prefilters: [ V ],
            prefilter: function(e, t) {
                t ? U.prefilters.unshift(e) : U.prefilters.push(e);
            }
        }), ge.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? ge.extend({}, e) : {
                complete: n || !n && t || ge.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !ge.isFunction(t) && t
            };
            return ge.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in ge.fx.speeds ? r.duration = ge.fx.speeds[r.duration] : r.duration = ge.fx.speeds._default), 
            null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                ge.isFunction(r.old) && r.old.call(this), r.queue && ge.dequeue(this, r.queue);
            }, r;
        }, ge.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(We).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r);
            },
            animate: function(e, t, n, r) {
                var o = ge.isEmptyObject(e), i = ge.speed(t, n, r), a = function() {
                    var t = U(this, ge.extend({}, e), i);
                    (o || He.get(this, "finish")) && t.stop(!0);
                };
                return a.finish = a, o || !1 === i.queue ? this.each(a) : this.queue(i.queue, a);
            },
            stop: function(e, t, n) {
                var r = function(e) {
                    var t = e.stop;
                    delete e.stop, t(n);
                };
                return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), 
                this.each((function() {
                    var t = !0, o = null != e && e + "queueHooks", i = ge.timers, a = He.get(this);
                    if (o) a[o] && a[o].stop && r(a[o]); else for (o in a) a[o] && a[o].stop && mt.test(o) && r(a[o]);
                    for (o = i.length; o--; ) i[o].elem !== this || null != e && i[o].queue !== e || (i[o].anim.stop(n), 
                    t = !1, i.splice(o, 1));
                    !t && n || ge.dequeue(this, e);
                }));
            },
            finish: function(e) {
                return !1 !== e && (e = e || "fx"), this.each((function() {
                    var t, n = He.get(this), r = n[e + "queue"], o = n[e + "queueHooks"], i = ge.timers, a = r ? r.length : 0;
                    for (n.finish = !0, ge.queue(this, e, []), o && o.stop && o.stop.call(this, !0), 
                    t = i.length; t--; ) i[t].elem === this && i[t].queue === e && (i[t].anim.stop(!0), 
                    i.splice(t, 1));
                    for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                    delete n.finish;
                }));
            }
        }), ge.each([ "toggle", "show", "hide" ], (function(e, t) {
            var n = ge.fn[t];
            ge.fn[t] = function(e, r, o) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(W(t, !0), e, r, o);
            };
        })), ge.each({
            slideDown: W("show"),
            slideUp: W("hide"),
            slideToggle: W("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, (function(e, t) {
            ge.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r);
            };
        })), ge.timers = [], ge.fx.tick = function() {
            var e, t = 0, n = ge.timers;
            for (ht = ge.now(); t < n.length; t++) (e = n[t])() || n[t] !== e || n.splice(t--, 1);
            n.length || ge.fx.stop(), ht = void 0;
        }, ge.fx.timer = function(e) {
            ge.timers.push(e), ge.fx.start();
        }, ge.fx.interval = 13, ge.fx.start = function() {
            gt || (gt = !0, R());
        }, ge.fx.stop = function() {
            gt = null;
        }, ge.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, ge.fn.delay = function(t, n) {
            return t = ge.fx ? ge.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, (function(n, r) {
                var o = e.setTimeout(n, t);
                r.stop = function() {
                    e.clearTimeout(o);
                };
            }));
        }, function() {
            var e = ne.createElement("input"), t = ne.createElement("select"), n = t.appendChild(ne.createElement("option"));
            e.type = "checkbox", pe.checkOn = "" !== e.value, pe.optSelected = n.selected, e = ne.createElement("input"), 
            e.value = "t", e.type = "radio", pe.radioValue = "t" === e.value;
        }();
        var yt, bt = ge.expr.attrHandle;
        ge.fn.extend({
            attr: function(e, t) {
                return Me(this, ge.attr, e, t, arguments.length > 1);
            },
            removeAttr: function(e) {
                return this.each((function() {
                    ge.removeAttr(this, e);
                }));
            }
        }), ge.extend({
            attr: function(e, t, n) {
                var r, o, i = e.nodeType;
                if (3 !== i && 8 !== i && 2 !== i) return void 0 === e.getAttribute ? ge.prop(e, t, n) : (1 === i && ge.isXMLDoc(e) || (o = ge.attrHooks[t.toLowerCase()] || (ge.expr.match.bool.test(t) ? yt : void 0)), 
                void 0 !== n ? null === n ? void ge.removeAttr(e, t) : o && "set" in o && void 0 !== (r = o.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), 
                n) : o && "get" in o && null !== (r = o.get(e, t)) ? r : (r = ge.find.attr(e, t), 
                null == r ? void 0 : r));
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!pe.radioValue && "radio" === t && o(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t;
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var n, r = 0, o = t && t.match(De);
                if (o && 1 === e.nodeType) for (;n = o[r++]; ) e.removeAttribute(n);
            }
        }), yt = {
            set: function(e, t, n) {
                return !1 === t ? ge.removeAttr(e, n) : e.setAttribute(n, n), n;
            }
        }, ge.each(ge.expr.match.bool.source.match(/\w+/g), (function(e, t) {
            var n = bt[t] || ge.find.attr;
            bt[t] = function(e, t, r) {
                var o, i, a = t.toLowerCase();
                return r || (i = bt[a], bt[a] = o, o = null != n(e, t, r) ? a : null, bt[a] = i), 
                o;
            };
        }));
        var xt = /^(?:input|select|textarea|button)$/i, wt = /^(?:a|area)$/i;
        ge.fn.extend({
            prop: function(e, t) {
                return Me(this, ge.prop, e, t, arguments.length > 1);
            },
            removeProp: function(e) {
                return this.each((function() {
                    delete this[ge.propFix[e] || e];
                }));
            }
        }), ge.extend({
            prop: function(e, t, n) {
                var r, o, i = e.nodeType;
                if (3 !== i && 8 !== i && 2 !== i) return 1 === i && ge.isXMLDoc(e) || (t = ge.propFix[t] || t, 
                o = ge.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (r = o.set(e, n, t)) ? r : e[t] = n : o && "get" in o && null !== (r = o.get(e, t)) ? r : e[t];
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = ge.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : xt.test(e.nodeName) || wt.test(e.nodeName) && e.href ? 0 : -1;
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), pe.optSelected || (ge.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex, null;
            },
            set: function(e) {
                var t = e.parentNode;
                t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
            }
        }), ge.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], (function() {
            ge.propFix[this.toLowerCase()] = this;
        })), ge.fn.extend({
            addClass: function(e) {
                var t, n, r, o, i, a, s, l = 0;
                if (ge.isFunction(e)) return this.each((function(t) {
                    ge(this).addClass(e.call(this, t, X(this)));
                }));
                if ("string" == typeof e && e) for (t = e.match(De) || []; n = this[l++]; ) if (o = X(n), 
                r = 1 === n.nodeType && " " + G(o) + " ") {
                    for (a = 0; i = t[a++]; ) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                    s = G(r), o !== s && n.setAttribute("class", s);
                }
                return this;
            },
            removeClass: function(e) {
                var t, n, r, o, i, a, s, l = 0;
                if (ge.isFunction(e)) return this.each((function(t) {
                    ge(this).removeClass(e.call(this, t, X(this)));
                }));
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof e && e) for (t = e.match(De) || []; n = this[l++]; ) if (o = X(n), 
                r = 1 === n.nodeType && " " + G(o) + " ") {
                    for (a = 0; i = t[a++]; ) for (;r.indexOf(" " + i + " ") > -1; ) r = r.replace(" " + i + " ", " ");
                    s = G(r), o !== s && n.setAttribute("class", s);
                }
                return this;
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : ge.isFunction(e) ? this.each((function(n) {
                    ge(this).toggleClass(e.call(this, n, X(this), t), t);
                })) : this.each((function() {
                    var t, r, o, i;
                    if ("string" === n) for (r = 0, o = ge(this), i = e.match(De) || []; t = i[r++]; ) o.hasClass(t) ? o.removeClass(t) : o.addClass(t); else void 0 !== e && "boolean" !== n || (t = X(this), 
                    t && He.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : He.get(this, "__className__") || ""));
                }));
            },
            hasClass: function(e) {
                var t, n, r = 0;
                for (t = " " + e + " "; n = this[r++]; ) if (1 === n.nodeType && (" " + G(X(n)) + " ").indexOf(t) > -1) return !0;
                return !1;
            }
        });
        ge.fn.extend({
            val: function(e) {
                var t, n, r, o = this[0];
                return arguments.length ? (r = ge.isFunction(e), this.each((function(n) {
                    var o;
                    1 === this.nodeType && (o = r ? e.call(this, n, ge(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : Array.isArray(o) && (o = ge.map(o, (function(e) {
                        return null == e ? "" : e + "";
                    }))), (t = ge.valHooks[this.type] || ge.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o));
                }))) : o ? (t = ge.valHooks[o.type] || ge.valHooks[o.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(o, "value")) ? n : (n = o.value, 
                "string" == typeof n ? n.replace(/\r/g, "") : null == n ? "" : n)) : void 0;
            }
        }), ge.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = ge.find.attr(e, "value");
                        return null != t ? t : G(ge.text(e));
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, r, i = e.options, a = e.selectedIndex, s = "select-one" === e.type, l = s ? null : [], u = s ? a + 1 : i.length;
                        for (r = a < 0 ? u : s ? a : 0; r < u; r++) if (n = i[r], (n.selected || r === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                            if (t = ge(n).val(), s) return t;
                            l.push(t);
                        }
                        return l;
                    },
                    set: function(e, t) {
                        for (var n, r, o = e.options, i = ge.makeArray(t), a = o.length; a--; ) r = o[a], 
                        (r.selected = ge.inArray(ge.valHooks.option.get(r), i) > -1) && (n = !0);
                        return n || (e.selectedIndex = -1), i;
                    }
                }
            }
        }), ge.each([ "radio", "checkbox" ], (function() {
            ge.valHooks[this] = {
                set: function(e, t) {
                    if (Array.isArray(t)) return e.checked = ge.inArray(ge(e).val(), t) > -1;
                }
            }, pe.checkOn || (ge.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value;
            });
        }));
        var kt = /^(?:focusinfocus|focusoutblur)$/;
        ge.extend(ge.event, {
            trigger: function(t, n, r, o) {
                var i, a, s, l, u, c, f, d = [ r || ne ], p = ce.call(t, "type") ? t.type : t, h = ce.call(t, "namespace") ? t.namespace.split(".") : [];
                if (a = s = r = r || ne, 3 !== r.nodeType && 8 !== r.nodeType && !kt.test(p + ge.event.triggered) && (p.indexOf(".") > -1 && (h = p.split("."), 
                p = h.shift(), h.sort()), u = p.indexOf(":") < 0 && "on" + p, t = t[ge.expando] ? t : new ge.Event(p, "object" == typeof t && t), 
                t.isTrigger = o ? 2 : 3, t.namespace = h.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                t.result = void 0, t.target || (t.target = r), n = null == n ? [ t ] : ge.makeArray(n, [ t ]), 
                f = ge.event.special[p] || {}, o || !f.trigger || !1 !== f.trigger.apply(r, n))) {
                    if (!o && !f.noBubble && !ge.isWindow(r)) {
                        for (l = f.delegateType || p, kt.test(l + p) || (a = a.parentNode); a; a = a.parentNode) d.push(a), 
                        s = a;
                        s === (r.ownerDocument || ne) && d.push(s.defaultView || s.parentWindow || e);
                    }
                    for (i = 0; (a = d[i++]) && !t.isPropagationStopped(); ) t.type = i > 1 ? l : f.bindType || p, 
                    c = (He.get(a, "events") || {})[t.type] && He.get(a, "handle"), c && c.apply(a, n), 
                    (c = u && a[u]) && c.apply && Pe(a) && (t.result = c.apply(a, n), !1 === t.result && t.preventDefault());
                    return t.type = p, o || t.isDefaultPrevented() || f._default && !1 !== f._default.apply(d.pop(), n) || !Pe(r) || u && ge.isFunction(r[p]) && !ge.isWindow(r) && (s = r[u], 
                    s && (r[u] = null), ge.event.triggered = p, r[p](), ge.event.triggered = void 0, 
                    s && (r[u] = s)), t.result;
                }
            },
            simulate: function(e, t, n) {
                var r = ge.extend(new ge.Event, n, {
                    type: e,
                    isSimulated: !0
                });
                ge.event.trigger(r, null, t);
            }
        }), ge.fn.extend({
            trigger: function(e, t) {
                return this.each((function() {
                    ge.event.trigger(e, t, this);
                }));
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                if (n) return ge.event.trigger(e, t, n, !0);
            }
        }), ge.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), (function(e, t) {
            ge.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
            };
        })), ge.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e);
            }
        }), pe.focusin = "onfocusin" in e, pe.focusin || ge.each({
            focus: "focusin",
            blur: "focusout"
        }, (function(e, t) {
            var n = function(e) {
                ge.event.simulate(t, e.target, ge.event.fix(e));
            };
            ge.event.special[t] = {
                setup: function() {
                    var r = this.ownerDocument || this, o = He.access(r, t);
                    o || r.addEventListener(e, n, !0), He.access(r, t, (o || 0) + 1);
                },
                teardown: function() {
                    var r = this.ownerDocument || this, o = He.access(r, t) - 1;
                    o ? He.access(r, t, o) : (r.removeEventListener(e, n, !0), He.remove(r, t));
                }
            };
        }));
        var Tt = e.location, St = ge.now(), Et = /\?/;
        ge.parseXML = function(t) {
            var n;
            if (!t || "string" != typeof t) return null;
            try {
                n = (new e.DOMParser).parseFromString(t, "text/xml");
            } catch (e) {
                n = void 0;
            }
            return n && !n.getElementsByTagName("parsererror").length || ge.error("Invalid XML: " + t), 
            n;
        };
        var At = /\[\]$/, Nt = /^(?:submit|button|image|reset|file)$/i, Dt = /^(?:input|select|textarea|keygen)/i;
        ge.param = function(e, t) {
            var n, r = [], o = function(e, t) {
                var n = ge.isFunction(t) ? t() : t;
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
            };
            if (Array.isArray(e) || e.jquery && !ge.isPlainObject(e)) ge.each(e, (function() {
                o(this.name, this.value);
            })); else for (n in e) K(n, e[n], t, o);
            return r.join("&");
        }, ge.fn.extend({
            serialize: function() {
                return ge.param(this.serializeArray());
            },
            serializeArray: function() {
                return this.map((function() {
                    var e = ge.prop(this, "elements");
                    return e ? ge.makeArray(e) : this;
                })).filter((function() {
                    var e = this.type;
                    return this.name && !ge(this).is(":disabled") && Dt.test(this.nodeName) && !Nt.test(e) && (this.checked || !ze.test(e));
                })).map((function(e, t) {
                    var n = ge(this).val();
                    return null == n ? null : Array.isArray(n) ? ge.map(n, (function(e) {
                        return {
                            name: t.name,
                            value: e.replace(/\r?\n/g, "\r\n")
                        };
                    })) : {
                        name: t.name,
                        value: n.replace(/\r?\n/g, "\r\n")
                    };
                })).get();
            }
        });
        var Pt = /^(.*?):[ \t]*([^\r\n]*)$/gm, Ht = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ot = /^(?:GET|HEAD)$/, Ft = {}, Rt = {}, It = "*/".concat("*"), $t = ne.createElement("a");
        $t.href = Tt.href, ge.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Tt.href,
                type: "GET",
                isLocal: Ht.test(Tt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": It,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": ge.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? J(J(e, ge.ajaxSettings), t) : J(ge.ajaxSettings, e);
            },
            ajaxPrefilter: Q(Ft),
            ajaxTransport: Q(Rt),
            ajax: function(t, n) {
                function r(t, n, r, s) {
                    var u, d, p, x, w, C = n;
                    c || (c = !0, l && e.clearTimeout(l), o = void 0, a = s || "", k.readyState = t > 0 ? 4 : 0, 
                    u = t >= 200 && t < 300 || 304 === t, r && (x = Z(h, k, r)), x = ee(h, x, k, u), 
                    u ? (h.ifModified && (w = k.getResponseHeader("Last-Modified"), w && (ge.lastModified[i] = w), 
                    (w = k.getResponseHeader("etag")) && (ge.etag[i] = w)), 204 === t || "HEAD" === h.type ? C = "nocontent" : 304 === t ? C = "notmodified" : (C = x.state, 
                    d = x.data, p = x.error, u = !p)) : (p = C, !t && C || (C = "error", t < 0 && (t = 0))), 
                    k.status = t, k.statusText = (n || C) + "", u ? m.resolveWith(g, [ d, C, k ]) : m.rejectWith(g, [ k, C, p ]), 
                    k.statusCode(b), b = void 0, f && v.trigger(u ? "ajaxSuccess" : "ajaxError", [ k, h, u ? d : p ]), 
                    y.fireWith(g, [ k, C ]), f && (v.trigger("ajaxComplete", [ k, h ]), --ge.active || ge.event.trigger("ajaxStop")));
                }
                "object" == typeof t && (n = t, t = void 0), n = n || {};
                var o, i, a, s, l, u, c, f, d, p, h = ge.ajaxSetup({}, n), g = h.context || h, v = h.context && (g.nodeType || g.jquery) ? ge(g) : ge.event, m = ge.Deferred(), y = ge.Callbacks("once memory"), b = h.statusCode || {}, x = {}, w = {}, C = "canceled", k = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (c) {
                            if (!s) for (s = {}; t = Pt.exec(a); ) s[t[1].toLowerCase()] = t[2];
                            t = s[e.toLowerCase()];
                        }
                        return null == t ? null : t;
                    },
                    getAllResponseHeaders: function() {
                        return c ? a : null;
                    },
                    setRequestHeader: function(e, t) {
                        return null == c && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e, x[e] = t), 
                        this;
                    },
                    overrideMimeType: function(e) {
                        return null == c && (h.mimeType = e), this;
                    },
                    statusCode: function(e) {
                        var t;
                        if (e) if (c) k.always(e[k.status]); else for (t in e) b[t] = [ b[t], e[t] ];
                        return this;
                    },
                    abort: function(e) {
                        var t = e || C;
                        return o && o.abort(t), r(0, t), this;
                    }
                };
                if (m.promise(k), h.url = ((t || h.url || Tt.href) + "").replace(/^\/\//, Tt.protocol + "//"), 
                h.type = n.method || n.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(De) || [ "" ], 
                null == h.crossDomain) {
                    u = ne.createElement("a");
                    try {
                        u.href = h.url, u.href = u.href, h.crossDomain = $t.protocol + "//" + $t.host != u.protocol + "//" + u.host;
                    } catch (e) {
                        h.crossDomain = !0;
                    }
                }
                if (h.data && h.processData && "string" != typeof h.data && (h.data = ge.param(h.data, h.traditional)), 
                Y(Ft, h, n, k), c) return k;
                f = ge.event && h.global, f && 0 == ge.active++ && ge.event.trigger("ajaxStart"), 
                h.type = h.type.toUpperCase(), h.hasContent = !Ot.test(h.type), i = h.url.replace(/#.*$/, ""), 
                h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(/%20/g, "+")) : (p = h.url.slice(i.length), 
                h.data && (i += (Et.test(i) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (i = i.replace(/([?&])_=[^&]*/, "$1"), 
                p = (Et.test(i) ? "&" : "?") + "_=" + St++ + p), h.url = i + p), h.ifModified && (ge.lastModified[i] && k.setRequestHeader("If-Modified-Since", ge.lastModified[i]), 
                ge.etag[i] && k.setRequestHeader("If-None-Match", ge.etag[i])), (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && k.setRequestHeader("Content-Type", h.contentType), 
                k.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + It + "; q=0.01" : "") : h.accepts["*"]);
                for (d in h.headers) k.setRequestHeader(d, h.headers[d]);
                if (h.beforeSend && (!1 === h.beforeSend.call(g, k, h) || c)) return k.abort();
                if (C = "abort", y.add(h.complete), k.done(h.success), k.fail(h.error), o = Y(Rt, h, n, k)) {
                    if (k.readyState = 1, f && v.trigger("ajaxSend", [ k, h ]), c) return k;
                    h.async && h.timeout > 0 && (l = e.setTimeout((function() {
                        k.abort("timeout");
                    }), h.timeout));
                    try {
                        c = !1, o.send(x, r);
                    } catch (e) {
                        if (c) throw e;
                        r(-1, e);
                    }
                } else r(-1, "No Transport");
                return k;
            },
            getJSON: function(e, t, n) {
                return ge.get(e, t, n, "json");
            },
            getScript: function(e, t) {
                return ge.get(e, void 0, t, "script");
            }
        }), ge.each([ "get", "post" ], (function(e, t) {
            ge[t] = function(e, n, r, o) {
                return ge.isFunction(n) && (o = o || r, r = n, n = void 0), ge.ajax(ge.extend({
                    url: e,
                    type: t,
                    dataType: o,
                    data: n,
                    success: r
                }, ge.isPlainObject(e) && e));
            };
        })), ge._evalUrl = function(e) {
            return ge.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            });
        }, ge.fn.extend({
            wrapAll: function(e) {
                var t;
                return this[0] && (ge.isFunction(e) && (e = e.call(this[0])), t = ge(e, this[0].ownerDocument).eq(0).clone(!0), 
                this[0].parentNode && t.insertBefore(this[0]), t.map((function() {
                    for (var e = this; e.firstElementChild; ) e = e.firstElementChild;
                    return e;
                })).append(this)), this;
            },
            wrapInner: function(e) {
                return ge.isFunction(e) ? this.each((function(t) {
                    ge(this).wrapInner(e.call(this, t));
                })) : this.each((function() {
                    var t = ge(this), n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e);
                }));
            },
            wrap: function(e) {
                var t = ge.isFunction(e);
                return this.each((function(n) {
                    ge(this).wrapAll(t ? e.call(this, n) : e);
                }));
            },
            unwrap: function(e) {
                return this.parent(e).not("body").each((function() {
                    ge(this).replaceWith(this.childNodes);
                })), this;
            }
        }), ge.expr.pseudos.hidden = function(e) {
            return !ge.expr.pseudos.visible(e);
        }, ge.expr.pseudos.visible = function(e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
        }, ge.ajaxSettings.xhr = function() {
            try {
                return new e.XMLHttpRequest;
            } catch (e) {}
        };
        var Wt = {
            0: 200,
            1223: 204
        }, _t = ge.ajaxSettings.xhr();
        pe.cors = !!_t && "withCredentials" in _t, pe.ajax = _t = !!_t, ge.ajaxTransport((function(t) {
            var n, r;
            if (pe.cors || _t && !t.crossDomain) return {
                send: function(o, i) {
                    var a, s = t.xhr();
                    if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields) for (a in t.xhrFields) s[a] = t.xhrFields[a];
                    t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
                    for (a in o) s.setRequestHeader(a, o[a]);
                    n = function(e) {
                        return function() {
                            n && (n = r = s.onload = s.onerror = s.onabort = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? i(0, "error") : i(s.status, s.statusText) : i(Wt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                binary: s.response
                            } : {
                                text: s.responseText
                            }, s.getAllResponseHeaders()));
                        };
                    }, s.onload = n(), r = s.onerror = n("error"), void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function() {
                        4 === s.readyState && e.setTimeout((function() {
                            n && r();
                        }));
                    }, n = n("abort");
                    try {
                        s.send(t.hasContent && t.data || null);
                    } catch (e) {
                        if (n) throw e;
                    }
                },
                abort: function() {
                    n && n();
                }
            };
        })), ge.ajaxPrefilter((function(e) {
            e.crossDomain && (e.contents.script = !1);
        })), ge.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return ge.globalEval(e), e;
                }
            }
        }), ge.ajaxPrefilter("script", (function(e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
        })), ge.ajaxTransport("script", (function(e) {
            if (e.crossDomain) {
                var t, n;
                return {
                    send: function(r, o) {
                        t = ge("<script>").prop({
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                            t.remove(), n = null, e && o("error" === e.type ? 404 : 200, e.type);
                        }), ne.head.appendChild(t[0]);
                    },
                    abort: function() {
                        n && n();
                    }
                };
            }
        }));
        var Vt = [], zt = /(=)\?(?=&|$)|\?\?/;
        ge.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = Vt.pop() || ge.expando + "_" + St++;
                return this[e] = !0, e;
            }
        }), ge.ajaxPrefilter("json jsonp", (function(t, n, r) {
            var o, i, a, s = !1 !== t.jsonp && (zt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && zt.test(t.data) && "data");
            if (s || "jsonp" === t.dataTypes[0]) return o = t.jsonpCallback = ge.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, 
            s ? t[s] = t[s].replace(zt, "$1" + o) : !1 !== t.jsonp && (t.url += (Et.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), 
            t.converters["script json"] = function() {
                return a || ge.error(o + " was not called"), a[0];
            }, t.dataTypes[0] = "json", i = e[o], e[o] = function() {
                a = arguments;
            }, r.always((function() {
                void 0 === i ? ge(e).removeProp(o) : e[o] = i, t[o] && (t.jsonpCallback = n.jsonpCallback, 
                Vt.push(o)), a && ge.isFunction(i) && i(a[0]), a = i = void 0;
            })), "script";
        })), pe.createHTMLDocument = function() {
            var e = ne.implementation.createHTMLDocument("").body;
            return e.innerHTML = "<form></form><form></form>", 2 === e.childNodes.length;
        }(), ge.parseHTML = function(e, t, n) {
            if ("string" != typeof e) return [];
            "boolean" == typeof t && (n = t, t = !1);
            var r, o, i;
            return t || (pe.createHTMLDocument ? (t = ne.implementation.createHTMLDocument(""), 
            r = t.createElement("base"), r.href = ne.location.href, t.head.appendChild(r)) : t = ne), 
            o = Te.exec(e), i = !n && [], o ? [ t.createElement(o[1]) ] : (o = b([ e ], t, i), 
            i && i.length && ge(i).remove(), ge.merge([], o.childNodes));
        }, ge.fn.load = function(e, t, n) {
            var r, o, i, a = this, s = e.indexOf(" ");
            return s > -1 && (r = G(e.slice(s)), e = e.slice(0, s)), ge.isFunction(t) ? (n = t, 
            t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && ge.ajax({
                url: e,
                type: o || "GET",
                dataType: "html",
                data: t
            }).done((function(e) {
                i = arguments, a.html(r ? ge("<div>").append(ge.parseHTML(e)).find(r) : e);
            })).always(n && function(e, t) {
                a.each((function() {
                    n.apply(this, i || [ e.responseText, t, e ]);
                }));
            }), this;
        }, ge.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], (function(e, t) {
            ge.fn[t] = function(e) {
                return this.on(t, e);
            };
        })), ge.expr.pseudos.animated = function(e) {
            return ge.grep(ge.timers, (function(t) {
                return e === t.elem;
            })).length;
        }, ge.offset = {
            setOffset: function(e, t, n) {
                var r, o, i, a, s, l, u, c = ge.css(e, "position"), f = ge(e), d = {};
                "static" === c && (e.style.position = "relative"), s = f.offset(), i = ge.css(e, "top"), 
                l = ge.css(e, "left"), u = ("absolute" === c || "fixed" === c) && (i + l).indexOf("auto") > -1, 
                u ? (r = f.position(), a = r.top, o = r.left) : (a = parseFloat(i) || 0, o = parseFloat(l) || 0), 
                ge.isFunction(t) && (t = t.call(e, n, ge.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), 
                null != t.left && (d.left = t.left - s.left + o), "using" in t ? t.using.call(e, d) : f.css(d);
            }
        }, ge.fn.extend({
            offset: function(e) {
                if (arguments.length) return void 0 === e ? this : this.each((function(t) {
                    ge.offset.setOffset(this, e, t);
                }));
                var t, n, r, o, i = this[0];
                return i ? i.getClientRects().length ? (r = i.getBoundingClientRect(), t = i.ownerDocument, 
                n = t.documentElement, o = t.defaultView, {
                    top: r.top + o.pageYOffset - n.clientTop,
                    left: r.left + o.pageXOffset - n.clientLeft
                }) : {
                    top: 0,
                    left: 0
                } : void 0;
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = this[0], r = {
                        top: 0,
                        left: 0
                    };
                    return "fixed" === ge.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), 
                    t = this.offset(), o(e[0], "html") || (r = e.offset()), r = {
                        top: r.top + ge.css(e[0], "borderTopWidth", !0),
                        left: r.left + ge.css(e[0], "borderLeftWidth", !0)
                    }), {
                        top: t.top - r.top - ge.css(n, "marginTop", !0),
                        left: t.left - r.left - ge.css(n, "marginLeft", !0)
                    };
                }
            },
            offsetParent: function() {
                return this.map((function() {
                    for (var e = this.offsetParent; e && "static" === ge.css(e, "position"); ) e = e.offsetParent;
                    return e || Qe;
                }));
            }
        }), ge.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, (function(e, t) {
            var n = "pageYOffset" === t;
            ge.fn[e] = function(r) {
                return Me(this, (function(e, r, o) {
                    var i;
                    return ge.isWindow(e) ? i = e : 9 === e.nodeType && (i = e.defaultView), void 0 === o ? i ? i[t] : e[r] : void (i ? i.scrollTo(n ? i.pageXOffset : o, n ? o : i.pageYOffset) : e[r] = o);
                }), e, r, arguments.length);
            };
        })), ge.each([ "top", "left" ], (function(e, t) {
            ge.cssHooks[t] = L(pe.pixelPosition, (function(e, n) {
                if (n) return n = q(e, t), at.test(n) ? ge(e).position()[t] + "px" : n;
            }));
        })), ge.each({
            Height: "height",
            Width: "width"
        }, (function(e, t) {
            ge.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, (function(n, r) {
                ge.fn[r] = function(o, i) {
                    var a = arguments.length && (n || "boolean" != typeof o), s = n || (!0 === o || !0 === i ? "margin" : "border");
                    return Me(this, (function(t, n, o) {
                        var i;
                        return ge.isWindow(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, 
                        Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === o ? ge.css(t, n, s) : ge.style(t, n, o, s);
                    }), t, a ? o : void 0, a);
                };
            }));
        })), ge.fn.extend({
            bind: function(e, t, n) {
                return this.on(e, null, t, n);
            },
            unbind: function(e, t) {
                return this.off(e, null, t);
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r);
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
            }
        }), ge.holdReady = function(e) {
            e ? ge.readyWait++ : ge.ready(!0);
        }, ge.isArray = Array.isArray, ge.parseJSON = JSON.parse, ge.nodeName = o, "function" == typeof define && define.amd && define("jquery", [], (function() {
            return ge;
        }));
        var Ut = e.jQuery, Gt = e.$;
        return ge.noConflict = function(t) {
            return e.$ === ge && (e.$ = Gt), t && e.jQuery === ge && (e.jQuery = Ut), ge;
        }, t || (e.jQuery = e.$ = ge), ge;
    })), function(e) {
        e.fn.niceSelect = function(t) {
            function n(t) {
                t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class") || "").addClass(t.attr("disabled") ? "disabled" : "").attr("tabindex", t.attr("disabled") ? null : "0").html('<span class="current"></span><ul class="list"></ul>'));
                var n = t.next(), r = t.find("option"), o = t.find("option:selected");
                n.find(".current").html(o.data("display") || o.text()), r.each((function(t) {
                    var r = e(this), o = r.data("display");
                    n.find("ul").append(e("<li></li>").attr("data-value", r.val()).attr("data-display", o || null).addClass("option" + (r.is(":selected") ? " selected" : "") + (r.is(":disabled") ? " disabled" : "")).html(r.text()));
                }));
            }
            if ("string" == typeof t) return "update" == t ? this.each((function() {
                var t = e(this), r = e(this).next(".nice-select"), o = r.hasClass("open");
                r.length && (r.remove(), n(t), o && t.next().trigger("click"));
            })) : "destroy" == t ? (this.each((function() {
                var t = e(this), n = e(this).next(".nice-select");
                n.length && (n.remove(), t.css("display", ""));
            })), 0 == e(".nice-select").length && e(document).off(".nice_select")) : console.log('Method "' + t + '" does not exist.'), 
            this;
            this.hide(), this.each((function() {
                var t = e(this);
                t.next().hasClass("nice-select") || n(t);
            })), e(document).off(".nice_select"), e(document).on("click.nice_select", ".nice-select", (function(t) {
                var n = e(this);
                e(".nice-select").not(n).removeClass("open"), n.toggleClass("open"), n.hasClass("open") ? (n.find(".option"), 
                n.find(".focus").removeClass("focus"), n.find(".selected").addClass("focus")) : n.focus();
            })), e(document).on("click.nice_select", (function(t) {
                0 === e(t.target).closest(".nice-select").length && e(".nice-select").removeClass("open").find(".option");
            })), e(document).on("click.nice_select", ".nice-select .option:not(.disabled)", (function(t) {
                var n = e(this), r = n.closest(".nice-select");
                r.find(".selected").removeClass("selected"), n.addClass("selected");
                var o = n.data("display") || n.text();
                r.find(".current").text(o), r.prev("select").val(n.data("value")).trigger("change");
            })), e(document).on("keydown.nice_select", ".nice-select", (function(t) {
                var n = e(this), r = e(n.find(".focus") || n.find(".list .option.selected"));
                if (32 == t.keyCode || 13 == t.keyCode) return n.hasClass("open") ? r.trigger("click") : n.trigger("click"), 
                !1;
                if (40 == t.keyCode) {
                    if (n.hasClass("open")) {
                        var o = r.nextAll(".option:not(.disabled)").first();
                        o.length > 0 && (n.find(".focus").removeClass("focus"), o.addClass("focus"));
                    } else n.trigger("click");
                    return !1;
                }
                if (38 == t.keyCode) {
                    if (n.hasClass("open")) {
                        var i = r.prevAll(".option:not(.disabled)").first();
                        i.length > 0 && (n.find(".focus").removeClass("focus"), i.addClass("focus"));
                    } else n.trigger("click");
                    return !1;
                }
                if (27 == t.keyCode) n.hasClass("open") && n.trigger("click"); else if (9 == t.keyCode && n.hasClass("open")) return !1;
            }));
            var r = document.createElement("a").style;
            return r.cssText = "pointer-events:auto", "auto" !== r.pointerEvents && e("html").addClass("no-csspointerevents"), 
            this;
        };
    }(jQuery), !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Sweetalert2 = t();
    }(void 0, (function() {
        "use strict";
        var e = {
            title: "",
            titleText: "",
            text: "",
            html: "",
            type: null,
            customClass: "",
            target: "body",
            animation: !0,
            allowOutsideClick: !0,
            allowEscapeKey: !0,
            allowEnterKey: !0,
            showConfirmButton: !0,
            showCancelButton: !1,
            preConfirm: null,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            confirmButtonClass: null,
            cancelButtonText: "Cancel",
            cancelButtonColor: "#aaa",
            cancelButtonClass: null,
            buttonsStyling: !0,
            reverseButtons: !1,
            focusCancel: !1,
            showCloseButton: !1,
            showLoaderOnConfirm: !1,
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            imageClass: null,
            timer: null,
            width: 500,
            padding: 20,
            background: "#fff",
            input: null,
            inputPlaceholder: "",
            inputValue: "",
            inputOptions: {},
            inputAutoTrim: !0,
            inputClass: null,
            inputAttributes: {},
            inputValidator: null,
            progressSteps: [],
            currentProgressStep: null,
            progressStepsDistance: "40px",
            onOpen: null,
            onClose: null,
            useRejections: !0
        }, t = function(e) {
            var t = {};
            for (var n in e) t[e[n]] = "swal2-" + e[n];
            return t;
        }, n = t([ "container", "shown", "iosfix", "modal", "overlay", "fade", "show", "hide", "noanimation", "close", "title", "content", "buttonswrapper", "confirm", "cancel", "icon", "image", "input", "file", "range", "select", "radio", "checkbox", "textarea", "inputerror", "validationerror", "progresssteps", "activeprogressstep", "progresscircle", "progressline", "loading", "styled" ]), r = t([ "success", "warning", "info", "question", "error" ]), o = function(e, t) {
            (e = String(e).replace(/[^0-9a-f]/gi, "")).length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), 
            t = t || 0;
            for (var n = "#", r = 0; r < 3; r++) {
                var o = parseInt(e.substr(2 * r, 2), 16);
                n += ("00" + (o = Math.round(Math.min(Math.max(0, o + o * t), 255)).toString(16))).substr(o.length);
            }
            return n;
        }, i = function(e) {
            var t = [];
            for (var n in e) -1 === t.indexOf(e[n]) && t.push(e[n]);
            return t;
        }, a = {
            previousWindowKeyDown: null,
            previousActiveElement: null,
            previousBodyPadding: null
        }, s = function(e) {
            if ("undefined" == typeof document) return void console.error("SweetAlert2 requires document to initialize");
            var t = document.createElement("div");
            t.className = n.container, t.innerHTML = l;
            var r = document.querySelector(e.target);
            r || (console.warn("SweetAlert2: Can't find the target \"" + e.target + '"'), r = document.body), 
            r.appendChild(t);
            var o = c(), i = A(o, n.input), a = A(o, n.file), s = o.querySelector("." + n.range + " input"), u = o.querySelector("." + n.range + " output"), f = A(o, n.select), d = o.querySelector("." + n.checkbox + " input"), p = A(o, n.textarea);
            return i.oninput = function() {
                K.resetValidationError();
            }, i.onkeydown = function(t) {
                setTimeout((function() {
                    13 === t.keyCode && e.allowEnterKey && (t.stopPropagation(), K.clickConfirm());
                }), 0);
            }, a.onchange = function() {
                K.resetValidationError();
            }, s.oninput = function() {
                K.resetValidationError(), u.value = s.value;
            }, s.onchange = function() {
                K.resetValidationError(), s.previousSibling.value = s.value;
            }, f.onchange = function() {
                K.resetValidationError();
            }, d.onchange = function() {
                K.resetValidationError();
            }, p.oninput = function() {
                K.resetValidationError();
            }, o;
        }, l = ('\n <div role="dialog" aria-labelledby="' + n.title + '" aria-describedby="' + n.content + '" class="' + n.modal + '" tabindex="-1">\n   <ul class="' + n.progresssteps + '"></ul>\n   <div class="' + n.icon + " " + r.error + '">\n     <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n   </div>\n   <div class="' + n.icon + " " + r.question + '">?</div>\n   <div class="' + n.icon + " " + r.warning + '">!</div>\n   <div class="' + n.icon + " " + r.info + '">i</div>\n   <div class="' + n.icon + " " + r.success + '">\n     <div class="swal2-success-circular-line-left"></div>\n     <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n     <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n     <div class="swal2-success-circular-line-right"></div>\n   </div>\n   <img class="' + n.image + '">\n   <h2 class="' + n.title + '" id="' + n.title + '"></h2>\n   <div id="' + n.content + '" class="' + n.content + '"></div>\n   <input class="' + n.input + '">\n   <input type="file" class="' + n.file + '">\n   <div class="' + n.range + '">\n     <output></output>\n     <input type="range">\n   </div>\n   <select class="' + n.select + '"></select>\n   <div class="' + n.radio + '"></div>\n   <label for="' + n.checkbox + '" class="' + n.checkbox + '">\n     <input type="checkbox">\n   </label>\n   <textarea class="' + n.textarea + '"></textarea>\n   <div class="' + n.validationerror + '"></div>\n   <div class="' + n.buttonswrapper + '">\n     <button type="button" class="' + n.confirm + '">OK</button>\n     <button type="button" class="' + n.cancel + '">Cancel</button>\n   </div>\n   <button type="button" class="' + n.close + '" aria-label="Close this dialog">&times;</button>\n </div>\n').replace(/(^|\n)\s*/g, ""), u = function() {
            return document.body.querySelector("." + n.container);
        }, c = function() {
            return u() ? u().querySelector("." + n.modal) : null;
        }, f = function() {
            return c().querySelectorAll("." + n.icon);
        }, d = function(e) {
            return u() ? u().querySelector("." + e) : null;
        }, p = function() {
            return d(n.title);
        }, h = function() {
            return d(n.content);
        }, g = function() {
            return d(n.image);
        }, v = function() {
            return d(n.buttonswrapper);
        }, m = function() {
            return d(n.progresssteps);
        }, y = function() {
            return d(n.validationerror);
        }, b = function() {
            return d(n.confirm);
        }, x = function() {
            return d(n.cancel);
        }, w = function() {
            return d(n.close);
        }, C = function(e) {
            var t = [ b(), x() ];
            e && t.reverse();
            var n = t.concat(Array.prototype.slice.call(c().querySelectorAll('button, input:not([type=hidden]), textarea, select, a, *[tabindex]:not([tabindex="-1"])')));
            return i(n);
        }, k = function(e, t) {
            return !!e.classList && e.classList.contains(t);
        }, T = function(e) {
            if (e.focus(), "file" !== e.type) {
                var t = e.value;
                e.value = "", e.value = t;
            }
        }, S = function(e, t) {
            e && t && t.split(/\s+/).filter(Boolean).forEach((function(t) {
                e.classList.add(t);
            }));
        }, E = function(e, t) {
            e && t && t.split(/\s+/).filter(Boolean).forEach((function(t) {
                e.classList.remove(t);
            }));
        }, A = function(e, t) {
            for (var n = 0; n < e.childNodes.length; n++) if (k(e.childNodes[n], t)) return e.childNodes[n];
        }, j = function(e, t) {
            t || (t = "block"), e.style.opacity = "", e.style.display = t;
        }, N = function(e) {
            e.style.opacity = "", e.style.display = "none";
        }, D = function(e) {
            for (;e.firstChild; ) e.removeChild(e.firstChild);
        }, q = function(e) {
            return e.offsetWidth || e.offsetHeight || e.getClientRects().length;
        }, L = function(e, t) {
            e.style.removeProperty ? e.style.removeProperty(t) : e.style.removeAttribute(t);
        }, M = function(e) {
            if (!q(e)) return !1;
            if ("function" == typeof MouseEvent) {
                var t = new MouseEvent("click", {
                    view: window,
                    bubbles: !1,
                    cancelable: !0
                });
                e.dispatchEvent(t);
            } else if (document.createEvent) {
                var n = document.createEvent("MouseEvents");
                n.initEvent("click", !1, !1), e.dispatchEvent(n);
            } else document.createEventObject ? e.fireEvent("onclick") : "function" == typeof e.onclick && e.onclick();
        }, P = function() {
            var e = document.createElement("div"), t = {
                WebkitAnimation: "webkitAnimationEnd",
                OAnimation: "oAnimationEnd oanimationend",
                msAnimation: "MSAnimationEnd",
                animation: "animationend"
            };
            for (var n in t) if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
            return !1;
        }(), H = function() {
            if (window.onkeydown = a.previousWindowKeyDown, a.previousActiveElement && a.previousActiveElement.focus) {
                var e = window.scrollX, t = window.scrollY;
                a.previousActiveElement.focus(), e && t && window.scrollTo(e, t);
            }
        }, O = function() {
            if ("ontouchstart" in window || navigator.msMaxTouchPoints) return 0;
            var e = document.createElement("div");
            e.style.width = "50px", e.style.height = "50px", e.style.overflow = "scroll", document.body.appendChild(e);
            var t = e.offsetWidth - e.clientWidth;
            return document.body.removeChild(e), t;
        }, B = function(e, t) {
            var n = void 0;
            return function() {
                var r = function() {
                    n = null, e();
                };
                clearTimeout(n), n = setTimeout(r, t);
            };
        }, F = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        }, R = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
        }, I = R({}, e), W = [], _ = void 0, V = function(t) {
            var o = c() || s(t);
            for (var i in t) e.hasOwnProperty(i) || "extraParams" === i || console.warn('SweetAlert2: Unknown parameter "' + i + '"');
            o.style.width = "number" == typeof t.width ? t.width + "px" : t.width, o.style.padding = t.padding + "px", 
            o.style.background = t.background;
            for (var a = o.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"), l = 0; l < a.length; l++) a[l].style.background = t.background;
            var u = p(), d = h(), y = v(), C = b(), k = x(), T = w();
            if (t.titleText ? u.innerText = t.titleText : u.innerHTML = t.title.split("\n").join("<br>"), 
            t.text || t.html) {
                if ("object" === F(t.html)) if (d.innerHTML = "", 0 in t.html) for (var A = 0; A in t.html; A++) d.appendChild(t.html[A].cloneNode(!0)); else d.appendChild(t.html.cloneNode(!0)); else t.html ? d.innerHTML = t.html : t.text && (d.textContent = t.text);
                j(d);
            } else N(d);
            t.showCloseButton ? j(T) : N(T), o.className = n.modal, t.customClass && S(o, t.customClass);
            var q = m(), M = parseInt(null === t.currentProgressStep ? K.getQueueStep() : t.currentProgressStep, 10);
            t.progressSteps.length ? (j(q), D(q), M >= t.progressSteps.length && console.warn("SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), 
            t.progressSteps.forEach((function(e, r) {
                var o = document.createElement("li");
                if (S(o, n.progresscircle), o.innerHTML = e, r === M && S(o, n.activeprogressstep), 
                q.appendChild(o), r !== t.progressSteps.length - 1) {
                    var i = document.createElement("li");
                    S(i, n.progressline), i.style.width = t.progressStepsDistance, q.appendChild(i);
                }
            }))) : N(q);
            for (var P = f(), H = 0; H < P.length; H++) N(P[H]);
            if (t.type) {
                var O = !1;
                for (var B in r) if (t.type === B) {
                    O = !0;
                    break;
                }
                if (!O) return console.error("SweetAlert2: Unknown alert type: " + t.type), !1;
                var R = o.querySelector("." + n.icon + "." + r[t.type]);
                if (j(R), t.animation) switch (t.type) {
                  case "success":
                    S(R, "swal2-animate-success-icon"), S(R.querySelector(".swal2-success-line-tip"), "swal2-animate-success-line-tip"), 
                    S(R.querySelector(".swal2-success-line-long"), "swal2-animate-success-line-long");
                    break;

                  case "error":
                    S(R, "swal2-animate-error-icon"), S(R.querySelector(".swal2-x-mark"), "swal2-animate-x-mark");
                }
            }
            var I = g();
            t.imageUrl ? (I.setAttribute("src", t.imageUrl), j(I), t.imageWidth ? I.setAttribute("width", t.imageWidth) : I.removeAttribute("width"), 
            t.imageHeight ? I.setAttribute("height", t.imageHeight) : I.removeAttribute("height"), 
            I.className = n.image, t.imageClass && S(I, t.imageClass)) : N(I), t.showCancelButton ? k.style.display = "inline-block" : N(k), 
            t.showConfirmButton ? L(C, "display") : N(C), t.showConfirmButton || t.showCancelButton ? j(y) : N(y), 
            C.innerHTML = t.confirmButtonText, k.innerHTML = t.cancelButtonText, t.buttonsStyling && (C.style.backgroundColor = t.confirmButtonColor, 
            k.style.backgroundColor = t.cancelButtonColor), C.className = n.confirm, S(C, t.confirmButtonClass), 
            k.className = n.cancel, S(k, t.cancelButtonClass), t.buttonsStyling ? (S(C, n.styled), 
            S(k, n.styled)) : (E(C, n.styled), E(k, n.styled), C.style.backgroundColor = C.style.borderLeftColor = C.style.borderRightColor = "", 
            k.style.backgroundColor = k.style.borderLeftColor = k.style.borderRightColor = ""), 
            !0 === t.animation ? E(o, n.noanimation) : S(o, n.noanimation);
        }, z = function(e, t) {
            var r = u(), o = c();
            e ? (S(o, n.show), S(r, n.fade), E(o, n.hide)) : E(o, n.fade), j(o), r.style.overflowY = "hidden", 
            P && !k(o, n.noanimation) ? o.addEventListener(P, (function e() {
                o.removeEventListener(P, e), r.style.overflowY = "auto";
            })) : r.style.overflowY = "auto", S(document.documentElement, n.shown), S(document.body, n.shown), 
            S(r, n.shown), U(), X(), a.previousActiveElement = document.activeElement, null !== t && "function" == typeof t && setTimeout((function() {
                t(o);
            }));
        }, U = function() {
            null === a.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (a.previousBodyPadding = document.body.style.paddingRight, 
            document.body.style.paddingRight = O() + "px");
        }, G = function() {
            null !== a.previousBodyPadding && (document.body.style.paddingRight = a.previousBodyPadding, 
            a.previousBodyPadding = null);
        }, X = function() {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !k(document.body, n.iosfix)) {
                var e = document.body.scrollTop;
                document.body.style.top = -1 * e + "px", S(document.body, n.iosfix);
            }
        }, $ = function() {
            if (k(document.body, n.iosfix)) {
                var e = parseInt(document.body.style.top, 10);
                E(document.body, n.iosfix), document.body.style.top = "", document.body.scrollTop = -1 * e;
            }
        }, K = function e() {
            for (var t = arguments.length, r = Array(t), i = 0; i < t; i++) r[i] = arguments[i];
            if (void 0 === r[0]) return console.error("SweetAlert2 expects at least 1 attribute!"), 
            !1;
            var s = R({}, I);
            switch (F(r[0])) {
              case "string":
                s.title = r[0], s.html = r[1], s.type = r[2];
                break;

              case "object":
                R(s, r[0]), s.extraParams = r[0].extraParams, "email" === s.input && null === s.inputValidator && (s.inputValidator = function(e) {
                    return new Promise((function(t, n) {
                        /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(e) ? t() : n("Invalid email address");
                    }));
                }), "url" === s.input && null === s.inputValidator && (s.inputValidator = function(e) {
                    return new Promise((function(t, n) {
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(e) ? t() : n("Invalid URL");
                    }));
                });
                break;

              default:
                return console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + F(r[0])), 
                !1;
            }
            V(s);
            var l = u(), f = c();
            return new Promise((function(t, r) {
                s.timer && (f.timeout = setTimeout((function() {
                    e.closeModal(s.onClose), s.useRejections ? r("timer") : t({
                        dismiss: "timer"
                    });
                }), s.timer));
                var i = function(e) {
                    if (!(e = e || s.input)) return null;
                    switch (e) {
                      case "select":
                      case "textarea":
                      case "file":
                        return A(f, n[e]);

                      case "checkbox":
                        return f.querySelector("." + n.checkbox + " input");

                      case "radio":
                        return f.querySelector("." + n.radio + " input:checked") || f.querySelector("." + n.radio + " input:first-child");

                      case "range":
                        return f.querySelector("." + n.range + " input");

                      default:
                        return A(f, n.input);
                    }
                }, d = function() {
                    var e = i();
                    if (!e) return null;
                    switch (s.input) {
                      case "checkbox":
                        return e.checked ? 1 : 0;

                      case "radio":
                        return e.checked ? e.value : null;

                      case "file":
                        return e.files.length ? e.files[0] : null;

                      default:
                        return s.inputAutoTrim ? e.value.trim() : e.value;
                    }
                };
                s.input && setTimeout((function() {
                    var e = i();
                    e && T(e);
                }), 0);
                for (var k = function(n) {
                    s.showLoaderOnConfirm && e.showLoading(), s.preConfirm ? s.preConfirm(n, s.extraParams).then((function(r) {
                        e.closeModal(s.onClose), t(r || n);
                    }), (function(t) {
                        e.hideLoading(), t && e.showValidationError(t);
                    })) : (e.closeModal(s.onClose), t(s.useRejections ? n : {
                        value: n
                    }));
                }, D = function(n) {
                    var i = n || window.event, a = i.target || i.srcElement, l = b(), u = x(), c = l && (l === a || l.contains(a)), f = u && (u === a || u.contains(a));
                    switch (i.type) {
                      case "mouseover":
                      case "mouseup":
                        s.buttonsStyling && (c ? l.style.backgroundColor = o(s.confirmButtonColor, -.1) : f && (u.style.backgroundColor = o(s.cancelButtonColor, -.1)));
                        break;

                      case "mouseout":
                        s.buttonsStyling && (c ? l.style.backgroundColor = s.confirmButtonColor : f && (u.style.backgroundColor = s.cancelButtonColor));
                        break;

                      case "mousedown":
                        s.buttonsStyling && (c ? l.style.backgroundColor = o(s.confirmButtonColor, -.2) : f && (u.style.backgroundColor = o(s.cancelButtonColor, -.2)));
                        break;

                      case "click":
                        if (c && e.isVisible()) if (e.disableButtons(), s.input) {
                            var p = d();
                            s.inputValidator ? (e.disableInput(), s.inputValidator(p, s.extraParams).then((function() {
                                e.enableButtons(), e.enableInput(), k(p);
                            }), (function(t) {
                                e.enableButtons(), e.enableInput(), t && e.showValidationError(t);
                            }))) : k(p);
                        } else k(!0); else f && e.isVisible() && (e.disableButtons(), e.closeModal(s.onClose), 
                        s.useRejections ? r("cancel") : t({
                            dismiss: "cancel"
                        }));
                    }
                }, L = f.querySelectorAll("button"), P = 0; P < L.length; P++) L[P].onclick = D, 
                L[P].onmouseover = D, L[P].onmouseout = D, L[P].onmousedown = D;
                w().onclick = function() {
                    e.closeModal(s.onClose), s.useRejections ? r("close") : t({
                        dismiss: "close"
                    });
                }, l.onclick = function(n) {
                    n.target === l && s.allowOutsideClick && (e.closeModal(s.onClose), s.useRejections ? r("overlay") : t({
                        dismiss: "overlay"
                    }));
                };
                var H = v(), O = b(), R = x();
                s.reverseButtons ? O.parentNode.insertBefore(R, O) : O.parentNode.insertBefore(O, R);
                var I = function(e, t) {
                    for (var n = C(s.focusCancel), r = 0; r < n.length; r++) {
                        (e += t) === n.length ? e = 0 : -1 === e && (e = n.length - 1);
                        var o = n[e];
                        if (q(o)) return o.focus();
                    }
                }, W = function(n) {
                    var o = n || window.event, i = o.keyCode || o.which;
                    if (-1 !== [ 9, 13, 32, 27, 37, 38, 39, 40 ].indexOf(i)) {
                        for (var a = o.target || o.srcElement, l = C(s.focusCancel), u = -1, c = 0; c < l.length; c++) if (a === l[c]) {
                            u = c;
                            break;
                        }
                        9 === i ? (o.shiftKey ? I(u, -1) : I(u, 1), o.stopPropagation(), o.preventDefault()) : 37 === i || 38 === i || 39 === i || 40 === i ? document.activeElement === O && q(R) ? R.focus() : document.activeElement === R && q(O) && O.focus() : 13 === i || 32 === i ? -1 === u && s.allowEnterKey && (M(s.focusCancel ? R : O), 
                        o.stopPropagation(), o.preventDefault()) : 27 === i && !0 === s.allowEscapeKey && (e.closeModal(s.onClose), 
                        s.useRejections ? r("esc") : t({
                            dismiss: "esc"
                        }));
                    }
                };
                window.onkeydown && window.onkeydown.toString() === W.toString() || (a.previousWindowKeyDown = window.onkeydown, 
                window.onkeydown = W), s.buttonsStyling && (O.style.borderLeftColor = s.confirmButtonColor, 
                O.style.borderRightColor = s.confirmButtonColor), e.hideLoading = e.disableLoading = function() {
                    s.showConfirmButton || (N(O), s.showCancelButton || N(v())), E(H, n.loading), E(f, n.loading), 
                    O.disabled = !1, R.disabled = !1;
                }, e.getTitle = function() {
                    return p();
                }, e.getContent = function() {
                    return h();
                }, e.getInput = function() {
                    return i();
                }, e.getImage = function() {
                    return g();
                }, e.getButtonsWrapper = function() {
                    return v();
                }, e.getConfirmButton = function() {
                    return b();
                }, e.getCancelButton = function() {
                    return x();
                }, e.enableButtons = function() {
                    O.disabled = !1, R.disabled = !1;
                }, e.disableButtons = function() {
                    O.disabled = !0, R.disabled = !0;
                }, e.enableConfirmButton = function() {
                    O.disabled = !1;
                }, e.disableConfirmButton = function() {
                    O.disabled = !0;
                }, e.enableInput = function() {
                    var e = i();
                    if (!e) return !1;
                    if ("radio" === e.type) for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !1; else e.disabled = !1;
                }, e.disableInput = function() {
                    var e = i();
                    if (!e) return !1;
                    if (e && "radio" === e.type) for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !0; else e.disabled = !0;
                }, e.recalculateHeight = B((function() {
                    var e = c();
                    if (e) {
                        var t = e.style.display;
                        e.style.minHeight = "", j(e), e.style.minHeight = e.scrollHeight + 1 + "px", e.style.display = t;
                    }
                }), 50), e.showValidationError = function(e) {
                    var t = y();
                    t.innerHTML = e, j(t);
                    var r = i();
                    r && (T(r), S(r, n.inputerror));
                }, e.resetValidationError = function() {
                    var t = y();
                    N(t), e.recalculateHeight();
                    var r = i();
                    r && E(r, n.inputerror);
                }, e.getProgressSteps = function() {
                    return s.progressSteps;
                }, e.setProgressSteps = function(e) {
                    s.progressSteps = e, V(s);
                }, e.showProgressSteps = function() {
                    j(m());
                }, e.hideProgressSteps = function() {
                    N(m());
                }, e.enableButtons(), e.hideLoading(), e.resetValidationError();
                for (var U = [ "input", "file", "range", "select", "radio", "checkbox", "textarea" ], G = void 0, X = 0; X < U.length; X++) {
                    var $ = n[U[X]], K = A(f, $);
                    if (G = i(U[X])) {
                        for (var Q in G.attributes) if (G.attributes.hasOwnProperty(Q)) {
                            var Y = G.attributes[Q].name;
                            "type" !== Y && "value" !== Y && G.removeAttribute(Y);
                        }
                        for (var J in s.inputAttributes) G.setAttribute(J, s.inputAttributes[J]);
                    }
                    K.className = $, s.inputClass && S(K, s.inputClass), N(K);
                }
                var Z = void 0;
                switch (s.input) {
                  case "text":
                  case "email":
                  case "password":
                  case "number":
                  case "tel":
                  case "url":
                    (G = A(f, n.input)).value = s.inputValue, G.placeholder = s.inputPlaceholder, G.type = s.input, 
                    j(G);
                    break;

                  case "file":
                    (G = A(f, n.file)).placeholder = s.inputPlaceholder, G.type = s.input, j(G);
                    break;

                  case "range":
                    var ee = A(f, n.range), te = ee.querySelector("input"), ne = ee.querySelector("output");
                    te.value = s.inputValue, te.type = s.input, ne.value = s.inputValue, j(ee);
                    break;

                  case "select":
                    var re = A(f, n.select);
                    if (re.innerHTML = "", s.inputPlaceholder) {
                        var oe = document.createElement("option");
                        oe.innerHTML = s.inputPlaceholder, oe.value = "", oe.disabled = !0, oe.selected = !0, 
                        re.appendChild(oe);
                    }
                    Z = function(e) {
                        for (var t in e) {
                            var n = document.createElement("option");
                            n.value = t, n.innerHTML = e[t], s.inputValue === t && (n.selected = !0), re.appendChild(n);
                        }
                        j(re), re.focus();
                    };
                    break;

                  case "radio":
                    var ie = A(f, n.radio);
                    ie.innerHTML = "", Z = function(e) {
                        for (var t in e) {
                            var r = document.createElement("input"), o = document.createElement("label"), i = document.createElement("span");
                            r.type = "radio", r.name = n.radio, r.value = t, s.inputValue === t && (r.checked = !0), 
                            i.innerHTML = e[t], o.appendChild(r), o.appendChild(i), o.for = r.id, ie.appendChild(o);
                        }
                        j(ie);
                        var a = ie.querySelectorAll("input");
                        a.length && a[0].focus();
                    };
                    break;

                  case "checkbox":
                    var ae = A(f, n.checkbox), se = i("checkbox");
                    se.type = "checkbox", se.value = 1, se.id = n.checkbox, se.checked = Boolean(s.inputValue);
                    var le = ae.getElementsByTagName("span");
                    le.length && ae.removeChild(le[0]), (le = document.createElement("span")).innerHTML = s.inputPlaceholder, 
                    ae.appendChild(le), j(ae);
                    break;

                  case "textarea":
                    var ue = A(f, n.textarea);
                    ue.value = s.inputValue, ue.placeholder = s.inputPlaceholder, j(ue);
                    break;

                  case null:
                    break;

                  default:
                    console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' + s.input + '"');
                }
                "select" !== s.input && "radio" !== s.input || (s.inputOptions instanceof Promise ? (e.showLoading(), 
                s.inputOptions.then((function(t) {
                    e.hideLoading(), Z(t);
                }))) : "object" === F(s.inputOptions) ? Z(s.inputOptions) : console.error("SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " + F(s.inputOptions))), 
                z(s.animation, s.onOpen), s.allowEnterKey ? I(-1, 1) : document.activeElement && document.activeElement.blur(), 
                u().scrollTop = 0, "undefined" == typeof MutationObserver || _ || (_ = new MutationObserver(e.recalculateHeight)).observe(f, {
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                });
            }));
        };
        return K.isVisible = function() {
            return !!c();
        }, K.queue = function(e) {
            W = e;
            var t = function() {
                W = [], document.body.removeAttribute("data-swal2-queue-step");
            }, n = [];
            return new Promise((function(e, r) {
                !function o(i, a) {
                    i < W.length ? (document.body.setAttribute("data-swal2-queue-step", i), K(W[i]).then((function(e) {
                        n.push(e), o(i + 1, a);
                    }), (function(e) {
                        t(), r(e);
                    }))) : (t(), e(n));
                }(0);
            }));
        }, K.getQueueStep = function() {
            return document.body.getAttribute("data-swal2-queue-step");
        }, K.insertQueueStep = function(e, t) {
            return t && t < W.length ? W.splice(t, 0, e) : W.push(e);
        }, K.deleteQueueStep = function(e) {
            void 0 !== W[e] && W.splice(e, 1);
        }, K.close = K.closeModal = function(e) {
            var t = u(), r = c();
            if (r) {
                E(r, n.show), S(r, n.hide), clearTimeout(r.timeout), H();
                var o = function() {
                    t.parentNode && t.parentNode.removeChild(t), E(document.documentElement, n.shown), 
                    E(document.body, n.shown), G(), $();
                };
                P && !k(r, n.noanimation) ? r.addEventListener(P, (function e() {
                    r.removeEventListener(P, e), k(r, n.hide) && o();
                })) : o(), null !== e && "function" == typeof e && setTimeout((function() {
                    e(r);
                }));
            }
        }, K.clickConfirm = function() {
            return b().click();
        }, K.clickCancel = function() {
            return x().click();
        }, K.showLoading = K.enableLoading = function() {
            var e = c();
            e || K("");
            var t = v(), r = b(), o = x();
            j(t), j(r, "inline-block"), S(t, n.loading), S(e, n.loading), r.disabled = !0, o.disabled = !0;
        }, K.setDefaults = function(t) {
            if (!t || "object" !== (void 0 === t ? "undefined" : F(t))) return console.error("SweetAlert2: the argument for setDefaults() is required and has to be a object");
            for (var n in t) e.hasOwnProperty(n) || "extraParams" === n || (console.warn('SweetAlert2: Unknown parameter "' + n + '"'), 
            delete t[n]);
            R(I, t);
        }, K.resetDefaults = function() {
            I = R({}, e);
        }, K.noop = function() {}, K.version = "6.6.4", K.default = K, K;
    })), window.Sweetalert2 && (window.sweetAlert = window.swal = window.Sweetalert2);
    var $jscomp = {
        scope: {},
        findInternal: function(e, t, n) {
            e instanceof String && (e = String(e));
            for (var r = e.length, o = 0; o < r; o++) {
                var i = e[o];
                if (t.call(n, i, o, e)) return {
                    i: o,
                    v: i
                };
            }
            return {
                i: -1,
                v: void 0
            };
        }
    };
    $jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(e, t, n) {
        if (n.get || n.set) throw new TypeError("ES3 does not support getters and setters.");
        e != Array.prototype && e != Object.prototype && (e[t] = n.value);
    }, $jscomp.getGlobal = function(e) {
        return "undefined" != typeof window && window === e ? e : "undefined" != typeof global && null != global ? global : e;
    }, $jscomp.global = $jscomp.getGlobal(void 0), $jscomp.polyfill = function(e, t, n, r) {
        if (t) {
            for (n = $jscomp.global, e = e.split("."), r = 0; r < e.length - 1; r++) {
                var o = e[r];
                o in n || (n[o] = {}), n = n[o];
            }
            e = e[e.length - 1], r = n[e], t = t(r), t != r && null != t && $jscomp.defineProperty(n, e, {
                configurable: !0,
                writable: !0,
                value: t
            });
        }
    }, $jscomp.polyfill("Array.prototype.find", (function(e) {
        return e || function(e, t) {
            return $jscomp.findInternal(this, e, t).v;
        };
    }), "es6-impl", "es3"), function(e, t, n) {
        "function" == typeof define && define.amd ? define([ "jquery" ], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(t || n);
    }((function(e) {
        var t = function(t, n, r) {
            var o = {
                invalid: [],
                getCaret: function() {
                    try {
                        var e, n = 0, r = t.get(0), i = document.selection, a = r.selectionStart;
                        return i && -1 === navigator.appVersion.indexOf("MSIE 10") ? (e = i.createRange(), 
                        e.moveStart("character", -o.val().length), n = e.text.length) : (a || "0" === a) && (n = a), 
                        n;
                    } catch (e) {}
                },
                setCaret: function(e) {
                    try {
                        if (t.is(":focus")) {
                            var n, r = t.get(0);
                            r.setSelectionRange ? r.setSelectionRange(e, e) : (n = r.createTextRange(), n.collapse(!0), 
                            n.moveEnd("character", e), n.moveStart("character", e), n.select());
                        }
                    } catch (e) {}
                },
                events: function() {
                    t.on("keydown.mask", (function(e) {
                        t.data("mask-keycode", e.keyCode || e.which), t.data("mask-previus-value", t.val());
                    })).on(e.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", o.behaviour).on("paste.mask drop.mask", (function() {
                        setTimeout((function() {
                            t.keydown().keyup();
                        }), 100);
                    })).on("change.mask", (function() {
                        t.data("changed", !0);
                    })).on("blur.mask", (function() {
                        a === o.val() || t.data("changed") || t.trigger("change"), t.data("changed", !1);
                    })).on("blur.mask", (function() {
                        a = o.val();
                    })).on("focus.mask", (function(t) {
                        !0 === r.selectOnFocus && e(t.target).select();
                    })).on("focusout.mask", (function() {
                        r.clearIfNotMatch && !s.test(o.val()) && o.val("");
                    }));
                },
                getRegexMask: function() {
                    for (var t, r, o, a, e = [], s = 0; s < n.length; s++) (t = i.translation[n.charAt(s)]) ? (r = t.pattern.toString().replace(/.{1}$|^.{1}/g, ""), 
                    o = t.optional, (t = t.recursive) ? (e.push(n.charAt(s)), a = {
                        digit: n.charAt(s),
                        pattern: r
                    }) : e.push(o || t ? r + "?" : r)) : e.push(n.charAt(s).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                    return e = e.join(""), a && (e = e.replace(new RegExp("(" + a.digit + "(.*" + a.digit + ")?)"), "($1)?").replace(new RegExp(a.digit, "g"), a.pattern)), 
                    new RegExp(e);
                },
                destroyEvents: function() {
                    t.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "));
                },
                val: function(e) {
                    var n = t.is("input") ? "val" : "text";
                    return 0 < arguments.length ? (t[n]() !== e && t[n](e), n = t) : n = t[n](), n;
                },
                calculateCaretPosition: function(e, n) {
                    var r = n.length, o = t.data("mask-previus-value") || "", i = o.length;
                    return 8 === t.data("mask-keycode") && o !== n ? e -= n.slice(0, e).length - o.slice(0, e).length : o !== n && (e = e >= i ? r : e + (n.slice(0, e).length - o.slice(0, e).length)), 
                    e;
                },
                behaviour: function(n) {
                    n = n || window.event, o.invalid = [];
                    var r = t.data("mask-keycode");
                    if (-1 === e.inArray(r, i.byPassKeys)) {
                        r = o.getMasked();
                        var a = o.getCaret();
                        return setTimeout((function(e, t) {
                            o.setCaret(o.calculateCaretPosition(e, t));
                        }), 10, a, r), o.val(r), o.setCaret(a), o.callbacks(n);
                    }
                },
                getMasked: function(e, t) {
                    var g, v, a = [], s = void 0 === t ? o.val() : t + "", l = 0, u = n.length, c = 0, f = s.length, d = 1, p = "push", h = -1;
                    r.reverse ? (p = "unshift", d = -1, g = 0, l = u - 1, c = f - 1, v = function() {
                        return -1 < l && -1 < c;
                    }) : (g = u - 1, v = function() {
                        return l < u && c < f;
                    });
                    for (var m; v(); ) {
                        var y = n.charAt(l), b = s.charAt(c), x = i.translation[y];
                        x ? (b.match(x.pattern) ? (a[p](b), x.recursive && (-1 === h ? h = l : l === g && (l = h - d), 
                        g === h && (l -= d)), l += d) : b === m ? m = void 0 : x.optional ? (l += d, c -= d) : x.fallback ? (a[p](x.fallback), 
                        l += d, c -= d) : o.invalid.push({
                            p: c,
                            v: b,
                            e: x.pattern
                        }), c += d) : (e || a[p](y), b === y ? c += d : m = y, l += d);
                    }
                    return s = n.charAt(g), u !== f + 1 || i.translation[s] || a.push(s), a.join("");
                },
                callbacks: function(e) {
                    var i = o.val(), s = i !== a, l = [ i, e, t, r ], u = function(e, t, n) {
                        "function" == typeof r[e] && t && r[e].apply(this, n);
                    };
                    u("onChange", !0 === s, l), u("onKeyPress", !0 === s, l), u("onComplete", i.length === n.length, l), 
                    u("onInvalid", 0 < o.invalid.length, [ i, e, t, o.invalid, r ]);
                }
            };
            t = e(t);
            var s, i = this, a = o.val();
            n = "function" == typeof n ? n(o.val(), void 0, t, r) : n, i.mask = n, i.options = r, 
            i.remove = function() {
                var e = o.getCaret();
                return o.destroyEvents(), o.val(i.getCleanVal()), o.setCaret(e), t;
            }, i.getCleanVal = function() {
                return o.getMasked(!0);
            }, i.getMaskedVal = function(e) {
                return o.getMasked(!1, e);
            }, i.init = function(a) {
                if (a = a || !1, r = r || {}, i.clearIfNotMatch = e.jMaskGlobals.clearIfNotMatch, 
                i.byPassKeys = e.jMaskGlobals.byPassKeys, i.translation = e.extend({}, e.jMaskGlobals.translation, r.translation), 
                i = e.extend(!0, {}, i, r), s = o.getRegexMask(), a) o.events(), o.val(o.getMasked()); else {
                    r.placeholder && t.attr("placeholder", r.placeholder), t.data("mask") && t.attr("autocomplete", "off"), 
                    a = 0;
                    for (var l = !0; a < n.length; a++) {
                        var u = i.translation[n.charAt(a)];
                        if (u && u.recursive) {
                            l = !1;
                            break;
                        }
                    }
                    l && t.attr("maxlength", n.length), o.destroyEvents(), o.events(), a = o.getCaret(), 
                    o.val(o.getMasked()), o.setCaret(a);
                }
            }, i.init(!t.is("input"));
        };
        e.maskWatchers = {};
        var n = function() {
            var n = e(this), o = {}, i = n.attr("data-mask");
            if (n.attr("data-mask-reverse") && (o.reverse = !0), n.attr("data-mask-clearifnotmatch") && (o.clearIfNotMatch = !0), 
            "true" === n.attr("data-mask-selectonfocus") && (o.selectOnFocus = !0), r(n, i, o)) return n.data("mask", new t(this, i, o));
        }, r = function(t, n, r) {
            r = r || {};
            var o = e(t).data("mask"), i = JSON.stringify;
            t = e(t).val() || e(t).text();
            try {
                return "function" == typeof n && (n = n(t)), "object" != typeof o || i(o.options) !== i(r) || o.mask !== n;
            } catch (e) {}
        }, o = function(e) {
            var n, t = document.createElement("div");
            return e = "on" + e, n = e in t, n || (t.setAttribute(e, "return;"), n = "function" == typeof t[e]), 
            n;
        };
        e.fn.mask = function(n, o) {
            o = o || {};
            var i = this.selector, a = e.jMaskGlobals, s = a.watchInterval, l = (a = o.watchInputs || a.watchInputs, 
            function() {
                if (r(this, n, o)) return e(this).data("mask", new t(this, n, o));
            });
            return e(this).each(l), i && "" !== i && a && (clearInterval(e.maskWatchers[i]), 
            e.maskWatchers[i] = setInterval((function() {
                e(document).find(i).each(l);
            }), s)), this;
        }, e.fn.masked = function(e) {
            return this.data("mask").getMaskedVal(e);
        }, e.fn.unmask = function() {
            return clearInterval(e.maskWatchers[this.selector]), delete e.maskWatchers[this.selector], 
            this.each((function() {
                var t = e(this).data("mask");
                t && t.remove().removeData("mask");
            }));
        }, e.fn.cleanVal = function() {
            return this.data("mask").getCleanVal();
        }, e.applyDataMask = function(t) {
            t = t || e.jMaskGlobals.maskElements, (t instanceof e ? t : e(t)).filter(e.jMaskGlobals.dataMaskAttr).each(n);
        }, o = {
            maskElements: "input,td,span,div",
            dataMaskAttr: "*[data-mask]",
            dataMask: !0,
            watchInterval: 300,
            watchInputs: !0,
            useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && o("input"),
            watchDataMask: !1,
            byPassKeys: [ 9, 16, 17, 18, 36, 37, 38, 39, 40, 91 ],
            translation: {
                0: {
                    pattern: /\d/
                },
                9: {
                    pattern: /\d/,
                    optional: !0
                },
                "#": {
                    pattern: /\d/,
                    recursive: !0
                },
                A: {
                    pattern: /[a-zA-Z0-9]/
                },
                S: {
                    pattern: /[a-zA-Z]/
                }
            }
        }, e.jMaskGlobals = e.jMaskGlobals || {}, o = e.jMaskGlobals = e.extend(!0, {}, o, e.jMaskGlobals), 
        o.dataMask && e.applyDataMask(), setInterval((function() {
            e.jMaskGlobals.watchDataMask && e.applyDataMask();
        }), o.watchInterval);
    }), window.jQuery, window.Zepto), $(document).ready((function() {
        $(".maskedPhone").mask("+7 (999) 999-99-99");
    })), $(document).ready((function() {
        var e = $(".popup_login");
        $(document).mouseup((function(t) {
            e.is(t.target) || ($(".header__login").removeClass("header__login_active"), $(e).hide());
        })), $(".header__login").on("click", (function() {
            $(this).addClass("header__login_active"), $(e).show();
        }));
    })), $(document).ready((function() {
        $(".header__selectTown").niceSelect(), $(".nav__select").niceSelect();
    })), $(document).ready((function() {
        var e = $(".price__triggers").width(), t = $(".price__trigger").length, n = $(".price__trigger").width(), r = e / t - n;
        $(".price__triggerDottedLine").each((function(e, t) {
            $(t).width(n + r), $(t).css({
                top: $(".price__triggerNumber").height() / 2,
                left: $(".price__triggerNumber").width() / 2
            });
        }));
    }));
    /*! selectize.js - v0.12.4 | https://github.com/selectize/selectize.js | Apache License (v2) */
    !function(a, b) {
        "function" == typeof define && define.amd ? define("sifter", b) : "object" == typeof exports ? module.exports = b() : a.Sifter = b();
    }(void 0, (function() {
        var a = function(a, b) {
            this.items = a, this.settings = b || {
                diacritics: !0
            };
        };
        a.prototype.tokenize = function(a) {
            if (a = e(String(a || "").toLowerCase()), !a || !a.length) return [];
            var b, c, d, g, i = [], j = a.split(/ +/);
            for (b = 0, c = j.length; b < c; b++) {
                if (d = f(j[b]), this.settings.diacritics) for (g in h) h.hasOwnProperty(g) && (d = d.replace(new RegExp(g, "g"), h[g]));
                i.push({
                    string: j[b],
                    regex: new RegExp(d, "i")
                });
            }
            return i;
        }, a.prototype.iterator = function(a, b) {
            var c;
            c = g(a) ? Array.prototype.forEach || function(a) {
                for (var b = 0, c = this.length; b < c; b++) a(this[b], b, this);
            } : function(a) {
                for (var b in this) this.hasOwnProperty(b) && a(this[b], b, this);
            }, c.apply(a, [ b ]);
        }, a.prototype.getScoreFunction = function(a, b) {
            var c, e, f, g, h;
            c = this, a = c.prepareSearch(a, b), f = a.tokens, e = a.options.fields, g = f.length, 
            h = a.options.nesting;
            var i = function(a, b) {
                var c, d;
                return a ? (a = String(a || ""), d = a.search(b.regex), -1 === d ? 0 : (c = b.string.length / a.length, 
                0 === d && (c += .5), c)) : 0;
            }, j = function() {
                var a = e.length;
                return a ? 1 === a ? function(a, b) {
                    return i(d(b, e[0], h), a);
                } : function(b, c) {
                    for (var f = 0, g = 0; f < a; f++) g += i(d(c, e[f], h), b);
                    return g / a;
                } : function() {
                    return 0;
                };
            }();
            return g ? 1 === g ? function(a) {
                return j(f[0], a);
            } : "and" === a.options.conjunction ? function(a) {
                for (var b, c = 0, d = 0; c < g; c++) {
                    if (b = j(f[c], a), b <= 0) return 0;
                    d += b;
                }
                return d / g;
            } : function(a) {
                for (var b = 0, c = 0; b < g; b++) c += j(f[b], a);
                return c / g;
            } : function() {
                return 0;
            };
        }, a.prototype.getSortFunction = function(a, c) {
            var e, f, g, h, i, j, k, l, m, n, o;
            if (g = this, a = g.prepareSearch(a, c), o = !a.query && c.sort_empty || c.sort, 
            m = function(a, b) {
                return "$score" === a ? b.score : d(g.items[b.id], a, c.nesting);
            }, i = [], o) for (e = 0, f = o.length; e < f; e++) (a.query || "$score" !== o[e].field) && i.push(o[e]);
            if (a.query) {
                for (n = !0, e = 0, f = i.length; e < f; e++) if ("$score" === i[e].field) {
                    n = !1;
                    break;
                }
                n && i.unshift({
                    field: "$score",
                    direction: "desc"
                });
            } else for (e = 0, f = i.length; e < f; e++) if ("$score" === i[e].field) {
                i.splice(e, 1);
                break;
            }
            for (l = [], e = 0, f = i.length; e < f; e++) l.push("desc" === i[e].direction ? -1 : 1);
            return j = i.length, j ? 1 === j ? (h = i[0].field, k = l[0], function(a, c) {
                return k * b(m(h, a), m(h, c));
            }) : function(a, c) {
                var d, e, f;
                for (d = 0; d < j; d++) if (f = i[d].field, e = l[d] * b(m(f, a), m(f, c))) return e;
                return 0;
            } : null;
        }, a.prototype.prepareSearch = function(a, b) {
            if ("object" == typeof a) return a;
            b = c({}, b);
            var d = b.fields, e = b.sort, f = b.sort_empty;
            return d && !g(d) && (b.fields = [ d ]), e && !g(e) && (b.sort = [ e ]), f && !g(f) && (b.sort_empty = [ f ]), 
            {
                options: b,
                query: String(a || "").toLowerCase(),
                tokens: this.tokenize(a),
                total: 0,
                items: []
            };
        }, a.prototype.search = function(a, b) {
            var c, d, e, f, g = this;
            return d = this.prepareSearch(a, b), b = d.options, a = d.query, f = b.score || g.getScoreFunction(d), 
            a.length ? g.iterator(g.items, (function(a, e) {
                c = f(a), (!1 === b.filter || c > 0) && d.items.push({
                    score: c,
                    id: e
                });
            })) : g.iterator(g.items, (function(a, b) {
                d.items.push({
                    score: 1,
                    id: b
                });
            })), e = g.getSortFunction(d, b), e && d.items.sort(e), d.total = d.items.length, 
            "number" == typeof b.limit && (d.items = d.items.slice(0, b.limit)), d;
        };
        var b = function(a, b) {
            return "number" == typeof a && "number" == typeof b ? a > b ? 1 : a < b ? -1 : 0 : (a = i(String(a || "")), 
            b = i(String(b || "")), a > b ? 1 : b > a ? -1 : 0);
        }, c = function(a, b) {
            var c, d, e, f;
            for (c = 1, d = arguments.length; c < d; c++) if (f = arguments[c]) for (e in f) f.hasOwnProperty(e) && (a[e] = f[e]);
            return a;
        }, d = function(a, b, c) {
            if (a && b) {
                if (!c) return a[b];
                for (var d = b.split("."); d.length && (a = a[d.shift()]); ) ;
                return a;
            }
        }, e = function(a) {
            return (a + "").replace(/^\s+|\s+$|/g, "");
        }, f = function(a) {
            return (a + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }, g = Array.isArray || "undefined" != typeof $ && $.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
        }, h = {
            a: "[aбёЂбёЃД‚ДѓГ‚ГўЗЌЗЋИєв±ҐИ¦И§бє бєЎГ„Г¤ГЂГ ГЃГЎДЂДЃГѓГЈГ…ГҐД…Д„ГѓД…Д„]",
            b: "[bвђўОІО’BаёїрђЊЃб›’]",
            c: "[cД†Д‡Д€Д‰ДЊДЌДЉД‹CМ„cМ„Г‡Г§бё€бё‰И»ИјЖ‡Ж€Й•бґ„пјЈпЅѓ]",
            d: "[dДЋДЏбёЉбё‹бёђбё‘бёЊбёЌбё’бё“бёЋбёЏДђД‘DМ¦dМ¦Ж‰Й–ЖЉЙ—Ж‹ЖЊбµ­б¶Ѓб¶‘ИЎбґ…пј¤пЅ„Г°]",
            e: "[eГ‰Г©Г€ГЁГЉГЄбёбё™ДљД›Д”Д•бєјбєЅбёљбё›бєєбє»Д–Д—Г‹Г«Д’Д“ИЁИ©ДД™б¶’Й†Й‡И„И…бєѕбєїб»Ђб»Ѓб»„б»…б»‚б»ѓбёњбёќбё–бё—бё”бё•И†И‡бєёбє№б»†б»‡в±ёбґ‡пјҐпЅ…ЙЗќЖЏЖђОµ]",
            f: "[fЖ‘Ж’бёћбёџ]",
            g: "[gЙўв‚ІЗ¤ЗҐДњДќДћДџДўДЈЖ“Й Д ДЎ]",
            h: "[hД¤ДҐД¦Д§бёЁбё©бє–бє–бё¤бёҐбёўбёЈЙ¦К°З¶Ж•]",
            i: "[iГЌГ­ГЊГ¬Д¬Д­ГЋГ®ЗЏЗђГЏГЇбё®бёЇДЁД©Д®ДЇДЄД«б»€б»‰И€И‰ИЉИ‹б»Љб»‹бё¬бё­Ж—ЙЁЙЁМ†бµ»б¶–Д°iIД±ЙЄпј©пЅ‰]",
            j: "[jИ·ДґДµЙ€Й‰КќЙџКІ]",
            k: "[kЖЖ™кќЂкќЃбё°бё±ЗЁЗ©бёІбёібёґбёµОєП°в‚­]",
            l: "[lЕЃЕ‚ДЅДѕД»ДјД№Дєбё¶бё·бёёбё№бёјбёЅбёєбё»ДїЕЂИЅЖљв± в±Ўв±ўЙ«Й¬б¶…Й­ИґКџпј¬пЅЊ]",
            n: "[nЕѓЕ„ЗёЗ№Е‡Е€Г‘Г±б№„б№…Е…Е†б№†б№‡б№Љб№‹б№€б№‰NМ€nМ€ЖќЙІИ Жћбµ°б¶‡ЙіИµЙґпј®пЅЋЕЉЕ‹]",
            o: "[oГГёГ–Г¶Г“ГіГ’ГІГ”ГґЗ‘З’ЕђЕ‘ЕЋЕЏИ®ИЇб»Њб»ЌЖџЙµЖ ЖЎб»Ћб»ЏЕЊЕЌГ•ГµЗЄЗ«ИЊИЌХ•Ц…]",
            p: "[pб№”б№•б№–б№—в±ЈбµЅЖ¤ЖҐбµ±]",
            q: "[qкќ–кќ—К ЙЉЙ‹кќкќ™qМѓ]",
            r: "[rЕ”Е•ЙЊЙЌЕЕ™Е–Е—б№б№™ИђИ‘И’И“б№љб№›в±¤ЙЅ]",
            s: "[sЕљЕ›б№ б№Ўб№ўб№ЈкћЁкћ©ЕњЕќЕ ЕЎЕћЕџИИ™SМ€sМ€]",
            t: "[tЕ¤ЕҐб№Єб№«ЕўЕЈб№¬б№­Ж®К€ИљИ›б№°б№±б№®б№ЇЖ¬Ж­]",
            u: "[uЕ¬Е­Й„К‰б»¤б»ҐГњГјГљГєГ™Г№Г›Г»З“З”Е°Е±Е¬Е­ЖЇЖ°б»¦б»§ЕЄЕ«ЕЁЕ©ЕІЕіИ”И•в€Є]",
            v: "[vб№јб№Ѕб№ѕб№їЖІК‹кќћкќџв±±К‹]",
            w: "[wбє‚бєѓбєЂбєЃЕґЕµбє„бє…бє†бє‡бє€бє‰]",
            x: "[xбєЊбєЌбєЉбє‹П‡]",
            y: "[yГќГЅб»Іб»іЕ¶Е·ЕёГїб»ёб»№бєЋбєЏб»ґб»µЙЋЙЏЖіЖґ]",
            z: "[zЕ№Еєбєђбє‘ЕЅЕѕЕ»Ејбє’бє“бє”бє•ЖµЖ¶]"
        }, i = function() {
            var a, b, c, d, e = "", f = {};
            for (c in h) if (h.hasOwnProperty(c)) for (d = h[c].substring(2, h[c].length - 1), 
            e += d, a = 0, b = d.length; a < b; a++) f[d.charAt(a)] = c;
            var g = new RegExp("[" + e + "]", "g");
            return function(a) {
                return a.replace(g, (function(a) {
                    return f[a];
                })).toLowerCase();
            };
        }();
        return a;
    })), function(a, b) {
        "function" == typeof define && define.amd ? define("microplugin", b) : "object" == typeof exports ? module.exports = b() : a.MicroPlugin = b();
    }(void 0, (function() {
        var a = {};
        a.mixin = function(a) {
            a.plugins = {}, a.prototype.initializePlugins = function(a) {
                var c, d, e, f = this, g = [];
                if (f.plugins = {
                    names: [],
                    settings: {},
                    requested: {},
                    loaded: {}
                }, b.isArray(a)) for (c = 0, d = a.length; c < d; c++) "string" == typeof a[c] ? g.push(a[c]) : (f.plugins.settings[a[c].name] = a[c].options, 
                g.push(a[c].name)); else if (a) for (e in a) a.hasOwnProperty(e) && (f.plugins.settings[e] = a[e], 
                g.push(e));
                for (;g.length; ) f.require(g.shift());
            }, a.prototype.loadPlugin = function(b) {
                var c = this, d = c.plugins, e = a.plugins[b];
                if (!a.plugins.hasOwnProperty(b)) throw new Error('Unable to find "' + b + '" plugin');
                d.requested[b] = !0, d.loaded[b] = e.fn.apply(c, [ c.plugins.settings[b] || {} ]), 
                d.names.push(b);
            }, a.prototype.require = function(a) {
                var b = this, c = b.plugins;
                if (!b.plugins.loaded.hasOwnProperty(a)) {
                    if (c.requested[a]) throw new Error('Plugin has circular dependency ("' + a + '")');
                    b.loadPlugin(a);
                }
                return c.loaded[a];
            }, a.define = function(b, c) {
                a.plugins[b] = {
                    name: b,
                    fn: c
                };
            };
        };
        var b = {
            isArray: Array.isArray || function(a) {
                return "[object Array]" === Object.prototype.toString.call(a);
            }
        };
        return a;
    })), function(a, b) {
        "function" == typeof define && define.amd ? define("selectize", [ "jquery", "sifter", "microplugin" ], b) : "object" == typeof exports ? module.exports = b(require("jquery"), require("sifter"), require("microplugin")) : a.Selectize = b(a.jQuery, a.Sifter, a.MicroPlugin);
    }(void 0, (function(a, b, c) {
        "use strict";
        var d = function(a, b) {
            if ("string" != typeof b || b.length) {
                var c = "string" == typeof b ? new RegExp(b, "i") : b, d = function(a) {
                    var b = 0;
                    if (3 === a.nodeType) {
                        var e = a.data.search(c);
                        if (e >= 0 && a.data.length > 0) {
                            var f = a.data.match(c), g = document.createElement("span");
                            g.className = "highlight";
                            var h = a.splitText(e), i = (h.splitText(f[0].length), h.cloneNode(!0));
                            g.appendChild(i), h.parentNode.replaceChild(g, h), b = 1;
                        }
                    } else if (1 === a.nodeType && a.childNodes && !/(script|style)/i.test(a.tagName)) for (var j = 0; j < a.childNodes.length; ++j) j += d(a.childNodes[j]);
                    return b;
                };
                return a.each((function() {
                    d(this);
                }));
            }
        };
        a.fn.removeHighlight = function() {
            return this.find("span.highlight").each((function() {
                this.parentNode.firstChild.nodeName;
                var a = this.parentNode;
                a.replaceChild(this.firstChild, this), a.normalize();
            })).end();
        };
        var e = function() {};
        e.prototype = {
            on: function(a, b) {
                this._events = this._events || {}, this._events[a] = this._events[a] || [], this._events[a].push(b);
            },
            off: function(a, b) {
                var c = arguments.length;
                return 0 === c ? delete this._events : 1 === c ? delete this._events[a] : (this._events = this._events || {}, 
                void (a in this._events != !1 && this._events[a].splice(this._events[a].indexOf(b), 1)));
            },
            trigger: function(a) {
                if (this._events = this._events || {}, a in this._events != !1) for (var b = 0; b < this._events[a].length; b++) this._events[a][b].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }, e.mixin = function(a) {
            for (var b = [ "on", "off", "trigger" ], c = 0; c < b.length; c++) a.prototype[b[c]] = e.prototype[b[c]];
        };
        var f = /Mac/.test(navigator.userAgent), g = 65, h = 13, i = 27, j = 37, k = 38, l = 80, m = 39, n = 40, o = 78, p = 8, q = 46, r = 16, s = f ? 91 : 17, t = f ? 18 : 17, u = 9, v = 1, w = 2, x = !/android/i.test(window.navigator.userAgent) && !!document.createElement("input").validity, y = function(a) {
            return "undefined" != typeof a;
        }, z = function(a) {
            return "undefined" == typeof a || null === a ? null : "boolean" == typeof a ? a ? "1" : "0" : a + "";
        }, A = function(a) {
            return (a + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }, B = {};
        B.before = function(a, b, c) {
            var d = a[b];
            a[b] = function() {
                return c.apply(a, arguments), d.apply(a, arguments);
            };
        }, B.after = function(a, b, c) {
            var d = a[b];
            a[b] = function() {
                var b = d.apply(a, arguments);
                return c.apply(a, arguments), b;
            };
        };
        var C = function(a) {
            var b = !1;
            return function() {
                b || (b = !0, a.apply(this, arguments));
            };
        }, D = function(a, b) {
            var c;
            return function() {
                var d = this, e = arguments;
                window.clearTimeout(c), c = window.setTimeout((function() {
                    a.apply(d, e);
                }), b);
            };
        }, E = function(a, b, c) {
            var d, e = a.trigger, f = {};
            a.trigger = function() {
                var c = arguments[0];
                return -1 === b.indexOf(c) ? e.apply(a, arguments) : void (f[c] = arguments);
            }, c.apply(a, []), a.trigger = e;
            for (d in f) f.hasOwnProperty(d) && e.apply(a, f[d]);
        }, F = function(a, b, c, d) {
            a.on(b, c, (function(b) {
                for (var c = b.target; c && c.parentNode !== a[0]; ) c = c.parentNode;
                return b.currentTarget = c, d.apply(this, [ b ]);
            }));
        }, G = function(a) {
            var b = {};
            if ("selectionStart" in a) b.start = a.selectionStart, b.length = a.selectionEnd - b.start; else if (document.selection) {
                a.focus();
                var c = document.selection.createRange(), d = document.selection.createRange().text.length;
                c.moveStart("character", -a.value.length), b.start = c.text.length - d, b.length = d;
            }
            return b;
        }, H = function(a, b, c) {
            var d, e, f = {};
            if (c) for (d = 0, e = c.length; d < e; d++) f[c[d]] = a.css(c[d]); else f = a.css();
            b.css(f);
        }, I = function(b, c) {
            if (!b) return 0;
            var d = a("<test>").css({
                position: "absolute",
                top: -99999,
                left: -99999,
                width: "auto",
                padding: 0,
                whiteSpace: "pre"
            }).text(b).appendTo("body");
            H(c, d, [ "letterSpacing", "fontSize", "fontFamily", "fontWeight", "textTransform" ]);
            var e = d.width();
            return d.remove(), e;
        }, J = function(a) {
            var b = null, c = function(c, d) {
                var e, f, g, h, i, j, k, l;
                c = c || window.event || {}, d = d || {}, c.metaKey || c.altKey || (d.force || !1 !== a.data("grow")) && (e = a.val(), 
                c.type && "keydown" === c.type.toLowerCase() && (f = c.keyCode, g = f >= 97 && f <= 122 || f >= 65 && f <= 90 || f >= 48 && f <= 57 || 32 === f, 
                f === q || f === p ? (l = G(a[0]), l.length ? e = e.substring(0, l.start) + e.substring(l.start + l.length) : f === p && l.start ? e = e.substring(0, l.start - 1) + e.substring(l.start + 1) : f === q && "undefined" != typeof l.start && (e = e.substring(0, l.start) + e.substring(l.start + 1))) : g && (j = c.shiftKey, 
                k = String.fromCharCode(c.keyCode), k = j ? k.toUpperCase() : k.toLowerCase(), e += k)), 
                h = a.attr("placeholder"), !e && h && (e = h), i = I(e, a) + 4, i !== b && (b = i, 
                a.width(i), a.triggerHandler("resize")));
            };
            a.on("keydown keyup update blur", c), c();
        }, K = function(a) {
            var b = document.createElement("div");
            return b.appendChild(a.cloneNode(!0)), b.innerHTML;
        }, L = function(a, b) {
            b || (b = {});
            var c = "Selectize";
            console.error(c + ": " + a), b.explanation && (console.group && console.group(), 
            console.error(b.explanation), console.group && console.groupEnd());
        }, M = function(c, d) {
            var e, f, g, h, i = this;
            h = c[0], h.selectize = i;
            var j = window.getComputedStyle && window.getComputedStyle(h, null);
            if (g = j ? j.getPropertyValue("direction") : h.currentStyle && h.currentStyle.direction, 
            g = g || c.parents("[dir]:first").attr("dir") || "", a.extend(i, {
                order: 0,
                settings: d,
                $input: c,
                tabIndex: c.attr("tabindex") || "",
                tagType: "select" === h.tagName.toLowerCase() ? v : w,
                rtl: /rtl/i.test(g),
                eventNS: ".selectize" + ++M.count,
                highlightedValue: null,
                isOpen: !1,
                isDisabled: !1,
                isRequired: c.is("[required]"),
                isInvalid: !1,
                isLocked: !1,
                isFocused: !1,
                isInputHidden: !1,
                isSetup: !1,
                isShiftDown: !1,
                isCmdDown: !1,
                isCtrlDown: !1,
                ignoreFocus: !1,
                ignoreBlur: !1,
                ignoreHover: !1,
                hasOptions: !1,
                currentResults: null,
                lastValue: "",
                caretPos: 0,
                loading: 0,
                loadedSearches: {},
                $activeOption: null,
                $activeItems: [],
                optgroups: {},
                options: {},
                userOptions: {},
                items: [],
                renderCache: {},
                onSearchChange: null === d.loadThrottle ? i.onSearchChange : D(i.onSearchChange, d.loadThrottle)
            }), i.sifter = new b(this.options, {
                diacritics: d.diacritics
            }), i.settings.options) {
                for (e = 0, f = i.settings.options.length; e < f; e++) i.registerOption(i.settings.options[e]);
                delete i.settings.options;
            }
            if (i.settings.optgroups) {
                for (e = 0, f = i.settings.optgroups.length; e < f; e++) i.registerOptionGroup(i.settings.optgroups[e]);
                delete i.settings.optgroups;
            }
            i.settings.mode = i.settings.mode || (1 === i.settings.maxItems ? "single" : "multi"), 
            "boolean" != typeof i.settings.hideSelected && (i.settings.hideSelected = "multi" === i.settings.mode), 
            i.initializePlugins(i.settings.plugins), i.setupCallbacks(), i.setupTemplates(), 
            i.setup();
        };
        return e.mixin(M), "undefined" != typeof c ? c.mixin(M) : L("Dependency MicroPlugin is missing", {
            explanation: 'Make sure you either: (1) are using the "standalone" version of Selectize, or (2) require MicroPlugin before you load Selectize.'
        }), a.extend(M.prototype, {
            setup: function() {
                var b, c, d, e, g, h, i, j, k, l, m = this, n = m.settings, o = m.eventNS, p = a(window), q = a(document), u = m.$input;
                if (i = m.settings.mode, j = u.attr("class") || "", b = a("<div>").addClass(n.wrapperClass).addClass(j).addClass(i), 
                c = a("<div>").addClass(n.inputClass).addClass("items").appendTo(b), d = a('<input type="text" autocomplete="off" />').appendTo(c).attr("tabindex", u.is(":disabled") ? "-1" : m.tabIndex), 
                h = a(n.dropdownParent || b), e = a("<div>").addClass(n.dropdownClass).addClass(i).hide().appendTo(h), 
                g = a("<div>").addClass(n.dropdownContentClass).appendTo(e), (l = u.attr("id")) && (d.attr("id", l + "-selectized"), 
                a("label[for='" + l + "']").attr("for", l + "-selectized")), m.settings.copyClassesToDropdown && e.addClass(j), 
                b.css({
                    width: u[0].style.width
                }), m.plugins.names.length && (k = "plugin-" + m.plugins.names.join(" plugin-"), 
                b.addClass(k), e.addClass(k)), (null === n.maxItems || n.maxItems > 1) && m.tagType === v && u.attr("multiple", "multiple"), 
                m.settings.placeholder && d.attr("placeholder", n.placeholder), !m.settings.splitOn && m.settings.delimiter) {
                    var w = m.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                    m.settings.splitOn = new RegExp("\\s*" + w + "+\\s*");
                }
                u.attr("autocorrect") && d.attr("autocorrect", u.attr("autocorrect")), u.attr("autocapitalize") && d.attr("autocapitalize", u.attr("autocapitalize")), 
                m.$wrapper = b, m.$control = c, m.$control_input = d, m.$dropdown = e, m.$dropdown_content = g, 
                e.on("mouseenter", "[data-selectable]", (function() {
                    return m.onOptionHover.apply(m, arguments);
                })), e.on("mousedown click", "[data-selectable]", (function() {
                    return m.onOptionSelect.apply(m, arguments);
                })), F(c, "mousedown", "*:not(input)", (function() {
                    return m.onItemSelect.apply(m, arguments);
                })), J(d), c.on({
                    mousedown: function() {
                        return m.onMouseDown.apply(m, arguments);
                    },
                    click: function() {
                        return m.onClick.apply(m, arguments);
                    }
                }), d.on({
                    mousedown: function(a) {
                        a.stopPropagation();
                    },
                    keydown: function() {
                        return m.onKeyDown.apply(m, arguments);
                    },
                    keyup: function() {
                        return m.onKeyUp.apply(m, arguments);
                    },
                    keypress: function() {
                        return m.onKeyPress.apply(m, arguments);
                    },
                    resize: function() {
                        m.positionDropdown.apply(m, []);
                    },
                    blur: function() {
                        return m.onBlur.apply(m, arguments);
                    },
                    focus: function() {
                        return m.ignoreBlur = !1, m.onFocus.apply(m, arguments);
                    },
                    paste: function() {
                        return m.onPaste.apply(m, arguments);
                    }
                }), q.on("keydown" + o, (function(a) {
                    m.isCmdDown = a[f ? "metaKey" : "ctrlKey"], m.isCtrlDown = a[f ? "altKey" : "ctrlKey"], 
                    m.isShiftDown = a.shiftKey;
                })), q.on("keyup" + o, (function(a) {
                    a.keyCode === t && (m.isCtrlDown = !1), a.keyCode === r && (m.isShiftDown = !1), 
                    a.keyCode === s && (m.isCmdDown = !1);
                })), q.on("mousedown" + o, (function(a) {
                    if (m.isFocused) {
                        if (a.target === m.$dropdown[0] || a.target.parentNode === m.$dropdown[0]) return !1;
                        m.$control.has(a.target).length || a.target === m.$control[0] || m.blur(a.target);
                    }
                })), p.on([ "scroll" + o, "resize" + o ].join(" "), (function() {
                    m.isOpen && m.positionDropdown.apply(m, arguments);
                })), p.on("mousemove" + o, (function() {
                    m.ignoreHover = !1;
                })), this.revertSettings = {
                    $children: u.children().detach(),
                    tabindex: u.attr("tabindex")
                }, u.attr("tabindex", -1).hide().after(m.$wrapper), a.isArray(n.items) && (m.setValue(n.items), 
                delete n.items), x && u.on("invalid" + o, (function(a) {
                    a.preventDefault(), m.isInvalid = !0, m.refreshState();
                })), m.updateOriginalInput(), m.refreshItems(), m.refreshState(), m.updatePlaceholder(), 
                m.isSetup = !0, u.is(":disabled") && m.disable(), m.on("change", this.onChange), 
                u.data("selectize", m), u.addClass("selectized"), m.trigger("initialize"), !0 === n.preload && m.onSearchChange("");
            },
            setupTemplates: function() {
                var b = this, c = b.settings.labelField, d = b.settings.optgroupLabelField, e = {
                    optgroup: function(a) {
                        return '<div class="optgroup">' + a.html + "</div>";
                    },
                    optgroup_header: function(a, b) {
                        return '<div class="optgroup-header">' + b(a[d]) + "</div>";
                    },
                    option: function(a, b) {
                        return '<div class="option">' + b(a[c]) + "</div>";
                    },
                    item: function(a, b) {
                        return '<div class="item">' + b(a[c]) + "</div>";
                    },
                    option_create: function(a, b) {
                        return '<div class="create">Add <strong>' + b(a.input) + "</strong>&hellip;</div>";
                    }
                };
                b.settings.render = a.extend({}, e, b.settings.render);
            },
            setupCallbacks: function() {
                var a, b, c = {
                    initialize: "onInitialize",
                    change: "onChange",
                    item_add: "onItemAdd",
                    item_remove: "onItemRemove",
                    clear: "onClear",
                    option_add: "onOptionAdd",
                    option_remove: "onOptionRemove",
                    option_clear: "onOptionClear",
                    optgroup_add: "onOptionGroupAdd",
                    optgroup_remove: "onOptionGroupRemove",
                    optgroup_clear: "onOptionGroupClear",
                    dropdown_open: "onDropdownOpen",
                    dropdown_close: "onDropdownClose",
                    type: "onType",
                    load: "onLoad",
                    focus: "onFocus",
                    blur: "onBlur"
                };
                for (a in c) c.hasOwnProperty(a) && (b = this.settings[c[a]], b && this.on(a, b));
            },
            onClick: function(a) {
                var b = this;
                b.isFocused || (b.focus(), a.preventDefault());
            },
            onMouseDown: function(b) {
                var c = this, d = b.isDefaultPrevented();
                a(b.target);
                if (c.isFocused) {
                    if (b.target !== c.$control_input[0]) return "single" === c.settings.mode ? c.isOpen ? c.close() : c.open() : d || c.setActiveItem(null), 
                    !1;
                } else d || window.setTimeout((function() {
                    c.focus();
                }), 0);
            },
            onChange: function() {
                this.$input.trigger("change");
            },
            onPaste: function(b) {
                var c = this;
                return c.isFull() || c.isInputHidden || c.isLocked ? void b.preventDefault() : void (c.settings.splitOn && setTimeout((function() {
                    var b = c.$control_input.val();
                    if (b.match(c.settings.splitOn)) for (var d = a.trim(b).split(c.settings.splitOn), e = 0, f = d.length; e < f; e++) c.createItem(d[e]);
                }), 0));
            },
            onKeyPress: function(a) {
                if (this.isLocked) return a && a.preventDefault();
                var b = String.fromCharCode(a.keyCode || a.which);
                return this.settings.create && "multi" === this.settings.mode && b === this.settings.delimiter ? (this.createItem(), 
                a.preventDefault(), !1) : void 0;
            },
            onKeyDown: function(a) {
                var b = (a.target === this.$control_input[0], this);
                if (b.isLocked) return void (a.keyCode !== u && a.preventDefault());
                switch (a.keyCode) {
                  case g:
                    if (b.isCmdDown) return void b.selectAll();
                    break;

                  case i:
                    return void (b.isOpen && (a.preventDefault(), a.stopPropagation(), b.close()));

                  case o:
                    if (!a.ctrlKey || a.altKey) break;

                  case n:
                    if (!b.isOpen && b.hasOptions) b.open(); else if (b.$activeOption) {
                        b.ignoreHover = !0;
                        var c = b.getAdjacentOption(b.$activeOption, 1);
                        c.length && b.setActiveOption(c, !0, !0);
                    }
                    return void a.preventDefault();

                  case l:
                    if (!a.ctrlKey || a.altKey) break;

                  case k:
                    if (b.$activeOption) {
                        b.ignoreHover = !0;
                        var d = b.getAdjacentOption(b.$activeOption, -1);
                        d.length && b.setActiveOption(d, !0, !0);
                    }
                    return void a.preventDefault();

                  case h:
                    return void (b.isOpen && b.$activeOption && (b.onOptionSelect({
                        currentTarget: b.$activeOption
                    }), a.preventDefault()));

                  case j:
                    return void b.advanceSelection(-1, a);

                  case m:
                    return void b.advanceSelection(1, a);

                  case u:
                    return b.settings.selectOnTab && b.isOpen && b.$activeOption && (b.onOptionSelect({
                        currentTarget: b.$activeOption
                    }), b.isFull() || a.preventDefault()), void (b.settings.create && b.createItem() && a.preventDefault());

                  case p:
                  case q:
                    return void b.deleteSelection(a);
                }
                return !b.isFull() && !b.isInputHidden || (f ? a.metaKey : a.ctrlKey) ? void 0 : void a.preventDefault();
            },
            onKeyUp: function(a) {
                var b = this;
                if (b.isLocked) return a && a.preventDefault();
                var c = b.$control_input.val() || "";
                b.lastValue !== c && (b.lastValue = c, b.onSearchChange(c), b.refreshOptions(), 
                b.trigger("type", c));
            },
            onSearchChange: function(a) {
                var b = this, c = b.settings.load;
                c && (b.loadedSearches.hasOwnProperty(a) || (b.loadedSearches[a] = !0, b.load((function(d) {
                    c.apply(b, [ a, d ]);
                }))));
            },
            onFocus: function(a) {
                var b = this, c = b.isFocused;
                return b.isDisabled ? (b.blur(), a && a.preventDefault(), !1) : void (b.ignoreFocus || (b.isFocused = !0, 
                "focus" === b.settings.preload && b.onSearchChange(""), c || b.trigger("focus"), 
                b.$activeItems.length || (b.showInput(), b.setActiveItem(null), b.refreshOptions(!!b.settings.openOnFocus)), 
                b.refreshState()));
            },
            onBlur: function(a, b) {
                var c = this;
                if (c.isFocused && (c.isFocused = !1, !c.ignoreFocus)) {
                    if (!c.ignoreBlur && document.activeElement === c.$dropdown_content[0]) return c.ignoreBlur = !0, 
                    void c.onFocus(a);
                    var d = function() {
                        c.close(), c.setTextboxValue(""), c.setActiveItem(null), c.setActiveOption(null), 
                        c.setCaret(c.items.length), c.refreshState(), b && b.focus && b.focus(), c.ignoreFocus = !1, 
                        c.trigger("blur");
                    };
                    c.ignoreFocus = !0, c.settings.create && c.settings.createOnBlur ? c.createItem(null, !1, d) : d();
                }
            },
            onOptionHover: function(a) {
                this.ignoreHover || this.setActiveOption(a.currentTarget, !1);
            },
            onOptionSelect: function(b) {
                var c, d, e = this;
                b.preventDefault && (b.preventDefault(), b.stopPropagation()), d = a(b.currentTarget), 
                d.hasClass("create") ? e.createItem(null, (function() {
                    e.settings.closeAfterSelect && e.close();
                })) : (c = d.attr("data-value"), "undefined" != typeof c && (e.lastQuery = null, 
                e.setTextboxValue(""), e.addItem(c), e.settings.closeAfterSelect ? e.close() : !e.settings.hideSelected && b.type && /mouse/.test(b.type) && e.setActiveOption(e.getOption(c))));
            },
            onItemSelect: function(a) {
                var b = this;
                b.isLocked || "multi" === b.settings.mode && (a.preventDefault(), b.setActiveItem(a.currentTarget, a));
            },
            load: function(a) {
                var b = this, c = b.$wrapper.addClass(b.settings.loadingClass);
                b.loading++, a.apply(b, [ function(a) {
                    b.loading = Math.max(b.loading - 1, 0), a && a.length && (b.addOption(a), b.refreshOptions(b.isFocused && !b.isInputHidden)), 
                    b.loading || c.removeClass(b.settings.loadingClass), b.trigger("load", a);
                } ]);
            },
            setTextboxValue: function(a) {
                var b = this.$control_input, c = b.val() !== a;
                c && (b.val(a).triggerHandler("update"), this.lastValue = a);
            },
            getValue: function() {
                return this.tagType === v && this.$input.attr("multiple") ? this.items : this.items.join(this.settings.delimiter);
            },
            setValue: function(a, b) {
                var c = b ? [] : [ "change" ];
                E(this, c, (function() {
                    this.clear(b), this.addItems(a, b);
                }));
            },
            setActiveItem: function(b, c) {
                var d, e, f, g, h, i, j, k, l = this;
                if ("single" !== l.settings.mode) {
                    if (b = a(b), !b.length) return a(l.$activeItems).removeClass("active"), l.$activeItems = [], 
                    void (l.isFocused && l.showInput());
                    if (d = c && c.type.toLowerCase(), "mousedown" === d && l.isShiftDown && l.$activeItems.length) {
                        for (k = l.$control.children(".active:last"), g = Array.prototype.indexOf.apply(l.$control[0].childNodes, [ k[0] ]), 
                        h = Array.prototype.indexOf.apply(l.$control[0].childNodes, [ b[0] ]), g > h && (j = g, 
                        g = h, h = j), e = g; e <= h; e++) i = l.$control[0].childNodes[e], -1 === l.$activeItems.indexOf(i) && (a(i).addClass("active"), 
                        l.$activeItems.push(i));
                        c.preventDefault();
                    } else "mousedown" === d && l.isCtrlDown || "keydown" === d && this.isShiftDown ? b.hasClass("active") ? (f = l.$activeItems.indexOf(b[0]), 
                    l.$activeItems.splice(f, 1), b.removeClass("active")) : l.$activeItems.push(b.addClass("active")[0]) : (a(l.$activeItems).removeClass("active"), 
                    l.$activeItems = [ b.addClass("active")[0] ]);
                    l.hideInput(), this.isFocused || l.focus();
                }
            },
            setActiveOption: function(b, c, d) {
                var e, f, g, h, i, j = this;
                j.$activeOption && j.$activeOption.removeClass("active"), j.$activeOption = null, 
                b = a(b), b.length && (j.$activeOption = b.addClass("active"), !c && y(c) || (e = j.$dropdown_content.height(), 
                f = j.$activeOption.outerHeight(!0), c = j.$dropdown_content.scrollTop() || 0, g = j.$activeOption.offset().top - j.$dropdown_content.offset().top + c, 
                h = g, i = g - e + f, g + f > e + c ? j.$dropdown_content.stop().animate({
                    scrollTop: i
                }, d ? j.settings.scrollDuration : 0) : g < c && j.$dropdown_content.stop().animate({
                    scrollTop: h
                }, d ? j.settings.scrollDuration : 0)));
            },
            selectAll: function() {
                var a = this;
                "single" !== a.settings.mode && (a.$activeItems = Array.prototype.slice.apply(a.$control.children(":not(input)").addClass("active")), 
                a.$activeItems.length && (a.hideInput(), a.close()), a.focus());
            },
            hideInput: function() {
                var a = this;
                a.setTextboxValue(""), a.$control_input.css({
                    opacity: 0,
                    position: "absolute",
                    left: a.rtl ? 1e4 : -1e4
                }), a.isInputHidden = !0;
            },
            showInput: function() {
                this.$control_input.css({
                    opacity: 1,
                    position: "relative",
                    left: 0
                }), this.isInputHidden = !1;
            },
            focus: function() {
                var a = this;
                a.isDisabled || (a.ignoreFocus = !0, a.$control_input[0].focus(), window.setTimeout((function() {
                    a.ignoreFocus = !1, a.onFocus();
                }), 0));
            },
            blur: function(a) {
                this.$control_input[0].blur(), this.onBlur(null, a);
            },
            getScoreFunction: function(a) {
                return this.sifter.getScoreFunction(a, this.getSearchOptions());
            },
            getSearchOptions: function() {
                var a = this.settings, b = a.sortField;
                return "string" == typeof b && (b = [ {
                    field: b
                } ]), {
                    fields: a.searchField,
                    conjunction: a.searchConjunction,
                    sort: b
                };
            },
            search: function(b) {
                var c, d, e, f = this, g = f.settings, h = this.getSearchOptions();
                if (g.score && (e = f.settings.score.apply(this, [ b ]), "function" != typeof e)) throw new Error('Selectize "score" setting must be a function that returns a function');
                if (b !== f.lastQuery ? (f.lastQuery = b, d = f.sifter.search(b, a.extend(h, {
                    score: e
                })), f.currentResults = d) : d = a.extend(!0, {}, f.currentResults), g.hideSelected) for (c = d.items.length - 1; c >= 0; c--) -1 !== f.items.indexOf(z(d.items[c].id)) && d.items.splice(c, 1);
                return d;
            },
            refreshOptions: function(b) {
                var c, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s;
                "undefined" == typeof b && (b = !0);
                var t = this, u = a.trim(t.$control_input.val()), v = t.search(u), w = t.$dropdown_content, x = t.$activeOption && z(t.$activeOption.attr("data-value"));
                for (g = v.items.length, "number" == typeof t.settings.maxOptions && (g = Math.min(g, t.settings.maxOptions)), 
                h = {}, i = [], c = 0; c < g; c++) for (j = t.options[v.items[c].id], k = t.render("option", j), 
                l = j[t.settings.optgroupField] || "", m = a.isArray(l) ? l : [ l ], e = 0, f = m && m.length; e < f; e++) l = m[e], 
                t.optgroups.hasOwnProperty(l) || (l = ""), h.hasOwnProperty(l) || (h[l] = document.createDocumentFragment(), 
                i.push(l)), h[l].appendChild(k);
                for (this.settings.lockOptgroupOrder && i.sort((function(a, b) {
                    var c = t.optgroups[a].$order || 0, d = t.optgroups[b].$order || 0;
                    return c - d;
                })), n = document.createDocumentFragment(), c = 0, g = i.length; c < g; c++) l = i[c], 
                t.optgroups.hasOwnProperty(l) && h[l].childNodes.length ? (o = document.createDocumentFragment(), 
                o.appendChild(t.render("optgroup_header", t.optgroups[l])), o.appendChild(h[l]), 
                n.appendChild(t.render("optgroup", a.extend({}, t.optgroups[l], {
                    html: K(o),
                    dom: o
                })))) : n.appendChild(h[l]);
                if (w.html(n), t.settings.highlight && v.query.length && v.tokens.length) for (w.removeHighlight(), 
                c = 0, g = v.tokens.length; c < g; c++) d(w, v.tokens[c].regex);
                if (!t.settings.hideSelected) for (c = 0, g = t.items.length; c < g; c++) t.getOption(t.items[c]).addClass("selected");
                p = t.canCreate(u), p && (w.prepend(t.render("option_create", {
                    input: u
                })), s = a(w[0].childNodes[0])), t.hasOptions = v.items.length > 0 || p, t.hasOptions ? (v.items.length > 0 ? (r = x && t.getOption(x), 
                r && r.length ? q = r : "single" === t.settings.mode && t.items.length && (q = t.getOption(t.items[0])), 
                q && q.length || (q = s && !t.settings.addPrecedence ? t.getAdjacentOption(s, 1) : w.find("[data-selectable]:first"))) : q = s, 
                t.setActiveOption(q), b && !t.isOpen && t.open()) : (t.setActiveOption(null), b && t.isOpen && t.close());
            },
            addOption: function(b) {
                var c, d, e, f = this;
                if (a.isArray(b)) for (c = 0, d = b.length; c < d; c++) f.addOption(b[c]); else (e = f.registerOption(b)) && (f.userOptions[e] = !0, 
                f.lastQuery = null, f.trigger("option_add", e, b));
            },
            registerOption: function(a) {
                var b = z(a[this.settings.valueField]);
                return "undefined" != typeof b && null !== b && !this.options.hasOwnProperty(b) && (a.$order = a.$order || ++this.order, 
                this.options[b] = a, b);
            },
            registerOptionGroup: function(a) {
                var b = z(a[this.settings.optgroupValueField]);
                return !!b && (a.$order = a.$order || ++this.order, this.optgroups[b] = a, b);
            },
            addOptionGroup: function(a, b) {
                b[this.settings.optgroupValueField] = a, (a = this.registerOptionGroup(b)) && this.trigger("optgroup_add", a, b);
            },
            removeOptionGroup: function(a) {
                this.optgroups.hasOwnProperty(a) && (delete this.optgroups[a], this.renderCache = {}, 
                this.trigger("optgroup_remove", a));
            },
            clearOptionGroups: function() {
                this.optgroups = {}, this.renderCache = {}, this.trigger("optgroup_clear");
            },
            updateOption: function(b, c) {
                var d, e, f, g, h, i, j, k = this;
                if (b = z(b), f = z(c[k.settings.valueField]), null !== b && k.options.hasOwnProperty(b)) {
                    if ("string" != typeof f) throw new Error("Value must be set in option data");
                    j = k.options[b].$order, f !== b && (delete k.options[b], g = k.items.indexOf(b), 
                    -1 !== g && k.items.splice(g, 1, f)), c.$order = c.$order || j, k.options[f] = c, 
                    h = k.renderCache.item, i = k.renderCache.option, h && (delete h[b], delete h[f]), 
                    i && (delete i[b], delete i[f]), -1 !== k.items.indexOf(f) && (d = k.getItem(b), 
                    e = a(k.render("item", c)), d.hasClass("active") && e.addClass("active"), d.replaceWith(e)), 
                    k.lastQuery = null, k.isOpen && k.refreshOptions(!1);
                }
            },
            removeOption: function(a, b) {
                var c = this;
                a = z(a);
                var d = c.renderCache.item, e = c.renderCache.option;
                d && delete d[a], e && delete e[a], delete c.userOptions[a], delete c.options[a], 
                c.lastQuery = null, c.trigger("option_remove", a), c.removeItem(a, b);
            },
            clearOptions: function() {
                var a = this;
                a.loadedSearches = {}, a.userOptions = {}, a.renderCache = {}, a.options = a.sifter.items = {}, 
                a.lastQuery = null, a.trigger("option_clear"), a.clear();
            },
            getOption: function(a) {
                return this.getElementWithValue(a, this.$dropdown_content.find("[data-selectable]"));
            },
            getAdjacentOption: function(b, c) {
                var d = this.$dropdown.find("[data-selectable]"), e = d.index(b) + c;
                return e >= 0 && e < d.length ? d.eq(e) : a();
            },
            getElementWithValue: function(b, c) {
                if (b = z(b), "undefined" != typeof b && null !== b) for (var d = 0, e = c.length; d < e; d++) if (c[d].getAttribute("data-value") === b) return a(c[d]);
                return a();
            },
            getItem: function(a) {
                return this.getElementWithValue(a, this.$control.children());
            },
            addItems: function(b, c) {
                for (var d = a.isArray(b) ? b : [ b ], e = 0, f = d.length; e < f; e++) this.isPending = e < f - 1, 
                this.addItem(d[e], c);
            },
            addItem: function(b, c) {
                var d = c ? [] : [ "change" ];
                E(this, d, (function() {
                    var d, e, f, g, h, i = this, j = i.settings.mode;
                    return b = z(b), -1 !== i.items.indexOf(b) ? void ("single" === j && i.close()) : void (i.options.hasOwnProperty(b) && ("single" === j && i.clear(c), 
                    "multi" === j && i.isFull() || (d = a(i.render("item", i.options[b])), h = i.isFull(), 
                    i.items.splice(i.caretPos, 0, b), i.insertAtCaret(d), (!i.isPending || !h && i.isFull()) && i.refreshState(), 
                    i.isSetup && (f = i.$dropdown_content.find("[data-selectable]"), i.isPending || (e = i.getOption(b), 
                    g = i.getAdjacentOption(e, 1).attr("data-value"), i.refreshOptions(i.isFocused && "single" !== j), 
                    g && i.setActiveOption(i.getOption(g))), !f.length || i.isFull() ? i.close() : i.positionDropdown(), 
                    i.updatePlaceholder(), i.trigger("item_add", b, d), i.updateOriginalInput({
                        silent: c
                    })))));
                }));
            },
            removeItem: function(b, c) {
                var d, e, f, g = this;
                d = b instanceof a ? b : g.getItem(b), b = z(d.attr("data-value")), e = g.items.indexOf(b), 
                -1 !== e && (d.remove(), d.hasClass("active") && (f = g.$activeItems.indexOf(d[0]), 
                g.$activeItems.splice(f, 1)), g.items.splice(e, 1), g.lastQuery = null, !g.settings.persist && g.userOptions.hasOwnProperty(b) && g.removeOption(b, c), 
                e < g.caretPos && g.setCaret(g.caretPos - 1), g.refreshState(), g.updatePlaceholder(), 
                g.updateOriginalInput({
                    silent: c
                }), g.positionDropdown(), g.trigger("item_remove", b, d));
            },
            createItem: function(b, c) {
                var d = this, e = d.caretPos;
                b = b || a.trim(d.$control_input.val() || "");
                var f = arguments[arguments.length - 1];
                if ("function" != typeof f && (f = function() {}), "boolean" != typeof c && (c = !0), 
                !d.canCreate(b)) return f(), !1;
                d.lock();
                var g = "function" == typeof d.settings.create ? this.settings.create : function(a) {
                    var b = {};
                    return b[d.settings.labelField] = a, b[d.settings.valueField] = a, b;
                }, h = C((function(a) {
                    if (d.unlock(), !a || "object" != typeof a) return f();
                    var b = z(a[d.settings.valueField]);
                    return "string" != typeof b ? f() : (d.setTextboxValue(""), d.addOption(a), d.setCaret(e), 
                    d.addItem(b), d.refreshOptions(c && "single" !== d.settings.mode), void f(a));
                })), i = g.apply(this, [ b, h ]);
                return "undefined" != typeof i && h(i), !0;
            },
            refreshItems: function() {
                this.lastQuery = null, this.isSetup && this.addItem(this.items), this.refreshState(), 
                this.updateOriginalInput();
            },
            refreshState: function() {
                this.refreshValidityState(), this.refreshClasses();
            },
            refreshValidityState: function() {
                if (!this.isRequired) return !1;
                var a = !this.items.length;
                this.isInvalid = a, this.$control_input.prop("required", a), this.$input.prop("required", !a);
            },
            refreshClasses: function() {
                var b = this, c = b.isFull(), d = b.isLocked;
                b.$wrapper.toggleClass("rtl", b.rtl), b.$control.toggleClass("focus", b.isFocused).toggleClass("disabled", b.isDisabled).toggleClass("required", b.isRequired).toggleClass("invalid", b.isInvalid).toggleClass("locked", d).toggleClass("full", c).toggleClass("not-full", !c).toggleClass("input-active", b.isFocused && !b.isInputHidden).toggleClass("dropdown-active", b.isOpen).toggleClass("has-options", !a.isEmptyObject(b.options)).toggleClass("has-items", b.items.length > 0), 
                b.$control_input.data("grow", !c && !d);
            },
            isFull: function() {
                return null !== this.settings.maxItems && this.items.length >= this.settings.maxItems;
            },
            updateOriginalInput: function(a) {
                var b, c, d, e, f = this;
                if (a = a || {}, f.tagType === v) {
                    for (d = [], b = 0, c = f.items.length; b < c; b++) e = f.options[f.items[b]][f.settings.labelField] || "", 
                    d.push('<option value="' + A(f.items[b]) + '" selected="selected">' + A(e) + "</option>");
                    d.length || this.$input.attr("multiple") || d.push('<option value="" selected="selected"></option>'), 
                    f.$input.html(d.join(""));
                } else f.$input.val(f.getValue()), f.$input.attr("value", f.$input.val());
                f.isSetup && (a.silent || f.trigger("change", f.$input.val()));
            },
            updatePlaceholder: function() {
                if (this.settings.placeholder) {
                    var a = this.$control_input;
                    this.items.length ? a.removeAttr("placeholder") : a.attr("placeholder", this.settings.placeholder), 
                    a.triggerHandler("update", {
                        force: !0
                    });
                }
            },
            open: function() {
                var a = this;
                a.isLocked || a.isOpen || "multi" === a.settings.mode && a.isFull() || (a.focus(), 
                a.isOpen = !0, a.refreshState(), a.$dropdown.css({
                    visibility: "hidden",
                    display: "block"
                }), a.positionDropdown(), a.$dropdown.css({
                    visibility: "visible"
                }), a.trigger("dropdown_open", a.$dropdown));
            },
            close: function() {
                var a = this, b = a.isOpen;
                "single" === a.settings.mode && a.items.length && (a.hideInput(), a.$control_input.blur()), 
                a.isOpen = !1, a.$dropdown.hide(), a.setActiveOption(null), a.refreshState(), b && a.trigger("dropdown_close", a.$dropdown);
            },
            positionDropdown: function() {
                var a = this.$control, b = "body" === this.settings.dropdownParent ? a.offset() : a.position();
                b.top += a.outerHeight(!0), this.$dropdown.css({
                    width: a.outerWidth(),
                    top: b.top,
                    left: b.left
                });
            },
            clear: function(a) {
                var b = this;
                b.items.length && (b.$control.children(":not(input)").remove(), b.items = [], b.lastQuery = null, 
                b.setCaret(0), b.setActiveItem(null), b.updatePlaceholder(), b.updateOriginalInput({
                    silent: a
                }), b.refreshState(), b.showInput(), b.trigger("clear"));
            },
            insertAtCaret: function(b) {
                var c = Math.min(this.caretPos, this.items.length);
                0 === c ? this.$control.prepend(b) : a(this.$control[0].childNodes[c]).before(b), 
                this.setCaret(c + 1);
            },
            deleteSelection: function(b) {
                var c, d, e, f, g, h, i, j, k, l = this;
                if (e = b && b.keyCode === p ? -1 : 1, f = G(l.$control_input[0]), l.$activeOption && !l.settings.hideSelected && (i = l.getAdjacentOption(l.$activeOption, -1).attr("data-value")), 
                g = [], l.$activeItems.length) {
                    for (k = l.$control.children(".active:" + (e > 0 ? "last" : "first")), h = l.$control.children(":not(input)").index(k), 
                    e > 0 && h++, c = 0, d = l.$activeItems.length; c < d; c++) g.push(a(l.$activeItems[c]).attr("data-value"));
                    b && (b.preventDefault(), b.stopPropagation());
                } else (l.isFocused || "single" === l.settings.mode) && l.items.length && (e < 0 && 0 === f.start && 0 === f.length ? g.push(l.items[l.caretPos - 1]) : e > 0 && f.start === l.$control_input.val().length && g.push(l.items[l.caretPos]));
                if (!g.length || "function" == typeof l.settings.onDelete && !1 === l.settings.onDelete.apply(l, [ g ])) return !1;
                for ("undefined" != typeof h && l.setCaret(h); g.length; ) l.removeItem(g.pop());
                return l.showInput(), l.positionDropdown(), l.refreshOptions(!0), i && (j = l.getOption(i), 
                j.length && l.setActiveOption(j)), !0;
            },
            advanceSelection: function(a, b) {
                var c, d, e, f, g, h, i = this;
                0 !== a && (i.rtl && (a *= -1), c = a > 0 ? "last" : "first", d = G(i.$control_input[0]), 
                i.isFocused && !i.isInputHidden ? (f = i.$control_input.val().length, g = a < 0 ? 0 === d.start && 0 === d.length : d.start === f, 
                g && !f && i.advanceCaret(a, b)) : (h = i.$control.children(".active:" + c), h.length && (e = i.$control.children(":not(input)").index(h), 
                i.setActiveItem(null), i.setCaret(a > 0 ? e + 1 : e))));
            },
            advanceCaret: function(a, b) {
                var c, d, e = this;
                0 !== a && (c = a > 0 ? "next" : "prev", e.isShiftDown ? (d = e.$control_input[c](), 
                d.length && (e.hideInput(), e.setActiveItem(d), b && b.preventDefault())) : e.setCaret(e.caretPos + a));
            },
            setCaret: function(b) {
                var c = this;
                if (b = "single" === c.settings.mode ? c.items.length : Math.max(0, Math.min(c.items.length, b)), 
                !c.isPending) {
                    var d, e, f, g;
                    for (f = c.$control.children(":not(input)"), d = 0, e = f.length; d < e; d++) g = a(f[d]).detach(), 
                    d < b ? c.$control_input.before(g) : c.$control.append(g);
                }
                c.caretPos = b;
            },
            lock: function() {
                this.close(), this.isLocked = !0, this.refreshState();
            },
            unlock: function() {
                this.isLocked = !1, this.refreshState();
            },
            disable: function() {
                var a = this;
                a.$input.prop("disabled", !0), a.$control_input.prop("disabled", !0).prop("tabindex", -1), 
                a.isDisabled = !0, a.lock();
            },
            enable: function() {
                var a = this;
                a.$input.prop("disabled", !1), a.$control_input.prop("disabled", !1).prop("tabindex", a.tabIndex), 
                a.isDisabled = !1, a.unlock();
            },
            destroy: function() {
                var b = this, c = b.eventNS, d = b.revertSettings;
                b.trigger("destroy"), b.off(), b.$wrapper.remove(), b.$dropdown.remove(), b.$input.html("").append(d.$children).removeAttr("tabindex").removeClass("selectized").attr({
                    tabindex: d.tabindex
                }).show(), b.$control_input.removeData("grow"), b.$input.removeData("selectize"), 
                a(window).off(c), a(document).off(c), a(document.body).off(c), delete b.$input[0].selectize;
            },
            render: function(b, c) {
                var d, e, f = "", g = !1, h = this;
                return "option" !== b && "item" !== b || (d = z(c[h.settings.valueField]), g = !!d), 
                g && (y(h.renderCache[b]) || (h.renderCache[b] = {}), h.renderCache[b].hasOwnProperty(d)) ? h.renderCache[b][d] : (f = a(h.settings.render[b].apply(this, [ c, A ])), 
                "option" === b || "option_create" === b ? f.attr("data-selectable", "") : "optgroup" === b && (e = c[h.settings.optgroupValueField] || "", 
                f.attr("data-group", e)), "option" !== b && "item" !== b || f.attr("data-value", d || ""), 
                g && (h.renderCache[b][d] = f[0]), f[0]);
            },
            clearCache: function(a) {
                var b = this;
                "undefined" == typeof a ? b.renderCache = {} : delete b.renderCache[a];
            },
            canCreate: function(a) {
                var b = this;
                if (!b.settings.create) return !1;
                var c = b.settings.createFilter;
                return a.length && ("function" != typeof c || c.apply(b, [ a ])) && ("string" != typeof c || new RegExp(c).test(a)) && (!(c instanceof RegExp) || c.test(a));
            }
        }), M.count = 0, M.defaults = {
            options: [],
            optgroups: [],
            plugins: [],
            delimiter: ",",
            splitOn: null,
            persist: !0,
            diacritics: !0,
            create: !1,
            createOnBlur: !1,
            createFilter: null,
            highlight: !0,
            openOnFocus: !0,
            maxOptions: 1e3,
            maxItems: null,
            hideSelected: null,
            addPrecedence: !1,
            selectOnTab: !1,
            preload: !1,
            allowEmptyOption: !1,
            closeAfterSelect: !1,
            scrollDuration: 60,
            loadThrottle: 300,
            loadingClass: "loading",
            dataAttr: "data-data",
            optgroupField: "optgroup",
            valueField: "value",
            labelField: "text",
            optgroupLabelField: "label",
            optgroupValueField: "value",
            lockOptgroupOrder: !1,
            sortField: "$order",
            searchField: [ "text" ],
            searchConjunction: "and",
            mode: null,
            wrapperClass: "selectize-control",
            inputClass: "selectize-input",
            dropdownClass: "selectize-dropdown",
            dropdownContentClass: "selectize-dropdown-content",
            dropdownParent: null,
            copyClassesToDropdown: !0,
            render: {}
        }, a.fn.selectize = function(b) {
            var c = a.fn.selectize.defaults, d = a.extend({}, c, b), e = d.dataAttr, f = d.labelField, g = d.valueField, h = d.optgroupField, i = d.optgroupLabelField, j = d.optgroupValueField, k = function(b, c) {
                var h, i, j, k, l = b.attr(e);
                if (l) for (c.options = JSON.parse(l), h = 0, i = c.options.length; h < i; h++) c.items.push(c.options[h][g]); else {
                    var m = a.trim(b.val() || "");
                    if (!d.allowEmptyOption && !m.length) return;
                    for (j = m.split(d.delimiter), h = 0, i = j.length; h < i; h++) k = {}, k[f] = j[h], 
                    k[g] = j[h], c.options.push(k);
                    c.items = j;
                }
            }, l = function(b, c) {
                var k, l, m, n, o = c.options, p = {}, q = function(a) {
                    var b = e && a.attr(e);
                    return "string" == typeof b && b.length ? JSON.parse(b) : null;
                }, r = function(b, e) {
                    b = a(b);
                    var i = z(b.val());
                    if (i || d.allowEmptyOption) if (p.hasOwnProperty(i)) {
                        if (e) {
                            var j = p[i][h];
                            j ? a.isArray(j) ? j.push(e) : p[i][h] = [ j, e ] : p[i][h] = e;
                        }
                    } else {
                        var k = q(b) || {};
                        k[f] = k[f] || b.text(), k[g] = k[g] || i, k[h] = k[h] || e, p[i] = k, o.push(k), 
                        b.is(":selected") && c.items.push(i);
                    }
                }, s = function(b) {
                    var d, e, f, g, h;
                    for (b = a(b), f = b.attr("label"), f && (g = q(b) || {}, g[i] = f, g[j] = f, c.optgroups.push(g)), 
                    h = a("option", b), d = 0, e = h.length; d < e; d++) r(h[d], f);
                };
                for (c.maxItems = b.attr("multiple") ? null : 1, n = b.children(), k = 0, l = n.length; k < l; k++) m = n[k].tagName.toLowerCase(), 
                "optgroup" === m ? s(n[k]) : "option" === m && r(n[k]);
            };
            return this.each((function() {
                if (!this.selectize) {
                    var f = a(this), g = this.tagName.toLowerCase(), h = f.attr("placeholder") || f.attr("data-placeholder");
                    h || d.allowEmptyOption || (h = f.children('option[value=""]').text());
                    var i = {
                        placeholder: h,
                        options: [],
                        optgroups: [],
                        items: []
                    };
                    "select" === g ? l(f, i) : k(f, i), new M(f, a.extend(!0, {}, c, i, b));
                }
            }));
        }, a.fn.selectize.defaults = M.defaults, a.fn.selectize.support = {
            validity: x
        }, M.define("drag_drop", (function(b) {
            if (!a.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
            if ("multi" === this.settings.mode) {
                var c = this;
                c.lock = function() {
                    var a = c.lock;
                    return function() {
                        var b = c.$control.data("sortable");
                        return b && b.disable(), a.apply(c, arguments);
                    };
                }(), c.unlock = function() {
                    var a = c.unlock;
                    return function() {
                        var b = c.$control.data("sortable");
                        return b && b.enable(), a.apply(c, arguments);
                    };
                }(), c.setup = function() {
                    var b = c.setup;
                    return function() {
                        b.apply(this, arguments);
                        var d = c.$control.sortable({
                            items: "[data-value]",
                            forcePlaceholderSize: !0,
                            disabled: c.isLocked,
                            start: function(a, b) {
                                b.placeholder.css("width", b.helper.css("width")), d.css({
                                    overflow: "visible"
                                });
                            },
                            stop: function() {
                                d.css({
                                    overflow: "hidden"
                                });
                                var b = c.$activeItems ? c.$activeItems.slice() : null, e = [];
                                d.children("[data-value]").each((function() {
                                    e.push(a(this).attr("data-value"));
                                })), c.setValue(e), c.setActiveItem(b);
                            }
                        });
                    };
                }();
            }
        })), M.define("dropdown_header", (function(b) {
            var c = this;
            b = a.extend({
                title: "Untitled",
                headerClass: "selectize-dropdown-header",
                titleRowClass: "selectize-dropdown-header-title",
                labelClass: "selectize-dropdown-header-label",
                closeClass: "selectize-dropdown-header-close",
                html: function(a) {
                    return '<div class="' + a.headerClass + '"><div class="' + a.titleRowClass + '"><span class="' + a.labelClass + '">' + a.title + '</span><a href="javascript:void(0)" class="' + a.closeClass + '">&times;</a></div></div>';
                }
            }, b), c.setup = function() {
                var d = c.setup;
                return function() {
                    d.apply(c, arguments), c.$dropdown_header = a(b.html(b)), c.$dropdown.prepend(c.$dropdown_header);
                };
            }();
        })), M.define("optgroup_columns", (function(b) {
            var c = this;
            b = a.extend({
                equalizeWidth: !0,
                equalizeHeight: !0
            }, b), this.getAdjacentOption = function(b, c) {
                var d = b.closest("[data-group]").find("[data-selectable]"), e = d.index(b) + c;
                return e >= 0 && e < d.length ? d.eq(e) : a();
            }, this.onKeyDown = function() {
                var a = c.onKeyDown;
                return function(b) {
                    var d, e, f, g;
                    return !this.isOpen || b.keyCode !== j && b.keyCode !== m ? a.apply(this, arguments) : (c.ignoreHover = !0, 
                    g = this.$activeOption.closest("[data-group]"), d = g.find("[data-selectable]").index(this.$activeOption), 
                    g = b.keyCode === j ? g.prev("[data-group]") : g.next("[data-group]"), f = g.find("[data-selectable]"), 
                    e = f.eq(Math.min(f.length - 1, d)), void (e.length && this.setActiveOption(e)));
                };
            }();
            var d = function() {
                var a, b = d.width, c = document;
                return "undefined" == typeof b && (a = c.createElement("div"), a.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>', 
                a = a.firstChild, c.body.appendChild(a), b = d.width = a.offsetWidth - a.clientWidth, 
                c.body.removeChild(a)), b;
            }, e = function() {
                var e, f, g, h, i, j, k;
                if (k = a("[data-group]", c.$dropdown_content), f = k.length, f && c.$dropdown_content.width()) {
                    if (b.equalizeHeight) {
                        for (g = 0, e = 0; e < f; e++) g = Math.max(g, k.eq(e).height());
                        k.css({
                            height: g
                        });
                    }
                    b.equalizeWidth && (j = c.$dropdown_content.innerWidth() - d(), h = Math.round(j / f), 
                    k.css({
                        width: h
                    }), f > 1 && (i = j - h * (f - 1), k.eq(f - 1).css({
                        width: i
                    })));
                }
            };
            (b.equalizeHeight || b.equalizeWidth) && (B.after(this, "positionDropdown", e), 
            B.after(this, "refreshOptions", e));
        })), M.define("remove_button", (function(b) {
            b = a.extend({
                label: "&times;",
                title: "Remove",
                className: "remove",
                append: !0
            }, b);
            var c = function(b, c) {
                c.className = "remove-single";
                var d = b, e = '<a href="javascript:void(0)" class="' + c.className + '" tabindex="-1" title="' + A(c.title) + '">' + c.label + "</a>", f = function(a, b) {
                    return a + b;
                };
                b.setup = function() {
                    var g = d.setup;
                    return function() {
                        if (c.append) {
                            var h = a(d.$input.context).attr("id"), i = (a("#" + h), d.settings.render.item);
                            d.settings.render.item = function(a) {
                                return f(i.apply(b, arguments), e);
                            };
                        }
                        g.apply(b, arguments), b.$control.on("click", "." + c.className, (function(a) {
                            a.preventDefault(), d.isLocked || d.clear();
                        }));
                    };
                }();
            }, d = function(b, c) {
                var d = b, e = '<a href="javascript:void(0)" class="' + c.className + '" tabindex="-1" title="' + A(c.title) + '">' + c.label + "</a>", f = function(a, b) {
                    var c = a.search(/(<\/[^>]+>\s*)$/);
                    return a.substring(0, c) + b + a.substring(c);
                };
                b.setup = function() {
                    var g = d.setup;
                    return function() {
                        if (c.append) {
                            var h = d.settings.render.item;
                            d.settings.render.item = function(a) {
                                return f(h.apply(b, arguments), e);
                            };
                        }
                        g.apply(b, arguments), b.$control.on("click", "." + c.className, (function(b) {
                            if (b.preventDefault(), !d.isLocked) {
                                var c = a(b.currentTarget).parent();
                                d.setActiveItem(c), d.deleteSelection() && d.setCaret(d.items.length);
                            }
                        }));
                    };
                }();
            };
            return "single" === this.settings.mode ? void c(this, b) : void d(this, b);
        })), M.define("restore_on_backspace", (function(a) {
            var b = this;
            a.text = a.text || function(a) {
                return a[this.settings.labelField];
            }, this.onKeyDown = function() {
                var c = b.onKeyDown;
                return function(b) {
                    var d, e;
                    return b.keyCode === p && "" === this.$control_input.val() && !this.$activeItems.length && (d = this.caretPos - 1, 
                    d >= 0 && d < this.items.length) ? (e = this.options[this.items[d]], this.deleteSelection(b) && (this.setTextboxValue(a.text.apply(this, [ e ])), 
                    this.refreshOptions(!0)), void b.preventDefault()) : c.apply(this, arguments);
                };
            }();
        })), M;
    }));
    (function(factory) {
        if ("function" === typeof define && define.amd) define([ "jquery" ], factory); else if ("object" === typeof module && module.exports) module.exports = factory(require("jquery")); else factory(jQuery);
    })((function($) {
        var slice = Array.prototype.slice;
        var splice = Array.prototype.splice;
        var defaults = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: "is-sticky",
            wrapperClassName: "sticky-wrapper",
            center: false,
            getWidthFrom: "",
            widthFromWrapper: true,
            responsiveWidth: false,
            zIndex: "inherit"
        }, $window = $(window), $document = $(document), sticked = [], windowHeight = $window.height(), scroller = function() {
            var scrollTop = $window.scrollTop(), documentHeight = $document.height(), dwh = documentHeight - windowHeight, extra = scrollTop > dwh ? dwh - scrollTop : 0;
            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i], elementTop = s.stickyWrapper.offset().top, etse = elementTop - s.topSpacing - extra;
                s.stickyWrapper.css("height", s.stickyElement.outerHeight());
                if (scrollTop <= etse) {
                    if (null !== s.currentTop) {
                        s.stickyElement.css({
                            width: "",
                            position: "",
                            top: "",
                            "z-index": ""
                        });
                        s.stickyElement.parent().removeClass(s.className);
                        s.stickyElement.trigger("sticky-end", [ s ]);
                        s.currentTop = null;
                    }
                } else {
                    var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra;
                    if (newTop < 0) newTop += s.topSpacing; else newTop = s.topSpacing;
                    if (s.currentTop !== newTop) {
                        var newWidth;
                        if (s.getWidthFrom) {
                            padding = s.stickyElement.innerWidth() - s.stickyElement.width();
                            newWidth = $(s.getWidthFrom).width() - padding || null;
                        } else if (s.widthFromWrapper) newWidth = s.stickyWrapper.width();
                        if (null == newWidth) newWidth = s.stickyElement.width();
                        s.stickyElement.css("width", newWidth).css("position", "fixed").css("top", newTop).css("z-index", s.zIndex);
                        s.stickyElement.parent().addClass(s.className);
                        if (null === s.currentTop) s.stickyElement.trigger("sticky-start", [ s ]); else s.stickyElement.trigger("sticky-update", [ s ]);
                        if (s.currentTop === s.topSpacing && s.currentTop > newTop || null === s.currentTop && newTop < s.topSpacing) s.stickyElement.trigger("sticky-bottom-reached", [ s ]); else if (null !== s.currentTop && newTop === s.topSpacing && s.currentTop < newTop) s.stickyElement.trigger("sticky-bottom-unreached", [ s ]);
                        s.currentTop = newTop;
                    }
                    var stickyWrapperContainer = s.stickyWrapper.parent();
                    var unstick = s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight() && s.stickyElement.offset().top <= s.topSpacing;
                    if (unstick) s.stickyElement.css("position", "absolute").css("top", "").css("bottom", 0).css("z-index", ""); else s.stickyElement.css("position", "fixed").css("top", newTop).css("bottom", "").css("z-index", s.zIndex);
                }
            }
        }, resizer = function() {
            windowHeight = $window.height();
            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i];
                var newWidth = null;
                if (s.getWidthFrom) {
                    if (s.responsiveWidth) newWidth = $(s.getWidthFrom).width();
                } else if (s.widthFromWrapper) newWidth = s.stickyWrapper.width();
                if (null != newWidth) s.stickyElement.css("width", newWidth);
            }
        }, methods = {
            init: function(options) {
                return this.each((function() {
                    var o = $.extend({}, defaults, options);
                    var stickyElement = $(this);
                    var stickyId = stickyElement.attr("id");
                    var wrapperId = stickyId ? stickyId + "-" + defaults.wrapperClassName : defaults.wrapperClassName;
                    var wrapper = $("<div></div>").attr("id", wrapperId).addClass(o.wrapperClassName);
                    stickyElement.wrapAll((function() {
                        if (0 == $(this).parent("#" + wrapperId).length) return wrapper;
                    }));
                    var stickyWrapper = stickyElement.parent();
                    if (o.center) stickyWrapper.css({
                        width: stickyElement.outerWidth(),
                        marginLeft: "auto",
                        marginRight: "auto"
                    });
                    if ("right" === stickyElement.css("float")) stickyElement.css({
                        float: "none"
                    }).parent().css({
                        float: "right"
                    });
                    o.stickyElement = stickyElement;
                    o.stickyWrapper = stickyWrapper;
                    o.currentTop = null;
                    sticked.push(o);
                    methods.setWrapperHeight(this);
                    methods.setupChangeListeners(this);
                }));
            },
            setWrapperHeight: function(stickyElement) {
                var element = $(stickyElement);
                var stickyWrapper = element.parent();
                if (stickyWrapper) stickyWrapper.css("height", element.outerHeight());
            },
            setupChangeListeners: function(stickyElement) {
                if (window.MutationObserver) {
                    var mutationObserver = new window.MutationObserver((function(mutations) {
                        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) methods.setWrapperHeight(stickyElement);
                    }));
                    mutationObserver.observe(stickyElement, {
                        subtree: true,
                        childList: true
                    });
                } else if (window.addEventListener) {
                    stickyElement.addEventListener("DOMNodeInserted", (function() {
                        methods.setWrapperHeight(stickyElement);
                    }), false);
                    stickyElement.addEventListener("DOMNodeRemoved", (function() {
                        methods.setWrapperHeight(stickyElement);
                    }), false);
                } else if (window.attachEvent) {
                    stickyElement.attachEvent("onDOMNodeInserted", (function() {
                        methods.setWrapperHeight(stickyElement);
                    }));
                    stickyElement.attachEvent("onDOMNodeRemoved", (function() {
                        methods.setWrapperHeight(stickyElement);
                    }));
                }
            },
            update: scroller,
            unstick: function(options) {
                return this.each((function() {
                    var that = this;
                    var unstickyElement = $(that);
                    var removeIdx = -1;
                    var i = sticked.length;
                    while (i-- > 0) if (sticked[i].stickyElement.get(0) === that) {
                        splice.call(sticked, i, 1);
                        removeIdx = i;
                    }
                    if (-1 !== removeIdx) {
                        unstickyElement.unwrap();
                        unstickyElement.css({
                            width: "",
                            position: "",
                            top: "",
                            float: "",
                            "z-index": ""
                        });
                    }
                }));
            }
        };
        if (window.addEventListener) {
            window.addEventListener("scroll", scroller, false);
            window.addEventListener("resize", resizer, false);
        } else if (window.attachEvent) {
            window.attachEvent("onscroll", scroller);
            window.attachEvent("onresize", resizer);
        }
        $.fn.sticky = function(method) {
            if (methods[method]) return methods[method].apply(this, slice.call(arguments, 1)); else if ("object" === typeof method || !method) return methods.init.apply(this, arguments); else $.error("Method " + method + " does not exist on jQuery.sticky");
        };
        $.fn.unstick = function(method) {
            if (methods[method]) return methods[method].apply(this, slice.call(arguments, 1)); else if ("object" === typeof method || !method) return methods.unstick.apply(this, arguments); else $.error("Method " + method + " does not exist on jQuery.sticky");
        };
        $((function() {
            setTimeout(scroller, 0);
        }));
    }));
    !function(e) {
        e.fn.niceSelect = function(t) {
            function s(t) {
                t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class") || "").addClass(t.attr("disabled") ? "disabled" : "").attr("tabindex", t.attr("disabled") ? null : "0").html('<span class="current"></span><ul class="list"></ul>'));
                var s = t.next(), n = t.find("option"), i = t.find("option:selected");
                s.find(".current").html(i.data("display") || i.text()), n.each((function(t) {
                    var n = e(this), i = n.data("display");
                    s.find("ul").append(e("<li></li>").attr("data-value", n.val()).attr("data-display", i || null).addClass("option" + (n.is(":selected") ? " selected" : "") + (n.is(":disabled") ? " disabled" : "")).html(n.text()));
                }));
            }
            if ("string" == typeof t) return "update" == t ? this.each((function() {
                var t = e(this), n = e(this).next(".nice-select"), i = n.hasClass("open");
                n.length && (n.remove(), s(t), i && t.next().trigger("click"));
            })) : "destroy" == t ? (this.each((function() {
                var t = e(this), s = e(this).next(".nice-select");
                s.length && (s.remove(), t.css("display", ""));
            })), 0 == e(".nice-select").length && e(document).off(".nice_select")) : console.log('Method "' + t + '" does not exist.'), 
            this;
            this.hide(), this.each((function() {
                var t = e(this);
                t.next().hasClass("nice-select") || s(t);
            })), e(document).off(".nice_select"), e(document).on("click.nice_select", ".nice-select", (function(t) {
                var s = e(this);
                e(".nice-select").not(s).removeClass("open"), s.toggleClass("open"), s.hasClass("open") ? (s.find(".option"), 
                s.find(".focus").removeClass("focus"), s.find(".selected").addClass("focus")) : s.focus();
            })), e(document).on("click.nice_select", (function(t) {
                0 === e(t.target).closest(".nice-select").length && e(".nice-select").removeClass("open").find(".option");
            })), e(document).on("click.nice_select", ".nice-select .option:not(.disabled)", (function(t) {
                var s = e(this), n = s.closest(".nice-select");
                n.find(".selected").removeClass("selected"), s.addClass("selected");
                var i = s.data("display") || s.text();
                n.find(".current").text(i), n.prev("select").val(s.data("value")).trigger("change");
            })), e(document).on("keydown.nice_select", ".nice-select", (function(t) {
                var s = e(this), n = e(s.find(".focus") || s.find(".list .option.selected"));
                if (32 == t.keyCode || 13 == t.keyCode) return s.hasClass("open") ? n.trigger("click") : s.trigger("click"), 
                !1;
                if (40 == t.keyCode) {
                    if (s.hasClass("open")) {
                        var i = n.nextAll(".option:not(.disabled)").first();
                        i.length > 0 && (s.find(".focus").removeClass("focus"), i.addClass("focus"));
                    } else s.trigger("click");
                    return !1;
                }
                if (38 == t.keyCode) {
                    if (s.hasClass("open")) {
                        var l = n.prevAll(".option:not(.disabled)").first();
                        l.length > 0 && (s.find(".focus").removeClass("focus"), l.addClass("focus"));
                    } else s.trigger("click");
                    return !1;
                }
                if (27 == t.keyCode) s.hasClass("open") && s.trigger("click"); else if (9 == t.keyCode && s.hasClass("open")) return !1;
            }));
            var n = document.createElement("a").style;
            return n.cssText = "pointer-events:auto", "auto" !== n.pointerEvents && e("html").addClass("no-csspointerevents"), 
            this;
        };
    }(jQuery);
    $(document).ready((function() {
        $(".cookie-accept .fa-times").on("click", (function() {
            var ThisForm = $(this).closest(".cookie-accept");
            $.ajax({
                method: "GET",
                url: "/local/templates/real/js/cookieright/cookie.php",
                data: {
                    acceptcookieprivacy: "1"
                }
            }).done((function(msg) {
                if ("1" == msg) ThisForm.remove();
            }));
        }));
    }));
    /*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
    (function(factory) {
        if ("function" === typeof define && define.amd) define([ "jquery" ], factory); else if ("object" === typeof exports) factory(require("jquery")); else factory(jQuery);
    })((function($) {
        var pluses = /\+/g;
        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }
        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }
        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }
        function parseCookieValue(s) {
            if (0 === s.indexOf('"')) s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
            try {
                s = decodeURIComponent(s.replace(pluses, " "));
                return config.json ? JSON.parse(s) : s;
            } catch (e) {}
        }
        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        }
        var config = $.cookie = function(key, value, options) {
            if (void 0 !== value && !$.isFunction(value)) {
                options = $.extend({}, config.defaults, options);
                if ("number" === typeof options.expires) {
                    var days = options.expires, t = options.expires = new Date;
                    t.setTime(+t + 864e5 * days);
                }
                return document.cookie = [ encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : "" ].join("");
            }
            var result = key ? void 0 : {};
            var cookies = document.cookie ? document.cookie.split("; ") : [];
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split("=");
                var name = decode(parts.shift());
                var cookie = parts.join("=");
                if (key && key === name) {
                    result = read(cookie, value);
                    break;
                }
                if (!key && void 0 !== (cookie = read(cookie))) result[name] = cookie;
            }
            return result;
        };
        config.defaults = {};
        $.removeCookie = function(key, options) {
            if (void 0 === $.cookie(key)) return false;
            $.cookie(key, "", $.extend({}, options, {
                expires: -1
            }));
            return !$.cookie(key);
        };
    }));
    !function(i) {
        "use strict";
        "function" == typeof define && define.amd ? define([ "jquery" ], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery);
    }((function(i) {
        "use strict";
        var e = window.Slick || {};
        (e = function() {
            var e = 0;
            return function(t, o) {
                var s, n = this;
                n.defaults = {
                    accessibility: !0,
                    adaptiveHeight: !1,
                    appendArrows: i(t),
                    appendDots: i(t),
                    arrows: !0,
                    asNavFor: null,
                    prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                    nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                    autoplay: !1,
                    autoplaySpeed: 3e3,
                    centerMode: !1,
                    centerPadding: "50px",
                    cssEase: "ease",
                    customPaging: function(e, t) {
                        return i('<button type="button" />').text(t + 1);
                    },
                    dots: !1,
                    dotsClass: "slick-dots",
                    draggable: !0,
                    easing: "linear",
                    edgeFriction: .35,
                    fade: !1,
                    focusOnSelect: !1,
                    focusOnChange: !1,
                    infinite: !0,
                    initialSlide: 0,
                    lazyLoad: "ondemand",
                    mobileFirst: !1,
                    pauseOnHover: !0,
                    pauseOnFocus: !0,
                    pauseOnDotsHover: !1,
                    respondTo: "window",
                    responsive: null,
                    rows: 1,
                    rtl: !1,
                    slide: "",
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    swipe: !0,
                    swipeToSlide: !1,
                    touchMove: !0,
                    touchThreshold: 5,
                    useCSS: !0,
                    useTransform: !0,
                    variableWidth: !1,
                    vertical: !1,
                    verticalSwiping: !1,
                    waitForAnimate: !0,
                    zIndex: 1e3
                }, n.initials = {
                    animating: !1,
                    dragging: !1,
                    autoPlayTimer: null,
                    currentDirection: 0,
                    currentLeft: null,
                    currentSlide: 0,
                    direction: 1,
                    $dots: null,
                    listWidth: null,
                    listHeight: null,
                    loadIndex: 0,
                    $nextArrow: null,
                    $prevArrow: null,
                    scrolling: !1,
                    slideCount: null,
                    slideWidth: null,
                    $slideTrack: null,
                    $slides: null,
                    sliding: !1,
                    slideOffset: 0,
                    swipeLeft: null,
                    swiping: !1,
                    $list: null,
                    touchObject: {},
                    transformsEnabled: !1,
                    unslicked: !1
                }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, 
                n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, 
                n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, 
                n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, 
                n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, 
                n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), 
                n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", 
                n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", 
                n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), 
                n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), 
                n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), 
                n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), 
                n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), 
                n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, 
                n.registerBreakpoints(), n.init(!0);
            };
        }()).prototype.activateADA = function() {
            this.$slideTrack.find(".slick-active").attr({
                "aria-hidden": "false"
            }).find("a, input, button, select").attr({
                tabindex: "0"
            });
        }, e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
            var s = this;
            if ("boolean" == typeof t) o = t, t = null; else if (t < 0 || t >= s.slideCount) return !1;
            s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), 
            s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), 
            s.$slideTrack.append(s.$slides), s.$slides.each((function(e, t) {
                i(t).attr("data-slick-index", e);
            })), s.$slidesCache = s.$slides, s.reinit();
        }, e.prototype.animateHeight = function() {
            var i = this;
            if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
                var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
                i.$list.animate({
                    height: e
                }, i.options.speed);
            }
        }, e.prototype.animateSlide = function(e, t) {
            var o = {}, s = this;
            s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), 
            !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
                left: e
            }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
                top: e
            }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), 
            i({
                animStart: s.currentLeft
            }).animate({
                animStart: e
            }, {
                duration: s.options.speed,
                easing: s.options.easing,
                step: function(i) {
                    i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", 
                    s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o));
                },
                complete: function() {
                    t && t.call();
                }
            })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", 
            s.$slideTrack.css(o), t && setTimeout((function() {
                s.disableTransition(), t.call();
            }), s.options.speed));
        }, e.prototype.getNavTarget = function() {
            var e = this, t = e.options.asNavFor;
            return t && null !== t && (t = i(t).not(e.$slider)), t;
        }, e.prototype.asNavFor = function(e) {
            var t = this.getNavTarget();
            null !== t && "object" == typeof t && t.each((function() {
                var t = i(this).slick("getSlick");
                t.unslicked || t.slideHandler(e, !0);
            }));
        }, e.prototype.applyTransition = function(i) {
            var e = this, t = {};
            !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, 
            !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
        }, e.prototype.autoPlay = function() {
            var i = this;
            i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed));
        }, e.prototype.autoPlayClear = function() {
            var i = this;
            i.autoPlayTimer && clearInterval(i.autoPlayTimer);
        }, e.prototype.autoPlayIterator = function() {
            var i = this, e = i.currentSlide + i.options.slidesToScroll;
            i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, 
            i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e));
        }, e.prototype.buildArrows = function() {
            var e = this;
            !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), 
            e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), 
            e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), 
            e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), 
            !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true",
                tabindex: "-1"
            }));
        }, e.prototype.buildDots = function() {
            var e, t, o = this;
            if (!0 === o.options.dots) {
                for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), 
                e = 0; e <= o.getDotCount(); e += 1) t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
                o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active");
            }
        }, e.prototype.buildOut = function() {
            var e = this;
            e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), 
            e.slideCount = e.$slides.length, e.$slides.each((function(e, t) {
                i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
            })), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), 
            e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), 
            !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), 
            i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), 
            e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), 
            !0 === e.options.draggable && e.$list.addClass("draggable");
        }, e.prototype.buildRows = function() {
            var i, e, t, o, s, n, r, l = this;
            if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
                for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
                    var d = document.createElement("div");
                    for (e = 0; e < l.options.rows; e++) {
                        var a = document.createElement("div");
                        for (t = 0; t < l.options.slidesPerRow; t++) {
                            var c = i * r + (e * l.options.slidesPerRow + t);
                            n.get(c) && a.appendChild(n.get(c));
                        }
                        d.appendChild(a);
                    }
                    o.appendChild(d);
                }
                l.$slider.empty().append(o), l.$slider.children().children().children().css({
                    width: 100 / l.options.slidesPerRow + "%",
                    display: "inline-block"
                });
            }
        }, e.prototype.checkResponsive = function(e, t) {
            var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
            if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), 
            r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
                s = null;
                for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
                null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, 
                "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), 
                !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, 
                "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), 
                !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, 
                r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), 
                r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [ r, l ]);
            }
        }, e.prototype.changeSlide = function(e, t) {
            var o, s, n, r = this, l = i(e.currentTarget);
            switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, 
            o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
              case "previous":
                s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
                break;

              case "next":
                s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
                break;

              case "index":
                var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
                r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
                break;

              default:
                return;
            }
        }, e.prototype.checkNavigable = function(i) {
            var e, t;
            if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1]; else for (var o in e) {
                if (i < e[o]) {
                    i = t;
                    break;
                }
                t = e[o];
            }
            return i;
        }, e.prototype.cleanUpEvents = function() {
            var e = this;
            e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), 
            !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), 
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), 
            e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), 
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), 
            e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), 
            e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), 
            i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), 
            !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), 
            i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), 
            i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), 
            i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
        }, e.prototype.cleanUpSlideEvents = function() {
            var e = this;
            e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
        }, e.prototype.cleanUpRows = function() {
            var i, e = this;
            e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), 
            e.$slider.empty().append(i));
        }, e.prototype.clickHandler = function(i) {
            !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
        }, e.prototype.destroy = function(e) {
            var t = this;
            t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), 
            t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
            t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
            t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each((function() {
                i(this).attr("style", i(this).data("originalStyling"));
            })), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), 
            t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), 
            t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), 
            t.unslicked = !0, e || t.$slider.trigger("destroy", [ t ]);
        }, e.prototype.disableTransition = function(i) {
            var e = this, t = {};
            t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
        }, e.prototype.fadeSlide = function(i, e) {
            var t = this;
            !1 === t.cssTransitions ? (t.$slides.eq(i).css({
                zIndex: t.options.zIndex
            }), t.$slides.eq(i).animate({
                opacity: 1
            }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
                opacity: 1,
                zIndex: t.options.zIndex
            }), e && setTimeout((function() {
                t.disableTransition(i), e.call();
            }), t.options.speed));
        }, e.prototype.fadeSlideOut = function(i) {
            var e = this;
            !1 === e.cssTransitions ? e.$slides.eq(i).animate({
                opacity: 0,
                zIndex: e.options.zIndex - 2
            }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
                opacity: 0,
                zIndex: e.options.zIndex - 2
            }));
        }, e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
            var e = this;
            null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), 
            e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit());
        }, e.prototype.focusHandler = function() {
            var e = this;
            e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", (function(t) {
                t.stopImmediatePropagation();
                var o = i(this);
                setTimeout((function() {
                    e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay());
                }), 0);
            }));
        }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
            return this.currentSlide;
        }, e.prototype.getDotCount = function() {
            var i = this, e = 0, t = 0, o = 0;
            if (!0 === i.options.infinite) if (i.slideCount <= i.options.slidesToShow) ++o; else for (;e < i.slideCount; ) ++o, 
            e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else if (!0 === i.options.centerMode) o = i.slideCount; else if (i.options.asNavFor) for (;e < i.slideCount; ) ++o, 
            e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
            return o - 1;
        }, e.prototype.getLeft = function(i) {
            var e, t, o, s, n = this, r = 0;
            return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, 
            s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), 
            r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, 
            r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, 
            r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, 
            r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, 
            r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, 
            n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, 
            !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), 
            e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, 
            !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), 
            e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, 
            e += (n.$list.width() - o.outerWidth()) / 2)), e;
        }, e.prototype.getOption = e.prototype.slickGetOption = function(i) {
            return this.options[i];
        }, e.prototype.getNavigableIndexes = function() {
            var i, e = this, t = 0, o = 0, s = [];
            for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, 
            o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i; ) s.push(t), t = o + e.options.slidesToScroll, 
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            return s;
        }, e.prototype.getSlick = function() {
            return this;
        }, e.prototype.getSlideCount = function() {
            var e, t, o = this;
            return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, 
            !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each((function(s, n) {
                if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1;
            })), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
        }, e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
            this.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(i)
                }
            }, e);
        }, e.prototype.init = function(e) {
            var t = this;
            i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), 
            t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), 
            t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [ t ]), 
            !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, 
            t.autoPlay());
        }, e.prototype.initADA = function() {
            var e = this, t = Math.ceil(e.slideCount / e.options.slidesToShow), o = e.getNavigableIndexes().filter((function(i) {
                return i >= 0 && i < e.slideCount;
            }));
            e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
                "aria-hidden": "true",
                tabindex: "-1"
            }).find("a, input, button, select").attr({
                tabindex: "-1"
            }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each((function(t) {
                var s = o.indexOf(t);
                i(this).attr({
                    role: "tabpanel",
                    id: "slick-slide" + e.instanceUid + t,
                    tabindex: -1
                }), -1 !== s && i(this).attr({
                    "aria-describedby": "slick-slide-control" + e.instanceUid + s
                });
            })), e.$dots.attr("role", "tablist").find("li").each((function(s) {
                var n = o[s];
                i(this).attr({
                    role: "presentation"
                }), i(this).find("button").first().attr({
                    role: "tab",
                    id: "slick-slide-control" + e.instanceUid + s,
                    "aria-controls": "slick-slide" + e.instanceUid + n,
                    "aria-label": s + 1 + " of " + t,
                    "aria-selected": null,
                    tabindex: "-1"
                });
            })).eq(e.currentSlide).find("button").attr({
                "aria-selected": "true",
                tabindex: "0"
            }).end());
            for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) e.$slides.eq(s).attr("tabindex", 0);
            e.activateADA();
        }, e.prototype.initArrowEvents = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
                message: "previous"
            }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
                message: "next"
            }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), 
            i.$nextArrow.on("keydown.slick", i.keyHandler)));
        }, e.prototype.initDotEvents = function() {
            var e = this;
            !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
                message: "index"
            }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), 
            !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
        }, e.prototype.initSlideEvents = function() {
            var e = this;
            e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), 
            e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
        }, e.prototype.initializeEvents = function() {
            var e = this;
            e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
                action: "start"
            }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
                action: "move"
            }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), 
            !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), 
            i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), 
            i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), 
            i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition);
        }, e.prototype.initUI = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), 
            i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show();
        }, e.prototype.keyHandler = function(i) {
            var e = this;
            i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
                data: {
                    message: !0 === e.options.rtl ? "next" : "previous"
                }
            }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
                data: {
                    message: !0 === e.options.rtl ? "previous" : "next"
                }
            }));
        }, e.prototype.lazyLoad = function() {
            function e(e) {
                i("img[data-lazy]", e).each((function() {
                    var e = i(this), t = i(this).attr("data-lazy"), o = i(this).attr("data-srcset"), s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"), r = document.createElement("img");
                    r.onload = function() {
                        e.animate({
                            opacity: 0
                        }, 100, (function() {
                            o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
                                opacity: 1
                            }, 200, (function() {
                                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
                            })), n.$slider.trigger("lazyLoaded", [ n, e, t ]);
                        }));
                    }, r.onerror = function() {
                        e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
                        n.$slider.trigger("lazyLoadError", [ n, e, t ]);
                    }, r.src = t;
                }));
            }
            var t, o, s, n = this;
            if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), 
            s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, 
            s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, 
            s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) r < 0 && (r = n.slideCount - 1), 
            t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
            e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
        }, e.prototype.loadSlider = function() {
            var i = this;
            i.setPosition(), i.$slideTrack.css({
                opacity: 1
            }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
        }, e.prototype.next = e.prototype.slickNext = function() {
            this.changeSlide({
                data: {
                    message: "next"
                }
            });
        }, e.prototype.orientationChange = function() {
            var i = this;
            i.checkResponsive(), i.setPosition();
        }, e.prototype.pause = e.prototype.slickPause = function() {
            var i = this;
            i.autoPlayClear(), i.paused = !0;
        }, e.prototype.play = e.prototype.slickPlay = function() {
            var i = this;
            i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1;
        }, e.prototype.postSlide = function(e) {
            var t = this;
            t.unslicked || (t.$slider.trigger("afterChange", [ t, e ]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), 
            t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), 
            t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
        }, e.prototype.prev = e.prototype.slickPrev = function() {
            this.changeSlide({
                data: {
                    message: "previous"
                }
            });
        }, e.prototype.preventDefault = function(i) {
            i.preventDefault();
        }, e.prototype.progressiveLazyLoad = function(e) {
            e = e || 1;
            var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
            d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), 
            (r = document.createElement("img")).onload = function() {
                s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), 
                !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [ l, t, o ]), 
                l.progressiveLazyLoad();
            }, r.onerror = function() {
                e < 3 ? setTimeout((function() {
                    l.progressiveLazyLoad(e + 1);
                }), 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
                l.$slider.trigger("lazyLoadError", [ l, t, o ]), l.progressiveLazyLoad());
            }, r.src = o) : l.$slider.trigger("allImagesLoaded", [ l ]);
        }, e.prototype.refresh = function(e) {
            var t, o, s = this;
            o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), 
            s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, 
            s.destroy(!0), i.extend(s, s.initials, {
                currentSlide: t
            }), s.init(), e || s.changeSlide({
                data: {
                    message: "index",
                    index: t
                }
            }, !1);
        }, e.prototype.registerBreakpoints = function() {
            var e, t, o, s = this, n = s.options.responsive || null;
            if ("array" === i.type(n) && n.length) {
                s.respondTo = s.options.respondTo || "window";
                for (e in n) if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
                    for (t = n[e].breakpoint; o >= 0; ) s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), 
                    o--;
                    s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings;
                }
                s.breakpoints.sort((function(i, e) {
                    return s.options.mobileFirst ? i - e : e - i;
                }));
            }
        }, e.prototype.reinit = function() {
            var e = this;
            e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, 
            e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), 
            e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), 
            e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), 
            e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), 
            e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), 
            e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), 
            e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [ e ]);
        }, e.prototype.resize = function() {
            var e = this;
            i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout((function() {
                e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition();
            }), 50));
        }, e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
            var o = this;
            if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, 
            o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
            o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), 
            o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), 
            o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit();
        }, e.prototype.setCSS = function(i) {
            var e, t, o = this, s = {};
            !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", 
            t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, 
            !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", 
            o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", 
            o.$slideTrack.css(s)));
        }, e.prototype.setDimensions = function() {
            var i = this;
            !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
                padding: "0px " + i.options.centerPadding
            }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), 
            !0 === i.options.centerMode && i.$list.css({
                padding: i.options.centerPadding + " 0px"
            })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), 
            i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), 
            i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
            var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
            !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
        }, e.prototype.setFade = function() {
            var e, t = this;
            t.$slides.each((function(o, s) {
                e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
                    position: "relative",
                    right: e,
                    top: 0,
                    zIndex: t.options.zIndex - 2,
                    opacity: 0
                }) : i(s).css({
                    position: "relative",
                    left: e,
                    top: 0,
                    zIndex: t.options.zIndex - 2,
                    opacity: 0
                });
            })), t.$slides.eq(t.currentSlide).css({
                zIndex: t.options.zIndex - 1,
                opacity: 1
            });
        }, e.prototype.setHeight = function() {
            var i = this;
            if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
                var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
                i.$list.css("height", e);
            }
        }, e.prototype.setOption = e.prototype.slickSetOption = function() {
            var e, t, o, s, n, r = this, l = !1;
            if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], 
            s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), 
            "single" === n) r.options[o] = s; else if ("multiple" === n) i.each(o, (function(i, e) {
                r.options[i] = e;
            })); else if ("responsive" === n) for (t in s) if ("array" !== i.type(r.options.responsive)) r.options.responsive = [ s[t] ]; else {
                for (e = r.options.responsive.length - 1; e >= 0; ) r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), 
                e--;
                r.options.responsive.push(s[t]);
            }
            l && (r.unload(), r.reinit());
        }, e.prototype.setPosition = function() {
            var i = this;
            i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), 
            i.$slider.trigger("setPosition", [ i ]);
        }, e.prototype.setProps = function() {
            var i = this, e = document.body.style;
            i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), 
            void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), 
            i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), 
            void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", 
            i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), 
            void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", 
            i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), 
            void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", 
            i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), 
            void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", 
            i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), 
            void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", 
            i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType;
        }, e.prototype.setSlideClasses = function(i) {
            var e, t, o, s, n = this;
            if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), 
            n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
                var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
                e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, 
                t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 
                0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), 
                n.$slides.eq(i).addClass("slick-center");
            } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, 
            o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
            "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad();
        }, e.prototype.setupInfinite = function() {
            var e, t, o, s = this;
            if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, 
            s.slideCount > s.options.slidesToShow)) {
                for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, 
                e = s.slideCount; e > s.slideCount - o; e -= 1) t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
                for (e = 0; e < o + s.slideCount; e += 1) t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
                s.$slideTrack.find(".slick-cloned").find("[id]").each((function() {
                    i(this).attr("id", "");
                }));
            }
        }, e.prototype.interrupt = function(i) {
            var e = this;
            i || e.autoPlay(), e.interrupted = i;
        }, e.prototype.selectHandler = function(e) {
            var t = this, o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"), s = parseInt(o.attr("data-slick-index"));
            s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s);
        }, e.prototype.slideHandler = function(i, e, t) {
            var o, s, n, r, l, d = null, a = this;
            if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), 
            o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, 
            !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, 
            !0 !== t ? a.animateSlide(r, (function() {
                a.postSlide(o);
            })) : a.postSlide(o)); else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, 
            !0 !== t ? a.animateSlide(r, (function() {
                a.postSlide(o);
            })) : a.postSlide(o)); else {
                if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, 
                a.animating = !0, a.$slider.trigger("beforeChange", [ a, a.currentSlide, s ]), n = a.currentSlide, 
                a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), 
                a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), 
                a.fadeSlide(s, (function() {
                    a.postSlide(s);
                }))) : a.postSlide(s), void a.animateHeight();
                !0 !== t ? a.animateSlide(d, (function() {
                    a.postSlide(s);
                })) : a.postSlide(s);
            }
        }, e.prototype.startLoad = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), 
            i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), 
            i.$slider.addClass("slick-loading");
        }, e.prototype.swipeDirection = function() {
            var i, e, t, o, s = this;
            return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, 
            t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), 
            o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
        }, e.prototype.swipeEnd = function(i) {
            var e, t, o = this;
            if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
            if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;
            if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [ o, o.swipeDirection() ]), 
            o.touchObject.swipeLength >= o.touchObject.minSwipe) {
                switch (t = o.swipeDirection()) {
                  case "left":
                  case "down":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), 
                    o.currentDirection = 0;
                    break;

                  case "right":
                  case "up":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), 
                    o.currentDirection = 1;
                }
                "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [ o, t ]));
            } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), 
            o.touchObject = {});
        }, e.prototype.swipeHandler = function(i) {
            var e = this;
            if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, 
            e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), 
            i.data.action) {
              case "start":
                e.swipeStart(i);
                break;

              case "move":
                e.swipeMove(i);
                break;

              case "end":
                e.swipeEnd(i);
            }
        }, e.prototype.swipeMove = function(i) {
            var e, t, o, s, n, r, l = this;
            return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), 
            l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, 
            l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), 
            r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), 
            !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), 
            t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, 
            i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), 
            !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), 
            o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, 
            l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, 
            !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, 
            !1) : void l.setCSS(l.swipeLeft))));
        }, e.prototype.swipeStart = function(i) {
            var e, t = this;
            if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, 
            !1;
            void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), 
            t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, 
            t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, 
            t.dragging = !0;
        }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
            var i = this;
            null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), 
            i.$slidesCache.appendTo(i.$slideTrack), i.reinit());
        }, e.prototype.unload = function() {
            var e = this;
            i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), 
            e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
        }, e.prototype.unslick = function(i) {
            var e = this;
            e.$slider.trigger("unslick", [ e, i ]), e.destroy();
        }, e.prototype.updateArrows = function() {
            var i = this;
            Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 
            i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
        }, e.prototype.updateDots = function() {
            var i = this;
            null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"));
        }, e.prototype.visibility = function() {
            var i = this;
            i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1);
        }, i.fn.slick = function() {
            var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
            for (i = 0; i < r; i++) if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), 
            void 0 !== t) return t;
            return o;
        };
    }));
    !function(t, e, n, o) {
        "use strict";
        function i(t) {
            var e = t.currentTarget, o = t.data ? t.data.options : {}, i = t.data ? t.data.items : [], a = n(e).attr("data-fancybox") || "", s = 0;
            t.preventDefault(), t.stopPropagation(), a ? (i = i.length ? i.filter('[data-fancybox="' + a + '"]') : n('[data-fancybox="' + a + '"]'), 
            s = i.index(e), s < 0 && (s = 0)) : i = [ e ], n.fancybox.open(i, o, s);
        }
        if (n) {
            if (n.fn.fancybox) return void n.error("fancyBox already initialized");
            var a = {
                loop: !1,
                margin: [ 44, 0 ],
                gutter: 50,
                keyboard: !0,
                arrows: !0,
                infobar: !1,
                toolbar: !0,
                buttons: [ "slideShow", "fullScreen", "thumbs", "close" ],
                idleTime: 4,
                smallBtn: "auto",
                protect: !1,
                modal: !1,
                image: {
                    preload: "auto"
                },
                ajax: {
                    settings: {
                        data: {
                            fancybox: !0
                        }
                    }
                },
                iframe: {
                    tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
                    preload: !0,
                    css: {},
                    attr: {
                        scrolling: "auto"
                    }
                },
                animationEffect: "zoom",
                animationDuration: 366,
                zoomOpacity: "auto",
                transitionEffect: "fade",
                transitionDuration: 366,
                slideClass: "",
                baseClass: "",
                baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><button data-fancybox-prev title="{{PREV}}" class="fancybox-button fancybox-button--left"></button><div class="fancybox-infobar__body"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><button data-fancybox-next title="{{NEXT}}" class="fancybox-button fancybox-button--right"></button></div><div class="fancybox-toolbar">{{BUTTONS}}</div><div class="fancybox-navigation"><button data-fancybox-prev title="{{PREV}}" class="fancybox-arrow fancybox-arrow--left" /><button data-fancybox-next title="{{NEXT}}" class="fancybox-arrow fancybox-arrow--right" /></div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',
                spinnerTpl: '<div class="fancybox-loading"></div>',
                errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',
                btnTpl: {
                    slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
                    fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
                    thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
                    close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
                    smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
                },
                parentEl: "body",
                autoFocus: !0,
                backFocus: !0,
                trapFocus: !0,
                fullScreen: {
                    autoStart: !1
                },
                touch: {
                    vertical: !0,
                    momentum: !0
                },
                hash: null,
                media: {},
                slideShow: {
                    autoStart: !1,
                    speed: 4e3
                },
                thumbs: {
                    autoStart: !1,
                    hideOnClose: !0
                },
                onInit: n.noop,
                beforeLoad: n.noop,
                afterLoad: n.noop,
                beforeShow: n.noop,
                afterShow: n.noop,
                beforeClose: n.noop,
                afterClose: n.noop,
                onActivate: n.noop,
                onDeactivate: n.noop,
                clickContent: function(t, e) {
                    return "image" === t.type && "zoom";
                },
                clickSlide: "close",
                clickOutside: "close",
                dblclickContent: !1,
                dblclickSlide: !1,
                dblclickOutside: !1,
                mobile: {
                    clickContent: function(t, e) {
                        return "image" === t.type && "toggleControls";
                    },
                    clickSlide: function(t, e) {
                        return "image" === t.type ? "toggleControls" : "close";
                    },
                    dblclickContent: function(t, e) {
                        return "image" === t.type && "zoom";
                    },
                    dblclickSlide: function(t, e) {
                        return "image" === t.type && "zoom";
                    }
                },
                lang: "en",
                i18n: {
                    en: {
                        CLOSE: "Close",
                        NEXT: "Next",
                        PREV: "Previous",
                        ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                        PLAY_START: "Start slideshow",
                        PLAY_STOP: "Pause slideshow",
                        FULL_SCREEN: "Full screen",
                        THUMBS: "Thumbnails"
                    },
                    de: {
                        CLOSE: "Schliessen",
                        NEXT: "Weiter",
                        PREV: "ZurГјck",
                        ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es spГ¤ter nochmal.",
                        PLAY_START: "Diaschau starten",
                        PLAY_STOP: "Diaschau beenden",
                        FULL_SCREEN: "Vollbild",
                        THUMBS: "Vorschaubilder"
                    }
                }
            }, s = n(t), r = n(e), c = 0, l = function(t) {
                return t && t.hasOwnProperty && t instanceof n;
            }, u = function() {
                return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
                    return t.setTimeout(e, 1e3 / 60);
                };
            }(), d = function() {
                var t, n = e.createElement("fakeelement"), i = {
                    transition: "transitionend",
                    OTransition: "oTransitionEnd",
                    MozTransition: "transitionend",
                    WebkitTransition: "webkitTransitionEnd"
                };
                for (t in i) if (n.style[t] !== o) return i[t];
            }(), f = function(t) {
                return t && t.length && t[0].offsetHeight;
            }, h = function(t, o, i) {
                var s = this;
                s.opts = n.extend(!0, {
                    index: i
                }, a, o || {}), o && n.isArray(o.buttons) && (s.opts.buttons = o.buttons), s.id = s.opts.id || ++c, 
                s.group = [], s.currIndex = parseInt(s.opts.index, 10) || 0, s.prevIndex = null, 
                s.prevPos = null, s.currPos = 0, s.firstRun = null, s.createGroup(t), s.group.length && (s.$lastFocus = n(e.activeElement).blur(), 
                s.slides = {}, s.init(t));
            };
            n.extend(h.prototype, {
                init: function() {
                    var t, e, o, i = this, a = i.group[i.currIndex].opts;
                    i.scrollTop = r.scrollTop(), i.scrollLeft = r.scrollLeft(), n.fancybox.getInstance() || n.fancybox.isMobile || "hidden" === n("body").css("overflow") || (t = n("body").width(), 
                    n("html").addClass("fancybox-enabled"), t = n("body").width() - t, t > 1 && n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + t + "px; }</style>")), 
                    o = "", n.each(a.buttons, (function(t, e) {
                        o += a.btnTpl[e] || "";
                    })), e = n(i.translate(i, a.baseTpl.replace("{{BUTTONS}}", o))).addClass("fancybox-is-hidden").attr("id", "fancybox-container-" + i.id).addClass(a.baseClass).data("FancyBox", i).prependTo(a.parentEl), 
                    i.$refs = {
                        container: e
                    }, [ "bg", "inner", "infobar", "toolbar", "stage", "caption" ].forEach((function(t) {
                        i.$refs[t] = e.find(".fancybox-" + t);
                    })), (!a.arrows || i.group.length < 2) && e.find(".fancybox-navigation").remove(), 
                    a.infobar || i.$refs.infobar.remove(), a.toolbar || i.$refs.toolbar.remove(), i.trigger("onInit"), 
                    i.activate(), i.jumpTo(i.currIndex);
                },
                translate: function(t, e) {
                    var n = t.opts.i18n[t.opts.lang];
                    return e.replace(/\{\{(\w+)\}\}/g, (function(t, e) {
                        var i = n[e];
                        return i === o ? t : i;
                    }));
                },
                createGroup: function(t) {
                    var e = this, i = n.makeArray(t);
                    n.each(i, (function(t, i) {
                        var a, s, r, c, l = {}, u = {}, d = [];
                        n.isPlainObject(i) ? (l = i, u = i.opts || i) : "object" === n.type(i) && n(i).length ? (a = n(i), 
                        d = a.data(), u = "options" in d ? d.options : {}, u = "object" === n.type(u) ? u : {}, 
                        l.src = "src" in d ? d.src : u.src || a.attr("href"), [ "width", "height", "thumb", "type", "filter" ].forEach((function(t) {
                            t in d && (u[t] = d[t]);
                        })), "srcset" in d && (u.image = {
                            srcset: d.srcset
                        }), u.$orig = a, l.type || l.src || (l.type = "inline", l.src = i)) : l = {
                            type: "html",
                            src: i + ""
                        }, l.opts = n.extend(!0, {}, e.opts, u), n.fancybox.isMobile && (l.opts = n.extend(!0, {}, l.opts, l.opts.mobile)), 
                        s = l.type || l.opts.type, r = l.src || "", !s && r && (r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s = "image" : r.match(/\.(pdf)((\?|#).*)?$/i) ? s = "pdf" : "#" === r.charAt(0) && (s = "inline")), 
                        l.type = s, l.index = e.group.length, l.opts.$orig && !l.opts.$orig.length && delete l.opts.$orig, 
                        !l.opts.$thumb && l.opts.$orig && (l.opts.$thumb = l.opts.$orig.find("img:first")), 
                        l.opts.$thumb && !l.opts.$thumb.length && delete l.opts.$thumb, "function" === n.type(l.opts.caption) ? l.opts.caption = l.opts.caption.apply(i, [ e, l ]) : "caption" in d && (l.opts.caption = d.caption), 
                        l.opts.caption = l.opts.caption === o ? "" : l.opts.caption + "", "ajax" === s && (c = r.split(/\s+/, 2), 
                        c.length > 1 && (l.src = c.shift(), l.opts.filter = c.shift())), "auto" == l.opts.smallBtn && (n.inArray(s, [ "html", "inline", "ajax" ]) > -1 ? (l.opts.toolbar = !1, 
                        l.opts.smallBtn = !0) : l.opts.smallBtn = !1), "pdf" === s && (l.type = "iframe", 
                        l.opts.iframe.preload = !1), l.opts.modal && (l.opts = n.extend(!0, l.opts, {
                            infobar: 0,
                            toolbar: 0,
                            smallBtn: 0,
                            keyboard: 0,
                            slideShow: 0,
                            fullScreen: 0,
                            thumbs: 0,
                            touch: 0,
                            clickContent: !1,
                            clickSlide: !1,
                            clickOutside: !1,
                            dblclickContent: !1,
                            dblclickSlide: !1,
                            dblclickOutside: !1
                        })), e.group.push(l);
                    }));
                },
                addEvents: function() {
                    var o = this;
                    o.removeEvents(), o.$refs.container.on("click.fb-close", "[data-fancybox-close]", (function(t) {
                        t.stopPropagation(), t.preventDefault(), o.close(t);
                    })).on("click.fb-prev touchend.fb-prev", "[data-fancybox-prev]", (function(t) {
                        t.stopPropagation(), t.preventDefault(), o.previous();
                    })).on("click.fb-next touchend.fb-next", "[data-fancybox-next]", (function(t) {
                        t.stopPropagation(), t.preventDefault(), o.next();
                    })), s.on("orientationchange.fb resize.fb", (function(t) {
                        t && t.originalEvent && "resize" === t.originalEvent.type ? u((function() {
                            o.update();
                        })) : (o.$refs.stage.hide(), setTimeout((function() {
                            o.$refs.stage.show(), o.update();
                        }), 500));
                    })), r.on("focusin.fb", (function(t) {
                        var i = n.fancybox ? n.fancybox.getInstance() : null;
                        i.isClosing || !i.current || !i.current.opts.trapFocus || n(t.target).hasClass("fancybox-container") || n(t.target).is(e) || i && "fixed" !== n(t.target).css("position") && !i.$refs.container.has(t.target).length && (t.stopPropagation(), 
                        i.focus(), s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft));
                    })), r.on("keydown.fb", (function(t) {
                        var e = o.current, i = t.keyCode || t.which;
                        if (e && e.opts.keyboard && !n(t.target).is("input") && !n(t.target).is("textarea")) return 8 === i || 27 === i ? (t.preventDefault(), 
                        void o.close(t)) : 37 === i || 38 === i ? (t.preventDefault(), void o.previous()) : 39 === i || 40 === i ? (t.preventDefault(), 
                        void o.next()) : void o.trigger("afterKeydown", t, i);
                    })), o.group[o.currIndex].opts.idleTime && (o.idleSecondsCounter = 0, r.on("mousemove.fb-idle mouseenter.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", (function() {
                        o.idleSecondsCounter = 0, o.isIdle && o.showControls(), o.isIdle = !1;
                    })), o.idleInterval = t.setInterval((function() {
                        o.idleSecondsCounter++, o.idleSecondsCounter >= o.group[o.currIndex].opts.idleTime && (o.isIdle = !0, 
                        o.idleSecondsCounter = 0, o.hideControls());
                    }), 1e3));
                },
                removeEvents: function() {
                    var e = this;
                    s.off("orientationchange.fb resize.fb"), r.off("focusin.fb keydown.fb .fb-idle"), 
                    this.$refs.container.off(".fb-close .fb-prev .fb-next"), e.idleInterval && (t.clearInterval(e.idleInterval), 
                    e.idleInterval = null);
                },
                previous: function(t) {
                    return this.jumpTo(this.currPos - 1, t);
                },
                next: function(t) {
                    return this.jumpTo(this.currPos + 1, t);
                },
                jumpTo: function(t, e, i) {
                    var a, s, r, c, l, u, d, h = this, p = h.group.length;
                    if (!(h.isSliding || h.isClosing || h.isAnimating && h.firstRun)) {
                        if (t = parseInt(t, 10), s = h.current ? h.current.opts.loop : h.opts.loop, !s && (t < 0 || t >= p)) return !1;
                        if (a = h.firstRun = null === h.firstRun, !(p < 2 && !a && h.isSliding)) {
                            if (c = h.current, h.prevIndex = h.currIndex, h.prevPos = h.currPos, r = h.createSlide(t), 
                            p > 1 && ((s || r.index > 0) && h.createSlide(t - 1), (s || r.index < p - 1) && h.createSlide(t + 1)), 
                            h.current = r, h.currIndex = r.index, h.currPos = r.pos, h.trigger("beforeShow", a), 
                            h.updateControls(), u = n.fancybox.getTranslate(r.$slide), r.isMoved = (0 !== u.left || 0 !== u.top) && !r.$slide.hasClass("fancybox-animated"), 
                            r.forcedDuration = o, n.isNumeric(e) ? r.forcedDuration = e : e = r.opts[a ? "animationDuration" : "transitionDuration"], 
                            e = parseInt(e, 10), a) return r.opts.animationEffect && e && h.$refs.container.css("transition-duration", e + "ms"), 
                            h.$refs.container.removeClass("fancybox-is-hidden"), f(h.$refs.container), h.$refs.container.addClass("fancybox-is-open"), 
                            r.$slide.addClass("fancybox-slide--current"), h.loadSlide(r), void h.preload();
                            n.each(h.slides, (function(t, e) {
                                n.fancybox.stop(e.$slide);
                            })), r.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"), 
                            r.isMoved ? (l = Math.round(r.$slide.width()), n.each(h.slides, (function(t, o) {
                                var i = o.pos - r.pos;
                                n.fancybox.animate(o.$slide, {
                                    top: 0,
                                    left: i * l + i * o.opts.gutter
                                }, e, (function() {
                                    o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"), 
                                    o.pos === h.currPos && (r.isMoved = !1, h.complete());
                                }));
                            }))) : h.$refs.stage.children().removeAttr("style"), r.isLoaded ? h.revealContent(r) : h.loadSlide(r), 
                            h.preload(), c.pos !== r.pos && (d = "fancybox-slide--" + (c.pos > r.pos ? "next" : "previous"), 
                            c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"), 
                            c.isComplete = !1, e && (r.isMoved || r.opts.transitionEffect) && (r.isMoved ? c.$slide.addClass(d) : (d = "fancybox-animated " + d + " fancybox-fx-" + r.opts.transitionEffect, 
                            n.fancybox.animate(c.$slide, d, e, (function() {
                                c.$slide.removeClass(d).removeAttr("style");
                            })))));
                        }
                    }
                },
                createSlide: function(t) {
                    var e, o, i = this;
                    return o = t % i.group.length, o = o < 0 ? i.group.length + o : o, !i.slides[t] && i.group[o] && (e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage), 
                    i.slides[t] = n.extend(!0, {}, i.group[o], {
                        pos: t,
                        $slide: e,
                        isLoaded: !1
                    }), i.updateSlide(i.slides[t])), i.slides[t];
                },
                scaleToActual: function(t, e, i) {
                    var a, s, r, c, l, u = this, d = u.current, f = d.$content, h = parseInt(d.$slide.width(), 10), p = parseInt(d.$slide.height(), 10), g = d.width, b = d.height;
                    "image" != d.type || d.hasError || !f || u.isAnimating || (n.fancybox.stop(f), u.isAnimating = !0, 
                    t = t === o ? .5 * h : t, e = e === o ? .5 * p : e, a = n.fancybox.getTranslate(f), 
                    c = g / a.width, l = b / a.height, s = .5 * h - .5 * g, r = .5 * p - .5 * b, g > h && (s = a.left * c - (t * c - t), 
                    s > 0 && (s = 0), s < h - g && (s = h - g)), b > p && (r = a.top * l - (e * l - e), 
                    r > 0 && (r = 0), r < p - b && (r = p - b)), u.updateCursor(g, b), n.fancybox.animate(f, {
                        top: r,
                        left: s,
                        scaleX: c,
                        scaleY: l
                    }, i || 330, (function() {
                        u.isAnimating = !1;
                    })), u.SlideShow && u.SlideShow.isActive && u.SlideShow.stop());
                },
                scaleToFit: function(t) {
                    var e, o = this, i = o.current, a = i.$content;
                    "image" != i.type || i.hasError || !a || o.isAnimating || (n.fancybox.stop(a), o.isAnimating = !0, 
                    e = o.getFitPos(i), o.updateCursor(e.width, e.height), n.fancybox.animate(a, {
                        top: e.top,
                        left: e.left,
                        scaleX: e.width / a.width(),
                        scaleY: e.height / a.height()
                    }, t || 330, (function() {
                        o.isAnimating = !1;
                    })));
                },
                getFitPos: function(t) {
                    var e, o, i, a, r, c = this, l = t.$content, u = t.width, d = t.height, f = t.opts.margin;
                    return !(!l || !l.length || !u && !d) && ("number" === n.type(f) && (f = [ f, f ]), 
                    2 == f.length && (f = [ f[0], f[1], f[0], f[1] ]), s.width() < 800 && (f = [ 0, 0, 0, 0 ]), 
                    e = parseInt(c.$refs.stage.width(), 10) - (f[1] + f[3]), o = parseInt(c.$refs.stage.height(), 10) - (f[0] + f[2]), 
                    i = Math.min(1, e / u, o / d), a = Math.floor(i * u), r = Math.floor(i * d), {
                        top: Math.floor(.5 * (o - r)) + f[0],
                        left: Math.floor(.5 * (e - a)) + f[3],
                        width: a,
                        height: r
                    });
                },
                update: function() {
                    var t = this;
                    n.each(t.slides, (function(e, n) {
                        t.updateSlide(n);
                    }));
                },
                updateSlide: function(t) {
                    var e = this, o = t.$content;
                    o && (t.width || t.height) && (n.fancybox.stop(o), n.fancybox.setTranslate(o, e.getFitPos(t)), 
                    t.pos === e.currPos && e.updateCursor()), t.$slide.trigger("refresh"), e.trigger("onUpdate", t);
                },
                updateCursor: function(t, e) {
                    var n, i = this, a = i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut");
                    i.current && !i.isClosing && (i.isZoomable() ? (a.addClass("fancybox-is-zoomable"), 
                    n = t !== o && e !== o ? t < i.current.width && e < i.current.height : i.isScaledDown(), 
                    n ? a.addClass("fancybox-can-zoomIn") : i.current.opts.touch ? a.addClass("fancybox-can-drag") : a.addClass("fancybox-can-zoomOut")) : i.current.opts.touch && a.addClass("fancybox-can-drag"));
                },
                isZoomable: function() {
                    var t, e = this, o = e.current;
                    if (o && !e.isClosing) return !!("image" === o.type && o.isLoaded && !o.hasError && ("zoom" === o.opts.clickContent || n.isFunction(o.opts.clickContent) && "zoom" === o.opts.clickContent(o)) && (t = e.getFitPos(o), 
                    o.width > t.width || o.height > t.height));
                },
                isScaledDown: function() {
                    var t = this, e = t.current, o = e.$content, i = !1;
                    return o && (i = n.fancybox.getTranslate(o), i = i.width < e.width || i.height < e.height), 
                    i;
                },
                canPan: function() {
                    var t = this, e = t.current, n = e.$content, o = !1;
                    return n && (o = t.getFitPos(e), o = Math.abs(n.width() - o.width) > 1 || Math.abs(n.height() - o.height) > 1), 
                    o;
                },
                loadSlide: function(t) {
                    var e, o, i, a = this;
                    if (!t.isLoading && !t.isLoaded) {
                        switch (t.isLoading = !0, a.trigger("beforeLoad", t), e = t.type, o = t.$slide, 
                        o.off("refresh").trigger("onReset").addClass("fancybox-slide--" + (e || "unknown")).addClass(t.opts.slideClass), 
                        e) {
                          case "image":
                            a.setImage(t);
                            break;

                          case "iframe":
                            a.setIframe(t);
                            break;

                          case "html":
                            a.setContent(t, t.src || t.content);
                            break;

                          case "inline":
                            n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t);
                            break;

                          case "ajax":
                            a.showLoading(t), i = n.ajax(n.extend({}, t.opts.ajax.settings, {
                                url: t.src,
                                success: function(e, n) {
                                    "success" === n && a.setContent(t, e);
                                },
                                error: function(e, n) {
                                    e && "abort" !== n && a.setError(t);
                                }
                            })), o.one("onReset", (function() {
                                i.abort();
                            }));
                            break;

                          default:
                            a.setError(t);
                        }
                        return !0;
                    }
                },
                setImage: function(e) {
                    var o, i, a, s, r = this, c = e.opts.image.srcset;
                    if (c) {
                        a = t.devicePixelRatio || 1, s = t.innerWidth * a, i = c.split(",").map((function(t) {
                            var e = {};
                            return t.trim().split(/\s+/).forEach((function(t, n) {
                                var o = parseInt(t.substring(0, t.length - 1), 10);
                                return 0 === n ? e.url = t : void (o && (e.value = o, e.postfix = t[t.length - 1]));
                            })), e;
                        })), i.sort((function(t, e) {
                            return t.value - e.value;
                        }));
                        for (var l = 0; l < i.length; l++) {
                            var u = i[l];
                            if ("w" === u.postfix && u.value >= s || "x" === u.postfix && u.value >= a) {
                                o = u;
                                break;
                            }
                        }
                        !o && i.length && (o = i[i.length - 1]), o && (e.src = o.url, e.width && e.height && "w" == o.postfix && (e.height = e.width / e.height * o.value, 
                        e.width = o.value));
                    }
                    e.$content = n('<div class="fancybox-image-wrap"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide), 
                    !1 !== e.opts.preload && e.opts.width && e.opts.height && (e.opts.thumb || e.opts.$thumb) ? (e.width = e.opts.width, 
                    e.height = e.opts.height, e.$ghost = n("<img />").one("error", (function() {
                        n(this).remove(), e.$ghost = null, r.setBigImage(e);
                    })).one("load", (function() {
                        r.afterLoad(e), r.setBigImage(e);
                    })).addClass("fancybox-image").appendTo(e.$content).attr("src", e.opts.thumb || e.opts.$thumb.attr("src"))) : r.setBigImage(e);
                },
                setBigImage: function(t) {
                    var e = this, o = n("<img />");
                    t.$image = o.one("error", (function() {
                        e.setError(t);
                    })).one("load", (function() {
                        clearTimeout(t.timouts), t.timouts = null, e.isClosing || (t.width = this.naturalWidth, 
                        t.height = this.naturalHeight, t.opts.image.srcset && o.attr("sizes", "100vw").attr("srcset", t.opts.image.srcset), 
                        e.hideLoading(t), t.$ghost ? t.timouts = setTimeout((function() {
                            t.timouts = null, t.$ghost.hide();
                        }), Math.min(300, Math.max(1e3, t.height / 1600))) : e.afterLoad(t));
                    })).addClass("fancybox-image").attr("src", t.src).appendTo(t.$content), o[0].complete ? o.trigger("load") : o[0].error ? o.trigger("error") : t.timouts = setTimeout((function() {
                        o[0].complete || t.hasError || e.showLoading(t);
                    }), 100);
                },
                setIframe: function(t) {
                    var e, i = this, a = t.opts.iframe, s = t.$slide;
                    t.$content = n('<div class="fancybox-content' + (a.preload ? " fancybox-is-hidden" : "") + '"></div>').css(a.css).appendTo(s), 
                    e = n(a.tpl.replace(/\{rnd\}/g, (new Date).getTime())).attr(a.attr).appendTo(t.$content), 
                    a.preload ? (i.showLoading(t), e.on("load.fb error.fb", (function(e) {
                        this.isReady = 1, t.$slide.trigger("refresh"), i.afterLoad(t);
                    })), s.on("refresh.fb", (function() {
                        var n, i, s, r, c, l = t.$content;
                        if (1 === e[0].isReady) {
                            try {
                                n = e.contents(), i = n.find("body");
                            } catch (t) {}
                            i && i.length && (a.css.width === o || a.css.height === o) && (s = e[0].contentWindow.document.documentElement.scrollWidth, 
                            r = Math.ceil(i.outerWidth(!0) + (l.width() - s)), c = Math.ceil(i.outerHeight(!0)), 
                            l.css({
                                width: a.css.width === o ? r + (l.outerWidth() - l.innerWidth()) : a.css.width,
                                height: a.css.height === o ? c + (l.outerHeight() - l.innerHeight()) : a.css.height
                            })), l.removeClass("fancybox-is-hidden");
                        }
                    }))) : this.afterLoad(t), e.attr("src", t.src), !0 === t.opts.smallBtn && t.$content.prepend(i.translate(t, t.opts.btnTpl.smallBtn)), 
                    s.one("onReset", (function() {
                        try {
                            n(this).find("iframe").hide().attr("src", "//about:blank");
                        } catch (t) {}
                        n(this).empty(), t.isLoaded = !1;
                    }));
                },
                setContent: function(t, e) {
                    var o = this;
                    o.isClosing || (o.hideLoading(t), t.$slide.empty(), l(e) && e.parent().length ? (e.parent(".fancybox-slide--inline").trigger("onReset"), 
                    t.$placeholder = n("<div></div>").hide().insertAfter(e), e.css("display", "inline-block")) : t.hasError || ("string" === n.type(e) && (e = n("<div>").append(n.trim(e)).contents(), 
                    3 === e[0].nodeType && (e = n("<div>").html(e))), t.opts.filter && (e = n("<div>").html(e).find(t.opts.filter))), 
                    t.$slide.one("onReset", (function() {
                        t.$placeholder && (t.$placeholder.after(e.hide()).remove(), t.$placeholder = null), 
                        t.$smallBtn && (t.$smallBtn.remove(), t.$smallBtn = null), t.hasError || (n(this).empty(), 
                        t.isLoaded = !1);
                    })), t.$content = n(e).appendTo(t.$slide), t.opts.smallBtn && !t.$smallBtn && (t.$smallBtn = n(o.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content)), 
                    this.afterLoad(t));
                },
                setError: function(t) {
                    t.hasError = !0, t.$slide.removeClass("fancybox-slide--" + t.type), this.setContent(t, this.translate(t, t.opts.errorTpl));
                },
                showLoading: function(t) {
                    var e = this;
                    t = t || e.current, t && !t.$spinner && (t.$spinner = n(e.opts.spinnerTpl).appendTo(t.$slide));
                },
                hideLoading: function(t) {
                    var e = this;
                    t = t || e.current, t && t.$spinner && (t.$spinner.remove(), delete t.$spinner);
                },
                afterLoad: function(t) {
                    var e = this;
                    e.isClosing || (t.isLoading = !1, t.isLoaded = !0, e.trigger("afterLoad", t), e.hideLoading(t), 
                    t.opts.protect && t.$content && !t.hasError && (t.$content.on("contextmenu.fb", (function(t) {
                        return 2 == t.button && t.preventDefault(), !0;
                    })), "image" === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)), 
                    e.revealContent(t));
                },
                revealContent: function(t) {
                    var e, i, a, s, r, c = this, l = t.$slide, u = !1;
                    return e = t.opts[c.firstRun ? "animationEffect" : "transitionEffect"], a = t.opts[c.firstRun ? "animationDuration" : "transitionDuration"], 
                    a = parseInt(t.forcedDuration === o ? a : t.forcedDuration, 10), !t.isMoved && t.pos === c.currPos && a || (e = !1), 
                    "zoom" !== e || t.pos === c.currPos && a && "image" === t.type && !t.hasError && (u = c.getThumbPos(t)) || (e = "fade"), 
                    "zoom" === e ? (r = c.getFitPos(t), r.scaleX = Math.round(r.width / u.width * 100) / 100, 
                    r.scaleY = Math.round(r.height / u.height * 100) / 100, delete r.width, delete r.height, 
                    s = t.opts.zoomOpacity, "auto" == s && (s = Math.abs(t.width / t.height - u.width / u.height) > .1), 
                    s && (u.opacity = .1, r.opacity = 1), n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"), u), 
                    f(t.$content), void n.fancybox.animate(t.$content, r, a, (function() {
                        c.complete();
                    }))) : (c.updateSlide(t), e ? (n.fancybox.stop(l), i = "fancybox-animated fancybox-slide--" + (t.pos > c.prevPos ? "next" : "previous") + " fancybox-fx-" + e, 
                    l.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i), 
                    t.$content.removeClass("fancybox-is-hidden"), f(l), void n.fancybox.animate(l, "fancybox-slide--current", a, (function(e) {
                        l.removeClass(i).removeAttr("style"), t.pos === c.currPos && c.complete();
                    }), !0)) : (f(l), t.$content.removeClass("fancybox-is-hidden"), void (t.pos === c.currPos && c.complete())));
                },
                getThumbPos: function(o) {
                    var i, a = this, s = !1, r = function(e) {
                        for (var o, i = e[0], a = i.getBoundingClientRect(), s = []; null !== i.parentElement; ) "hidden" !== n(i.parentElement).css("overflow") && "auto" !== n(i.parentElement).css("overflow") || s.push(i.parentElement.getBoundingClientRect()), 
                        i = i.parentElement;
                        return o = s.every((function(t) {
                            var e = Math.min(a.right, t.right) - Math.max(a.left, t.left), n = Math.min(a.bottom, t.bottom) - Math.max(a.top, t.top);
                            return e > 0 && n > 0;
                        })), o && a.bottom > 0 && a.right > 0 && a.left < n(t).width() && a.top < n(t).height();
                    }, c = o.opts.$thumb, l = c ? c.offset() : 0;
                    return l && c[0].ownerDocument === e && r(c) && (i = a.$refs.stage.offset(), s = {
                        top: l.top - i.top + parseFloat(c.css("border-top-width") || 0),
                        left: l.left - i.left + parseFloat(c.css("border-left-width") || 0),
                        width: c.width(),
                        height: c.height(),
                        scaleX: 1,
                        scaleY: 1
                    }), s;
                },
                complete: function() {
                    var t = this, o = t.current, i = {};
                    o.isMoved || !o.isLoaded || o.isComplete || (o.isComplete = !0, o.$slide.siblings().trigger("onReset"), 
                    f(o.$slide), o.$slide.addClass("fancybox-slide--complete"), n.each(t.slides, (function(e, o) {
                        o.pos >= t.currPos - 1 && o.pos <= t.currPos + 1 ? i[o.pos] = o : o && (n.fancybox.stop(o.$slide), 
                        o.$slide.unbind().remove());
                    })), t.slides = i, t.updateCursor(), t.trigger("afterShow"), (n(e.activeElement).is("[disabled]") || o.opts.autoFocus && "image" != o.type && "iframe" !== o.type) && t.focus());
                },
                preload: function() {
                    var t, e, n = this;
                    n.group.length < 2 || (t = n.slides[n.currPos + 1], e = n.slides[n.currPos - 1], 
                    t && "image" === t.type && n.loadSlide(t), e && "image" === e.type && n.loadSlide(e));
                },
                focus: function() {
                    var t, e = this.current;
                    this.isClosing || (t = e && e.isComplete ? e.$slide.find("button,:input,[tabindex],a").filter(":not([disabled]):visible:first") : null, 
                    t = t && t.length ? t : this.$refs.container, t.focus());
                },
                activate: function() {
                    var t = this;
                    n(".fancybox-container").each((function() {
                        var e = n(this).data("FancyBox");
                        e && e.uid !== t.uid && !e.isClosing && e.trigger("onDeactivate");
                    })), t.current && (t.$refs.container.index() > 0 && t.$refs.container.prependTo(e.body), 
                    t.updateControls()), t.trigger("onActivate"), t.addEvents();
                },
                close: function(t, e) {
                    var o, i, a, s, r, c, l = this, f = l.current, h = function() {
                        l.cleanUp(t);
                    };
                    return !l.isClosing && (l.isClosing = !0, !1 === l.trigger("beforeClose", t) ? (l.isClosing = !1, 
                    u((function() {
                        l.update();
                    })), !1) : (l.removeEvents(), f.timouts && clearTimeout(f.timouts), a = f.$content, 
                    o = f.opts.animationEffect, i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0, 
                    f.$slide.off(d).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"), 
                    f.$slide.siblings().trigger("onReset").remove(), i && l.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"), 
                    l.hideLoading(f), l.hideControls(), l.updateCursor(), "zoom" !== o || !0 !== t && a && i && "image" === f.type && !f.hasError && (c = l.getThumbPos(f)) || (o = "fade"), 
                    "zoom" === o ? (n.fancybox.stop(a), r = n.fancybox.getTranslate(a), r.width = r.width * r.scaleX, 
                    r.height = r.height * r.scaleY, s = f.opts.zoomOpacity, "auto" == s && (s = Math.abs(f.width / f.height - c.width / c.height) > .1), 
                    s && (c.opacity = 0), r.scaleX = r.width / c.width, r.scaleY = r.height / c.height, 
                    r.width = c.width, r.height = c.height, n.fancybox.setTranslate(f.$content, r), 
                    n.fancybox.animate(f.$content, c, i, h), !0) : (o && i ? !0 === t ? setTimeout(h, i) : n.fancybox.animate(f.$slide.removeClass("fancybox-slide--current"), "fancybox-animated fancybox-slide--previous fancybox-fx-" + o, i, h) : h(), 
                    !0)));
                },
                cleanUp: function(t) {
                    var e, o = this;
                    o.current.$slide.trigger("onReset"), o.$refs.container.empty().remove(), o.trigger("afterClose", t), 
                    o.$lastFocus && !o.current.focusBack && o.$lastFocus.focus(), o.current = null, 
                    e = n.fancybox.getInstance(), e ? e.activate() : (s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft), 
                    n("html").removeClass("fancybox-enabled"), n("#fancybox-style-noscroll").remove());
                },
                trigger: function(t, e) {
                    var o, i = Array.prototype.slice.call(arguments, 1), a = this, s = e && e.opts ? e : a.current;
                    return s ? i.unshift(s) : s = a, i.unshift(a), n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)), 
                    !1 === o ? o : void ("afterClose" === t ? r.trigger(t + ".fb", i) : a.$refs.container.trigger(t + ".fb", i));
                },
                updateControls: function(t) {
                    var e = this, o = e.current, i = o.index, a = o.opts, s = a.caption, r = e.$refs.caption;
                    o.$slide.trigger("refresh"), e.$caption = s && s.length ? r.html(s) : null, e.isHiddenControls || e.showControls(), 
                    n("[data-fancybox-count]").html(e.group.length), n("[data-fancybox-index]").html(i + 1), 
                    n("[data-fancybox-prev]").prop("disabled", !a.loop && i <= 0), n("[data-fancybox-next]").prop("disabled", !a.loop && i >= e.group.length - 1);
                },
                hideControls: function() {
                    this.isHiddenControls = !0, this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav");
                },
                showControls: function() {
                    var t = this, e = t.current ? t.current.opts : t.opts, n = t.$refs.container;
                    t.isHiddenControls = !1, t.idleSecondsCounter = 0, n.toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons)).toggleClass("fancybox-show-infobar", !!(e.infobar && t.group.length > 1)).toggleClass("fancybox-show-nav", !!(e.arrows && t.group.length > 1)).toggleClass("fancybox-is-modal", !!e.modal), 
                    t.$caption ? n.addClass("fancybox-show-caption ") : n.removeClass("fancybox-show-caption");
                },
                toggleControls: function() {
                    this.isHiddenControls ? this.showControls() : this.hideControls();
                }
            }), n.fancybox = {
                version: "3.1.20",
                defaults: a,
                getInstance: function(t) {
                    var e = n('.fancybox-container:not(".fancybox-is-closing"):first').data("FancyBox"), o = Array.prototype.slice.call(arguments, 1);
                    return e instanceof h && ("string" === n.type(t) ? e[t].apply(e, o) : "function" === n.type(t) && t.apply(e, o), 
                    e);
                },
                open: function(t, e, n) {
                    return new h(t, e, n);
                },
                close: function(t) {
                    var e = this.getInstance();
                    e && (e.close(), !0 === t && this.close());
                },
                destroy: function() {
                    this.close(!0), r.off("click.fb-start");
                },
                isMobile: e.createTouch !== o && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
                use3d: function() {
                    var n = e.createElement("div");
                    return t.getComputedStyle && t.getComputedStyle(n).getPropertyValue("transform") && !(e.documentMode && e.documentMode < 11);
                }(),
                getTranslate: function(t) {
                    var e;
                    if (!t || !t.length) return !1;
                    if (e = t.eq(0).css("transform"), e && -1 !== e.indexOf("matrix") ? (e = e.split("(")[1], 
                    e = e.split(")")[0], e = e.split(",")) : e = [], e.length) e = e.length > 10 ? [ e[13], e[12], e[0], e[5] ] : [ e[5], e[4], e[0], e[3] ], 
                    e = e.map(parseFloat); else {
                        e = [ 0, 0, 1, 1 ];
                        var n = /\.*translate\((.*)px,(.*)px\)/i, o = n.exec(t.eq(0).attr("style"));
                        o && (e[0] = parseFloat(o[2]), e[1] = parseFloat(o[1]));
                    }
                    return {
                        top: e[0],
                        left: e[1],
                        scaleX: e[2],
                        scaleY: e[3],
                        opacity: parseFloat(t.css("opacity")),
                        width: t.width(),
                        height: t.height()
                    };
                },
                setTranslate: function(t, e) {
                    var n = "", i = {};
                    if (t && e) return e.left === o && e.top === o || (n = (e.left === o ? t.position().left : e.left) + "px, " + (e.top === o ? t.position().top : e.top) + "px", 
                    n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"), e.scaleX !== o && e.scaleY !== o && (n = (n.length ? n + " " : "") + "scale(" + e.scaleX + ", " + e.scaleY + ")"), 
                    n.length && (i.transform = n), e.opacity !== o && (i.opacity = e.opacity), e.width !== o && (i.width = e.width), 
                    e.height !== o && (i.height = e.height), t.css(i);
                },
                animate: function(t, e, i, a, s) {
                    var r = d || "transitionend";
                    n.isFunction(i) && (a = i, i = null), n.isPlainObject(e) || t.removeAttr("style"), 
                    t.on(r, (function(i) {
                        (!i || !i.originalEvent || t.is(i.originalEvent.target) && "z-index" != i.originalEvent.propertyName) && (t.off(r), 
                        n.isPlainObject(e) ? e.scaleX !== o && e.scaleY !== o && (t.css("transition-duration", "0ms"), 
                        e.width = t.width() * e.scaleX, e.height = t.height() * e.scaleY, e.scaleX = 1, 
                        e.scaleY = 1, n.fancybox.setTranslate(t, e)) : !0 !== s && t.removeClass(e), n.isFunction(a) && a(i));
                    })), n.isNumeric(i) && t.css("transition-duration", i + "ms"), n.isPlainObject(e) ? n.fancybox.setTranslate(t, e) : t.addClass(e), 
                    t.data("timer", setTimeout((function() {
                        t.trigger("transitionend");
                    }), i + 16));
                },
                stop: function(t) {
                    clearTimeout(t.data("timer")), t.off(d);
                }
            }, n.fn.fancybox = function(t) {
                var e;
                return t = t || {}, e = t.selector || !1, e ? n("body").off("click.fb-start", e).on("click.fb-start", e, {
                    items: n(e),
                    options: t
                }, i) : this.off("click.fb-start").on("click.fb-start", {
                    items: this,
                    options: t
                }, i), this;
            }, r.on("click.fb-start", "[data-fancybox]", i);
        }
    }(window, document, window.jQuery), function(t) {
        "use strict";
        var e = function(e, n, o) {
            if (e) return o = o || "", "object" === t.type(o) && (o = t.param(o, !0)), t.each(n, (function(t, n) {
                e = e.replace("$" + t, n || "");
            })), o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o), e;
        }, n = {
            youtube: {
                matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
                params: {
                    autoplay: 1,
                    autohide: 1,
                    fs: 1,
                    rel: 0,
                    hd: 1,
                    wmode: "transparent",
                    enablejsapi: 1,
                    html5: 1
                },
                paramPlace: 8,
                type: "iframe",
                url: "//www.youtube.com/embed/$4",
                thumb: "//img.youtube.com/vi/$4/hqdefault.jpg"
            },
            vimeo: {
                matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
                params: {
                    autoplay: 1,
                    hd: 1,
                    show_title: 1,
                    show_byline: 1,
                    show_portrait: 0,
                    fullscreen: 1,
                    api: 1
                },
                paramPlace: 3,
                type: "iframe",
                url: "//player.vimeo.com/video/$2"
            },
            metacafe: {
                matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
                type: "iframe",
                url: "//www.metacafe.com/embed/$1/?ap=1"
            },
            dailymotion: {
                matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
                params: {
                    additionalInfos: 0,
                    autoStart: 1
                },
                type: "iframe",
                url: "//www.dailymotion.com/embed/video/$1"
            },
            vine: {
                matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
                type: "iframe",
                url: "//vine.co/v/$1/embed/simple"
            },
            instagram: {
                matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
                type: "image",
                url: "//$1/p/$2/media/?size=l"
            },
            google_maps: {
                matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
                type: "iframe",
                url: function(t) {
                    return "//maps.google." + t[2] + "/?ll=" + (t[9] ? t[9] + "&z=" + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, "&") : "") : t[12]) + "&output=" + (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed");
                }
            }
        };
        t(document).on("onInit.fb", (function(o, i) {
            t.each(i.group, (function(o, i) {
                var a, s, r, c, l, u, d, f = i.src || "", h = !1;
                i.type || (a = t.extend(!0, {}, n, i.opts.media), t.each(a, (function(n, o) {
                    if (r = f.match(o.matcher), u = {}, d = n, r) {
                        if (h = o.type, o.paramPlace && r[o.paramPlace]) {
                            l = r[o.paramPlace], "?" == l[0] && (l = l.substring(1)), l = l.split("&");
                            for (var a = 0; a < l.length; ++a) {
                                var p = l[a].split("=", 2);
                                2 == p.length && (u[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")));
                            }
                        }
                        return c = t.extend(!0, {}, o.params, i.opts[n], u), f = "function" === t.type(o.url) ? o.url.call(this, r, c, i) : e(o.url, r, c), 
                        s = "function" === t.type(o.thumb) ? o.thumb.call(this, r, c, i) : e(o.thumb, r), 
                        "vimeo" === d && (f = f.replace("&%23", "#")), !1;
                    }
                })), h ? (i.src = f, i.type = h, i.opts.thumb || i.opts.$thumb && i.opts.$thumb.length || (i.opts.thumb = s), 
                "iframe" === h && (t.extend(!0, i.opts, {
                    iframe: {
                        preload: !1,
                        attr: {
                            scrolling: "no"
                        }
                    }
                }), i.contentProvider = d, i.opts.slideClass += " fancybox-slide--" + ("google_maps" == d ? "map" : "video"))) : i.type = "image");
            }));
        }));
    }(window.jQuery), function(t, e, n) {
        "use strict";
        var o = function() {
            return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
                return t.setTimeout(e, 1e3 / 60);
            };
        }(), i = function() {
            return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function(e) {
                t.clearTimeout(e);
            };
        }(), a = function(e) {
            var n = [];
            e = e.originalEvent || e || t.e, e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [ e ];
            for (var o in e) e[o].pageX ? n.push({
                x: e[o].pageX,
                y: e[o].pageY
            }) : e[o].clientX && n.push({
                x: e[o].clientX,
                y: e[o].clientY
            });
            return n;
        }, s = function(t, e, n) {
            return e && t ? "x" === n ? t.x - e.x : "y" === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) : 0;
        }, r = function(t) {
            if (t.is("a,button,input,select,textarea") || n.isFunction(t.get(0).onclick)) return !0;
            for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++) if ("data-fancybox-" === o[e].nodeName.substr(0, 14)) return !0;
            return !1;
        }, c = function(e) {
            var n = t.getComputedStyle(e)["overflow-y"], o = t.getComputedStyle(e)["overflow-x"], i = ("scroll" === n || "auto" === n) && e.scrollHeight > e.clientHeight, a = ("scroll" === o || "auto" === o) && e.scrollWidth > e.clientWidth;
            return i || a;
        }, l = function(t) {
            for (var e = !1; ;) {
                if (e = c(t.get(0))) break;
                if (t = t.parent(), !t.length || t.hasClass("fancybox-stage") || t.is("body")) break;
            }
            return e;
        }, u = function(t) {
            var e = this;
            e.instance = t, e.$bg = t.$refs.bg, e.$stage = t.$refs.stage, e.$container = t.$refs.container, 
            e.destroy(), e.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(e, "ontouchstart"));
        };
        u.prototype.destroy = function() {
            this.$container.off(".fb.touch");
        }, u.prototype.ontouchstart = function(o) {
            var i = this, c = n(o.target), u = i.instance, d = u.current, f = d.$content, h = "touchstart" == o.type;
            if (h && i.$container.off("mousedown.fb.touch"), !d || i.instance.isAnimating || i.instance.isClosing) return o.stopPropagation(), 
            void o.preventDefault();
            if ((!o.originalEvent || 2 != o.originalEvent.button) && c.length && !r(c) && !r(c.parent()) && !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left) && (i.startPoints = a(o), 
            i.startPoints && !(i.startPoints.length > 1 && u.isSliding))) {
                if (i.$target = c, i.$content = f, i.canTap = !0, n(e).off(".fb.touch"), n(e).on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(i, "ontouchend")), 
                n(e).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(i, "ontouchmove")), 
                o.stopPropagation(), !u.current.opts.touch && !u.canPan() || !c.is(i.$stage) && !i.$stage.find(c).length) return void (c.is("img") && o.preventDefault());
                n.fancybox.isMobile && (l(i.$target) || l(i.$target.parent())) || o.preventDefault(), 
                i.canvasWidth = Math.round(d.$slide[0].clientWidth), i.canvasHeight = Math.round(d.$slide[0].clientHeight), 
                i.startTime = (new Date).getTime(), i.distanceX = i.distanceY = i.distance = 0, 
                i.isPanning = !1, i.isSwiping = !1, i.isZooming = !1, i.sliderStartPos = i.sliderLastPos || {
                    top: 0,
                    left: 0
                }, i.contentStartPos = n.fancybox.getTranslate(i.$content), i.contentLastPos = null, 
                1 !== i.startPoints.length || i.isZooming || (i.canTap = !u.isSliding, "image" === d.type && (i.contentStartPos.width > i.canvasWidth + 1 || i.contentStartPos.height > i.canvasHeight + 1) ? (n.fancybox.stop(i.$content), 
                i.$content.css("transition-duration", "0ms"), i.isPanning = !0) : i.isSwiping = !0, 
                i.$container.addClass("fancybox-controls--isGrabbing")), 2 !== i.startPoints.length || u.isAnimating || d.hasError || "image" !== d.type || !d.isLoaded && !d.$ghost || (i.isZooming = !0, 
                i.isSwiping = !1, i.isPanning = !1, n.fancybox.stop(i.$content), i.$content.css("transition-duration", "0ms"), 
                i.centerPointStartX = .5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft(), 
                i.centerPointStartY = .5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop(), 
                i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width, 
                i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height, 
                i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1]));
            }
        }, u.prototype.ontouchmove = function(t) {
            var e = this;
            if (e.newPoints = a(t), n.fancybox.isMobile && (l(e.$target) || l(e.$target.parent()))) return t.stopPropagation(), 
            void (e.canTap = !1);
            if ((e.instance.current.opts.touch || e.instance.canPan()) && e.newPoints && e.newPoints.length && (e.distanceX = s(e.newPoints[0], e.startPoints[0], "x"), 
            e.distanceY = s(e.newPoints[0], e.startPoints[0], "y"), e.distance = s(e.newPoints[0], e.startPoints[0]), 
            e.distance > 0)) {
                if (!e.$target.is(e.$stage) && !e.$stage.find(e.$target).length) return;
                t.stopPropagation(), t.preventDefault(), e.isSwiping ? e.onSwipe() : e.isPanning ? e.onPan() : e.isZooming && e.onZoom();
            }
        }, u.prototype.onSwipe = function() {
            var e, a = this, s = a.isSwiping, r = a.sliderStartPos.left || 0;
            !0 === s ? Math.abs(a.distance) > 10 && (a.canTap = !1, a.instance.group.length < 2 && a.instance.opts.touch.vertical ? a.isSwiping = "y" : a.instance.isSliding || !1 === a.instance.opts.touch.vertical || "auto" === a.instance.opts.touch.vertical && n(t).width() > 800 ? a.isSwiping = "x" : (e = Math.abs(180 * Math.atan2(a.distanceY, a.distanceX) / Math.PI), 
            a.isSwiping = e > 45 && e < 135 ? "y" : "x"), a.instance.isSliding = a.isSwiping, 
            a.startPoints = a.newPoints, n.each(a.instance.slides, (function(t, e) {
                n.fancybox.stop(e.$slide), e.$slide.css("transition-duration", "0ms"), e.inTransition = !1, 
                e.pos === a.instance.current.pos && (a.sliderStartPos.left = n.fancybox.getTranslate(e.$slide).left);
            })), a.instance.SlideShow && a.instance.SlideShow.isActive && a.instance.SlideShow.stop()) : ("x" == s && (a.distanceX > 0 && (a.instance.group.length < 2 || 0 === a.instance.current.index && !a.instance.current.opts.loop) ? r += Math.pow(a.distanceX, .8) : a.distanceX < 0 && (a.instance.group.length < 2 || a.instance.current.index === a.instance.group.length - 1 && !a.instance.current.opts.loop) ? r -= Math.pow(-a.distanceX, .8) : r += a.distanceX), 
            a.sliderLastPos = {
                top: "x" == s ? 0 : a.sliderStartPos.top + a.distanceY,
                left: r
            }, a.requestId && (i(a.requestId), a.requestId = null), a.requestId = o((function() {
                a.sliderLastPos && (n.each(a.instance.slides, (function(t, e) {
                    var o = e.pos - a.instance.currPos;
                    n.fancybox.setTranslate(e.$slide, {
                        top: a.sliderLastPos.top,
                        left: a.sliderLastPos.left + o * a.canvasWidth + o * e.opts.gutter
                    });
                })), a.$container.addClass("fancybox-is-sliding"));
            })));
        }, u.prototype.onPan = function() {
            var t, e, a, s = this;
            s.canTap = !1, t = s.contentStartPos.width > s.canvasWidth ? s.contentStartPos.left + s.distanceX : s.contentStartPos.left, 
            e = s.contentStartPos.top + s.distanceY, a = s.limitMovement(t, e, s.contentStartPos.width, s.contentStartPos.height), 
            a.scaleX = s.contentStartPos.scaleX, a.scaleY = s.contentStartPos.scaleY, s.contentLastPos = a, 
            s.requestId && (i(s.requestId), s.requestId = null), s.requestId = o((function() {
                n.fancybox.setTranslate(s.$content, s.contentLastPos);
            }));
        }, u.prototype.limitMovement = function(t, e, n, o) {
            var i, a, s, r, c = this, l = c.canvasWidth, u = c.canvasHeight, d = c.contentStartPos.left, f = c.contentStartPos.top, h = c.distanceX, p = c.distanceY;
            return i = Math.max(0, .5 * l - .5 * n), a = Math.max(0, .5 * u - .5 * o), s = Math.min(l - n, .5 * l - .5 * n), 
            r = Math.min(u - o, .5 * u - .5 * o), n > l && (h > 0 && t > i && (t = i - 1 + Math.pow(-i + d + h, .8) || 0), 
            h < 0 && t < s && (t = s + 1 - Math.pow(s - d - h, .8) || 0)), o > u && (p > 0 && e > a && (e = a - 1 + Math.pow(-a + f + p, .8) || 0), 
            p < 0 && e < r && (e = r + 1 - Math.pow(r - f - p, .8) || 0)), {
                top: e,
                left: t
            };
        }, u.prototype.limitPosition = function(t, e, n, o) {
            var i = this, a = i.canvasWidth, s = i.canvasHeight;
            return n > a ? (t = t > 0 ? 0 : t, t = t < a - n ? a - n : t) : t = Math.max(0, a / 2 - n / 2), 
            o > s ? (e = e > 0 ? 0 : e, e = e < s - o ? s - o : e) : e = Math.max(0, s / 2 - o / 2), 
            {
                top: e,
                left: t
            };
        }, u.prototype.onZoom = function() {
            var e = this, a = e.contentStartPos.width, r = e.contentStartPos.height, c = e.contentStartPos.left, l = e.contentStartPos.top, u = s(e.newPoints[0], e.newPoints[1]), d = u / e.startDistanceBetweenFingers, f = Math.floor(a * d), h = Math.floor(r * d), p = (a - f) * e.percentageOfImageAtPinchPointX, g = (r - h) * e.percentageOfImageAtPinchPointY, b = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(), m = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(), y = b - e.centerPointStartX, v = m - e.centerPointStartY, x = c + (p + y), w = l + (g + v), $ = {
                top: w,
                left: x,
                scaleX: e.contentStartPos.scaleX * d,
                scaleY: e.contentStartPos.scaleY * d
            };
            e.canTap = !1, e.newWidth = f, e.newHeight = h, e.contentLastPos = $, e.requestId && (i(e.requestId), 
            e.requestId = null), e.requestId = o((function() {
                n.fancybox.setTranslate(e.$content, e.contentLastPos);
            }));
        }, u.prototype.ontouchend = function(t) {
            var o = this, s = Math.max((new Date).getTime() - o.startTime, 1), r = o.isSwiping, c = o.isPanning, l = o.isZooming;
            return o.endPoints = a(t), o.$container.removeClass("fancybox-controls--isGrabbing"), 
            n(e).off(".fb.touch"), o.requestId && (i(o.requestId), o.requestId = null), o.isSwiping = !1, 
            o.isPanning = !1, o.isZooming = !1, o.canTap ? o.onTap(t) : (o.speed = 366, o.velocityX = o.distanceX / s * .5, 
            o.velocityY = o.distanceY / s * .5, o.speedX = Math.max(.5 * o.speed, Math.min(1.5 * o.speed, 1 / Math.abs(o.velocityX) * o.speed)), 
            void (c ? o.endPanning() : l ? o.endZooming() : o.endSwiping(r)));
        }, u.prototype.endSwiping = function(t) {
            var e = this, o = !1;
            e.instance.isSliding = !1, e.sliderLastPos = null, "y" == t && Math.abs(e.distanceY) > 50 ? (n.fancybox.animate(e.instance.current.$slide, {
                top: e.sliderStartPos.top + e.distanceY + 150 * e.velocityY,
                opacity: 0
            }, 150), o = e.instance.close(!0, 300)) : "x" == t && e.distanceX > 50 && e.instance.group.length > 1 ? o = e.instance.previous(e.speedX) : "x" == t && e.distanceX < -50 && e.instance.group.length > 1 && (o = e.instance.next(e.speedX)), 
            !1 !== o || "x" != t && "y" != t || e.instance.jumpTo(e.instance.current.index, 150), 
            e.$container.removeClass("fancybox-is-sliding");
        }, u.prototype.endPanning = function() {
            var t, e, o, i = this;
            i.contentLastPos && (!1 === i.instance.current.opts.touch.momentum ? (t = i.contentLastPos.left, 
            e = i.contentLastPos.top) : (t = i.contentLastPos.left + i.velocityX * i.speed, 
            e = i.contentLastPos.top + i.velocityY * i.speed), o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height), 
            o.width = i.contentStartPos.width, o.height = i.contentStartPos.height, n.fancybox.animate(i.$content, o, 330));
        }, u.prototype.endZooming = function() {
            var t, e, o, i, a = this, s = a.instance.current, r = a.newWidth, c = a.newHeight;
            a.contentLastPos && (t = a.contentLastPos.left, e = a.contentLastPos.top, i = {
                top: e,
                left: t,
                width: r,
                height: c,
                scaleX: 1,
                scaleY: 1
            }, n.fancybox.setTranslate(a.$content, i), r < a.canvasWidth && c < a.canvasHeight ? a.instance.scaleToFit(150) : r > s.width || c > s.height ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150) : (o = a.limitPosition(t, e, r, c), 
            n.fancybox.setTranslate(a.content, n.fancybox.getTranslate(a.$content)), n.fancybox.animate(a.$content, o, 150)));
        }, u.prototype.onTap = function(t) {
            var e, o = this, i = n(t.target), s = o.instance, r = s.current, c = t && a(t) || o.startPoints, l = c[0] ? c[0].x - o.$stage.offset().left : 0, u = c[0] ? c[0].y - o.$stage.offset().top : 0, d = function(e) {
                var i = r.opts[e];
                if (n.isFunction(i) && (i = i.apply(s, [ r, t ])), i) switch (i) {
                  case "close":
                    s.close(o.startEvent);
                    break;

                  case "toggleControls":
                    s.toggleControls(!0);
                    break;

                  case "next":
                    s.next();
                    break;

                  case "nextOrClose":
                    s.group.length > 1 ? s.next() : s.close(o.startEvent);
                    break;

                  case "zoom":
                    "image" == r.type && (r.isLoaded || r.$ghost) && (s.canPan() ? s.scaleToFit() : s.isScaledDown() ? s.scaleToActual(l, u) : s.group.length < 2 && s.close(o.startEvent));
                }
            };
            if (!(t.originalEvent && 2 == t.originalEvent.button || s.isSliding || l > i[0].clientWidth + i.offset().left)) {
                if (i.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) e = "Outside"; else if (i.is(".fancybox-slide")) e = "Slide"; else {
                    if (!s.current.$content || !s.current.$content.has(t.target).length) return;
                    e = "Content";
                }
                if (o.tapped) {
                    if (clearTimeout(o.tapped), o.tapped = null, Math.abs(l - o.tapX) > 50 || Math.abs(u - o.tapY) > 50 || s.isSliding) return this;
                    d("dblclick" + e);
                } else o.tapX = l, o.tapY = u, r.opts["dblclick" + e] && r.opts["dblclick" + e] !== r.opts["click" + e] ? o.tapped = setTimeout((function() {
                    o.tapped = null, d("click" + e);
                }), 300) : d("click" + e);
                return this;
            }
        }, n(e).on("onActivate.fb", (function(t, e) {
            e && !e.Guestures && (e.Guestures = new u(e));
        })), n(e).on("beforeClose.fb", (function(t, e) {
            e && e.Guestures && e.Guestures.destroy();
        }));
    }(window, document, window.jQuery), function(t, e) {
        "use strict";
        var n = function(t) {
            this.instance = t, this.init();
        };
        e.extend(n.prototype, {
            timer: null,
            isActive: !1,
            $button: null,
            speed: 3e3,
            init: function() {
                var t = this;
                t.$button = t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click", (function() {
                    t.toggle();
                })), (t.instance.group.length < 2 || !t.instance.group[t.instance.currIndex].opts.slideShow) && t.$button.hide();
            },
            set: function() {
                var t = this;
                t.instance && t.instance.current && (t.instance.current.opts.loop || t.instance.currIndex < t.instance.group.length - 1) ? t.timer = setTimeout((function() {
                    t.instance.next();
                }), t.instance.current.opts.slideShow.speed || t.speed) : (t.stop(), t.instance.idleSecondsCounter = 0, 
                t.instance.showControls());
            },
            clear: function() {
                var t = this;
                clearTimeout(t.timer), t.timer = null;
            },
            start: function() {
                var t = this, e = t.instance.current;
                t.instance && e && (e.opts.loop || e.index < t.instance.group.length - 1) && (t.isActive = !0, 
                t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_STOP).addClass("fancybox-button--pause"), 
                e.isComplete && t.set());
            },
            stop: function() {
                var t = this, e = t.instance.current;
                t.clear(), t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause"), 
                t.isActive = !1;
            },
            toggle: function() {
                var t = this;
                t.isActive ? t.stop() : t.start();
            }
        }), e(t).on({
            "onInit.fb": function(t, e) {
                e && !e.SlideShow && (e.SlideShow = new n(e));
            },
            "beforeShow.fb": function(t, e, n, o) {
                var i = e && e.SlideShow;
                o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear();
            },
            "afterShow.fb": function(t, e, n) {
                var o = e && e.SlideShow;
                o && o.isActive && o.set();
            },
            "afterKeydown.fb": function(n, o, i, a, s) {
                var r = o && o.SlideShow;
                !r || !i.opts.slideShow || 80 !== s && 32 !== s || e(t.activeElement).is("button,a,input") || (a.preventDefault(), 
                r.toggle());
            },
            "beforeClose.fb onDeactivate.fb": function(t, e) {
                var n = e && e.SlideShow;
                n && n.stop();
            }
        }), e(t).on("visibilitychange", (function() {
            var n = e.fancybox.getInstance(), o = n && n.SlideShow;
            o && o.isActive && (t.hidden ? o.clear() : o.set());
        }));
    }(document, window.jQuery), function(t, e) {
        "use strict";
        var n = function() {
            var e, n, o, i = [ [ "requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror" ], [ "webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror" ], [ "webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror" ], [ "mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror" ], [ "msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError" ] ], a = {};
            for (n = 0; n < i.length; n++) if (e = i[n], e && e[1] in t) {
                for (o = 0; o < e.length; o++) a[i[0][o]] = e[o];
                return a;
            }
            return !1;
        }();
        if (!n) return void (e.fancybox.defaults.btnTpl.fullScreen = !1);
        var o = {
            request: function(e) {
                e = e || t.documentElement, e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT);
            },
            exit: function() {
                t[n.exitFullscreen]();
            },
            toggle: function(e) {
                e = e || t.documentElement, this.isFullscreen() ? this.exit() : this.request(e);
            },
            isFullscreen: function() {
                return Boolean(t[n.fullscreenElement]);
            },
            enabled: function() {
                return Boolean(t[n.fullscreenEnabled]);
            }
        };
        e(t).on({
            "onInit.fb": function(t, e) {
                var n, i = e.$refs.toolbar.find("[data-fancybox-fullscreen]");
                e && !e.FullScreen && e.group[e.currIndex].opts.fullScreen ? (n = e.$refs.container, 
                n.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", (function(t) {
                    t.stopPropagation(), t.preventDefault(), o.toggle(n[0]);
                })), e.opts.fullScreen && !0 === e.opts.fullScreen.autoStart && o.request(n[0]), 
                e.FullScreen = o) : i.hide();
            },
            "afterKeydown.fb": function(t, e, n, o, i) {
                e && e.FullScreen && 70 === i && (o.preventDefault(), e.FullScreen.toggle(e.$refs.container[0]));
            },
            "beforeClose.fb": function(t) {
                t && t.FullScreen && o.exit();
            }
        }), e(t).on(n.fullscreenchange, (function() {
            var t = e.fancybox.getInstance();
            t.current && "image" === t.current.type && t.isAnimating && (t.current.$content.css("transition", "none"), 
            t.isAnimating = !1, t.update(!0, !0, 0));
        }));
    }(document, window.jQuery), function(t, e) {
        "use strict";
        var n = function(t) {
            this.instance = t, this.init();
        };
        e.extend(n.prototype, {
            $button: null,
            $grid: null,
            $list: null,
            isVisible: !1,
            init: function() {
                var t = this, e = t.instance.group[0], n = t.instance.group[1];
                t.$button = t.instance.$refs.toolbar.find("[data-fancybox-thumbs]"), t.instance.group.length > 1 && t.instance.group[t.instance.currIndex].opts.thumbs && ("image" == e.type || e.opts.thumb || e.opts.$thumb) && ("image" == n.type || n.opts.thumb || n.opts.$thumb) ? (t.$button.on("click", (function() {
                    t.toggle();
                })), t.isActive = !0) : (t.$button.hide(), t.isActive = !1);
            },
            create: function() {
                var t, n, o = this.instance;
                this.$grid = e('<div class="fancybox-thumbs"></div>').appendTo(o.$refs.container), 
                t = "<ul>", e.each(o.group, (function(e, o) {
                    n = o.opts.thumb || (o.opts.$thumb ? o.opts.$thumb.attr("src") : null), n || "image" !== o.type || (n = o.src), 
                    n && n.length && (t += '<li data-index="' + e + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + n + '" /></li>');
                })), t += "</ul>", this.$list = e(t).appendTo(this.$grid).on("click", "li", (function() {
                    o.jumpTo(e(this).data("index"));
                })), this.$list.find("img").hide().one("load", (function() {
                    var t, n, o, i, a = e(this).parent().removeClass("fancybox-thumbs-loading"), s = a.outerWidth(), r = a.outerHeight();
                    t = this.naturalWidth || this.width, n = this.naturalHeight || this.height, o = t / s, 
                    i = n / r, o >= 1 && i >= 1 && (o > i ? (t /= i, n = r) : (t = s, n /= o)), e(this).css({
                        width: Math.floor(t),
                        height: Math.floor(n),
                        "margin-top": Math.min(0, Math.floor(.3 * r - .3 * n)),
                        "margin-left": Math.min(0, Math.floor(.5 * s - .5 * t))
                    }).show();
                })).each((function() {
                    this.src = e(this).data("src");
                }));
            },
            focus: function() {
                this.instance.current && this.$list.children().removeClass("fancybox-thumbs-active").filter('[data-index="' + this.instance.current.index + '"]').addClass("fancybox-thumbs-active").focus();
            },
            close: function() {
                this.$grid.hide();
            },
            update: function() {
                this.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible), 
                this.isVisible ? (this.$grid || this.create(), this.instance.trigger("onThumbsShow"), 
                this.focus()) : this.$grid && this.instance.trigger("onThumbsHide"), this.instance.update();
            },
            hide: function() {
                this.isVisible = !1, this.update();
            },
            show: function() {
                this.isVisible = !0, this.update();
            },
            toggle: function() {
                this.isVisible = !this.isVisible, this.update();
            }
        }), e(t).on({
            "onInit.fb": function(t, e) {
                e && !e.Thumbs && (e.Thumbs = new n(e));
            },
            "beforeShow.fb": function(t, e, n, o) {
                var i = e && e.Thumbs;
                if (i && i.isActive) {
                    if (n.modal) return i.$button.hide(), void i.hide();
                    o && !0 === e.opts.thumbs.autoStart && i.show(), i.isVisible && i.focus();
                }
            },
            "afterKeydown.fb": function(t, e, n, o, i) {
                var a = e && e.Thumbs;
                a && a.isActive && 71 === i && (o.preventDefault(), a.toggle());
            },
            "beforeClose.fb": function(t, e) {
                var n = e && e.Thumbs;
                n && n.isVisible && !1 !== e.opts.thumbs.hideOnClose && n.close();
            }
        });
    }(document, window.jQuery), function(t, e, n) {
        "use strict";
        function o() {
            var t = e.location.hash.substr(1), n = t.split("-"), o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1, i = n.join("-");
            return o < 1 && (o = 1), {
                hash: t,
                index: o,
                gallery: i
            };
        }
        function i(t) {
            var e;
            "" !== t.gallery && (e = n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1), 
            e.length ? e.trigger("click") : n("#" + n.escapeSelector(t.gallery)).trigger("click"));
        }
        function a(t) {
            var e;
            return !!t && (e = t.current ? t.current.opts : t.opts, e.$orig ? e.$orig.data("fancybox") : e.hash || "");
        }
        n.escapeSelector || (n.escapeSelector = function(t) {
            var e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, n = function(t, e) {
                return e ? "\0" === t ? "пїЅ" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t;
            };
            return (t + "").replace(e, n);
        });
        var s = null, r = null;
        n((function() {
            setTimeout((function() {
                !1 !== n.fancybox.defaults.hash && (n(t).on({
                    "onInit.fb": function(t, e) {
                        var n, i;
                        !1 !== e.group[e.currIndex].opts.hash && (n = o(), i = a(e), i && n.gallery && i == n.gallery && (e.currIndex = n.index - 1));
                    },
                    "beforeShow.fb": function(n, o, i, c) {
                        var l;
                        !1 !== i.opts.hash && (l = a(o), l && "" !== l && (e.location.hash.indexOf(l) < 0 && (o.opts.origHash = e.location.hash), 
                        s = l + (o.group.length > 1 ? "-" + (i.index + 1) : ""), "replaceState" in e.history ? (r && clearTimeout(r), 
                        r = setTimeout((function() {
                            e.history[c ? "pushState" : "replaceState"]({}, t.title, e.location.pathname + e.location.search + "#" + s), 
                            r = null;
                        }), 300)) : e.location.hash = s));
                    },
                    "beforeClose.fb": function(o, i, c) {
                        var l, u;
                        r && clearTimeout(r), !1 !== c.opts.hash && (l = a(i), u = i && i.opts.origHash ? i.opts.origHash : "", 
                        l && "" !== l && ("replaceState" in history ? e.history.replaceState({}, t.title, e.location.pathname + e.location.search + u) : (e.location.hash = u, 
                        n(e).scrollTop(i.scrollTop).scrollLeft(i.scrollLeft))), s = null);
                    }
                }), n(e).on("hashchange.fb", (function() {
                    var t = o();
                    n.fancybox.getInstance() ? !s || s === t.gallery + "-" + t.index || 1 === t.index && s == t.gallery || (s = null, 
                    n.fancybox.close()) : "" !== t.gallery && i(t);
                })), n(e).one("unload.fb popstate.fb", (function() {
                    n.fancybox.getInstance("close", !0, 0);
                })), i(o()));
            }), 50);
        }));
    }(document, window, window.jQuery);
    jQuery((function($) {
        $(".phone").mask("+7 (999) 999 99 99");
        $("input[name='form_text_209']").mask("(999) 999-99-99");
    }));
    $(document).click((function(event) {
        if (!$(event.target).closest(".cityselect").length) if ("block" == $(".header-nd .cityselect ul").css("display")) $(".header-nd .cityselect ul").slideUp();
    }));
    $(document).ready((function() {
        $(".toggle_FAQ").click((function() {
            $(this).toggleClass("active").find(".faq_block__text").toggle();
            if ($(this).hasClass("active")) $(this).find(".faq_block__title span").text("-"); else $(this).find(".faq_block__title span").text("+");
        }));
        $(".img_lessons").slick({
            lazyLoad: "ondemand",
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='slick-next'>",
            arrows: true,
            dots: true,
            responsive: [ {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            } ]
        });
        $(".schedule_block .price-card__wrapper").slick({
            lazyLoad: "ondemand",
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='slick-next'>",
            arrows: true,
            dots: false,
            responsive: [ {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            } ]
        });
        $(".cars-slider__wrapper").slick({
            lazyLoad: "ondemand",
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 3.3,
            slidesToScroll: 1,
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='prev' alt='1'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='next' alt='2'>",
            responsive: [ {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    centerMode: true
                }
            }, {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 990,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            } ]
        });
        if ($(window).width() < 991) $(".price-card__wrapper").slick({
            lazyLoad: "ondemand",
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='prev' alt='1'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='next' alt='2'>"
        });
        $(".form-switch i").click((function() {
            $("#switch__auto").toggleClass("bold");
            $("#price-switch__description-auto").toggleClass("on-off");
            $("#price-auto").toggleClass("on-off");
            $("#switch__moto").toggleClass("bold");
            $("#price-switch__description-moto").toggleClass("on-off");
            $("#price-moto").toggleClass("on-off");
            if ($(window).width() < 991) $(".price-moto__wrapper").slick({
                lazyLoad: "ondemand",
                slidesToShow: 1,
                slidesToScroll: 1,
                prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='prev' alt='1'>",
                nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='next' alt='2'>"
            });
        }));
        if ($(window).width() < 768) $(".inst-list").slick({
            lazyLoad: "ondemand",
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='slick-next'>",
            slidesToShow: 1,
            arrows: true,
            dots: false
        });
        $(".otzivSlick").slick({
            lazyLoad: "ondemand",
            prevArrow: "<img src='/local/templates/real/img/icons/arrow-left-pagination.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/arrow-right-pagination.png' class='slick-next'>",
            slidesToShow: 3,
            arrows: true,
            dots: false,
            responsive: [ {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            } ]
        });
        if ($(window).width() < 768) $(".otzivPageSlick").slick({
            lazyLoad: "ondemand",
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='slick-next'>",
            slidesToShow: 1,
            arrows: true,
            dots: false
        });
        if (!$.cookie("noSeeVideoReal")) setTimeout((function() {
            $("#real-video-trigger").show(200);
        }), 7e3);
        $("#seeVideo").click((function(event) {
            var $video = $("#videoReal");
            src = $video.attr("src");
            $video.attr("old_src", src);
            $video.attr("src", src + "autoplay=1;");
        }));
        $("#seeVideo").fancybox({
            afterClose: function() {
                var $video = $("#videoReal");
                old_src = $video.attr("old_src");
                $video.attr("src", old_src);
                $(".js-real-video-trigger").hide(200);
                $.cookie("noSeeVideoReal", true, {
                    expires: 5,
                    path: "/"
                });
            }
        });
        $(".js-close-trigger").click((function(event) {
            $(".js-real-video-trigger").hide(200);
            $.cookie("noSeeVideoReal", true, {
                expires: 5,
                path: "/"
            });
        }));
        $("#instructorReviewForm select[name='fil']").on("change", (function() {
            var currentCity = $(this).find(":selected").data("cityid");
            if (61 == currentCity) currentCity = 60;
            if (85 == currentCity) currentCity = 75;
            $("#instructorReviewForm select[name='inst'] option").css("display", "none");
            $("#instructorReviewForm select[name='inst']").find("[data-cityid='" + currentCity + "']").css("display", "block");
        }));
        $(".header-nd .fa-bars").on("click", (function() {
            if ("none" == $(".header-nd .menu-top-nd").css("display")) {
                $(".header-nd .menu-top-nd").slideDown();
                $(".bgcover").css("display", "block");
            } else {
                $(".header-nd .menu-top-nd").slideUp();
                $(".bgcover").css("display", "none");
            }
        }));
        $(".ndheader-top-menu .fa-times").on("click", (function() {
            $(".header-nd .menu-top-nd").slideUp();
            $(".bgcover").css("display", "none");
        }));
        $(".mobile-nav-menu .firstitem p").on("click", (function(event) {
            var elementTo = $(this).closest(".firstitem");
            if ("none" == elementTo.next().css("display")) elementTo.nextAll().slideDown(); else elementTo.nextAll().slideUp();
            event.preventDefault();
            event.stopPropagation();
            return false;
        }));
        $(".header-nd .cityselect .curentcity").on("click", (function() {
            var box = $(this).closest(".cityselect");
            if ("none" == box.find("ul").css("display")) box.find("ul").stop(true, true).slideDown(); else box.find("ul").stop(true, true).slideUp();
        }));
        $(".fancy").fancybox();
        $(".fancyOverlay").fancybox({
            closeClick: false,
            closeEffect: "none",
            helpers: {
                overlay: {
                    closeClick: false
                }
            }
        }).trigger("click");
        if ($(".akciislick").length) $(".akciislick").slick({
            lazyLoad: "ondemand",
            dots: true,
            autoplay: true,
            autoplaySpeed: 3e3,
            infinite: true
        });
        if ($(".filial-slider").length) $(".filial-slider").slick({
            lazyLoad: "ondemand",
            dots: true,
            autoplay: true,
            autoplaySpeed: 3e3,
            infinite: true,
            prevArrow: "<img src='/local/templates/real/img/icons/slider-arrow__left.png' class='slick-prev'>",
            nextArrow: "<img src='/local/templates/real/img/icons/slider-arrow__right.png' class='slick-next'>"
        });
        if ($(window).width() > 998) if ($(".sidemenuwrapper").length) $(".sidemenuwrapper").sticky({
            topSpacing: 20
        });
        $(".btn-AddOtzyv").on("click", (function() {
            $(this).hide();
            var destination = $("#addotzyv").offset().top;
            $("html").animate({
                scrollTop: destination
            }, 1100);
        }));
        $(".makeotzyv").on("click", (function() {
            var showelem = $(this).data("act");
            $("." + showelem).slideDown();
            $(this).hide();
            var destination = $("." + showelem).offset().top;
            $("html").animate({
                scrollTop: destination
            }, 1100);
        }));
        $(".showmorejs .btn-show").on("click", (function() {
            $(this).closest(".otzyvitem").find(".jstextfull").css({
                height: "auto",
                overflow: "visible"
            });
            $(this).hide();
        }));
        $(document).click((function(e) {
            if (0 === $(e.target).closest(".socseti").length) $(".nd-header-menu-select").slideUp();
        }));
        $(".nd-activate-headermenu").on("click", (function() {
            $(this).closest(".socseti").find(".nd-header-menu-select").slideDown();
        }));
        $(".sticker").sticky({
            topSpacing: 0
        });
        $(".cookie-accept .fa-times").on("click", (function() {
            var ThisForm = $(this).closest(".cookie-accept");
            $.ajax({
                method: "GET",
                url: "<?=SITE_TEMPLATE_PATH?>/js/cookieright/cookie.php",
                data: {
                    acceptcookieprivacy: "1"
                }
            }).done((function(msg) {
                if ("1" == msg) ThisForm.remove();
            }));
        }));
        $("#form_dropdown_new_field_40579").addClass("form__input");
        $(".blogformjsaddclass input").addClass("form__input");
        $("#footerForm").on("submit", (function() {
            event.preventDefault();
            sendName = $(this).find("input[name=FIO]").val();
            sendTel = $(this).find("input[name=PHONE]").val();
            if (!sendTel) {
                alert("Р’РІРµРґРёС‚Рµ С‚РµР»РµС„РѕРЅ");
                return false;
            } else {
                $.post("/ajax/sendForms.php", {
                    name: sendName,
                    tel: sendTel,
                    act: "footerForm"
                }, (function(data) {
                    $("#footerForm").html("<h2>" + data + "</h2>");
                }));
                return false;
            }
        }));
        function getUrl() {
            var url = window.location.href;
            var domain;
            if (url.indexOf("://") > -1) domain = url.split("/")[2]; else domain = url.split("/")[0];
            domain = domain.split(":")[0];
            url = domain;
            return url;
        }
        var d = new Date;
        var gmthours = -d.getTimezoneOffset() / 60;
        var site = window.location.hostname;
        $('form[name="SIMPLE_FORM_1"] input[name="web_form_submit"]').on("click", (function() {
            var $form = $(this).parents("form");
            var name, phone, email, message, categories, form_title, url;
            name = $form.find('input[name="form_text_1"]').val();
            phone = $form.find('input[name="form_text_2"]').val();
            email = $form.find('input[name="form_email_3"]').val();
            message = $form.find('textarea[name="form_textarea_8"]').val();
            categories = [];
            $(".cat-result :checked").each((function(index, item) {
                categories.push($(item).next("label").text());
            }));
            categories = categories.join(", ");
            form_title = $form.find("h3").text();
            url = getUrl();
            if ("" !== name && "" !== phone && "" !== email) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    phone,
                    email,
                    message,
                    categories,
                    form_title,
                    url,
                    gmthours,
                    site
                }
            });
            var debug_data = {
                name,
                phone,
                email,
                message,
                categories,
                form_title,
                url,
                gmthours,
                site
            };
            console.log(JSON.stringify(debug_data));
        }));
        $('form[name="SIMPLE_FORM_3"] input[name="web_form_submit"]').on("click", (function() {
            var $form = $(this).parents("form");
            var name, phone, call_time, form_title, url;
            name = $form.find('input[name="form_text_19"]').val();
            phone = $form.find('input[name="form_text_18"]').val();
            call_time = $form.find('input[name="form_text_20"]').val();
            form_title = $form.parents(".container").find("h2").text().trim();
            url = getUrl();
            if ("" !== name && "" !== phone) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    phone,
                    call_time,
                    form_title,
                    url,
                    gmthours,
                    site
                }
            });
            var debug_data = {
                name,
                phone,
                call_time,
                form_title,
                url
            };
            console.log(JSON.stringify(debug_data));
        }));
        $("html").on("click", 'form[name="NEW_FORM_TSENY"] .form__submit', (function() {
            var $form = $(this).parents("form");
            var name, phone, call_time, categories, form_title, url;
            name = $form.find('input[name="form_text_193"]').val() + " " + $form.find('input[name="form_text_194"]').val();
            phone = $form.find('input[name="form_text_195"]').val();
            call_time = "СЃ " + $form.find('input[name="form_text_196"]').val() + ":" + $form.find('input[name="form_text_197"]').val() + " РґРѕ " + $form.find('input[name="form_text_198"]').val() + ":" + $form.find('input[name="form_text_199"]').val();
            categories = $form.find('input[name="form_hidden_183"]').val() + "/" + $form.find('input[name="form_hidden_184"]').val();
            form_title = $form.find(".form__title").text().trim();
            url = getUrl();
            if ("" !== name && "" !== phone) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    phone,
                    categories,
                    call_time,
                    form_title,
                    url,
                    gmthours,
                    site
                },
                success: function(data) {}
            });
            var debug_data = {
                name,
                phone,
                categories,
                call_time,
                form_title,
                url,
                gmthours,
                site
            };
            console.log(JSON.stringify(debug_data));
        }));
        $('form.add-otziv input[name="iblock_submit"]').on("click", (function() {
            var $form = $(this).parents("form");
            var name, message, form_title, instructor, city, url;
            name = $form.find('input[name="PROPERTY[NAME][0]"]').val();
            message = $form.find('textarea[name="PROPERTY[PREVIEW_TEXT][0]"]').val();
            instructor = $form.find('select[name="PROPERTY[71][0]"] option:selected').text();
            city = $form.find('select[name="PROPERTY[73][0]"] option:selected').text();
            form_title = "РћС‚Р·С‹РІС‹";
            url = getUrl();
            if ("" !== name && "" !== message) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    message,
                    email: name + "@mail.com",
                    form_title,
                    url,
                    gmthours,
                    site,
                    city,
                    instructor
                }
            });
            var debug_data = {
                name,
                message,
                form_title,
                email: name + "@mail.com",
                url,
                gmthours,
                site,
                city,
                instructor
            };
            console.log(JSON.stringify(debug_data));
        }));
        $('form[name="SIMPLE_FORM_2"] input[name="web_form_submit"]').on("click", (function() {
            var $form = $(this).parents("form");
            var name, email, message, form_title, url;
            name = $form.find('input[name="form_text_14"]').val();
            email = $form.find('input[name="form_text_15"]').val();
            message = $form.find('textarea[name="form_textarea_17"]').val();
            form_title = "РќР°РїРёС€РёС‚Рµ РЅР°Рј. РљРѕРЅС‚Р°РєС‚С‹";
            url = getUrl();
            if ("" !== email && "" !== message) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    email,
                    message,
                    form_title,
                    url,
                    gmthours,
                    site
                }
            });
            var debug_data = {
                name,
                email,
                message,
                form_title,
                url,
                gmthours,
                site
            };
            console.log(JSON.stringify(debug_data));
        }));
        $('form[name="SIMPLE_FORM_20"] input[name="web_form_submit"]').on("click", (function() {
            var $form = $(this).parents("form");
            var name, phone, city, form_title, url;
            name = $form.find('input[name="form_text_210"]').val();
            phone = $form.find('input[name="form_text_209"]').val();
            city = $form.find("#form_dropdown_new_field_40579 option:selected").text();
            form_title = "РќР°РїРёС€РёС‚Рµ РЅР°Рј. РЎС‚Р°С‚СЊРё";
            url = getUrl();
            if ("" !== name && "" !== phone && "" !== city) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    phone,
                    city,
                    form_title,
                    url,
                    gmthours,
                    site
                }
            });
            var debug_data = {
                name,
                phone,
                city,
                form_title,
                url,
                gmthours,
                site
            };
            console.log(JSON.stringify(debug_data));
        }));
        $('form[name="SIMPLE_FORM_ZAYAVKASKIDKA"] input[name="web_form_submit"]').on("click", (function() {
            $(this).parents("form");
            var name, phone, city, form_title, url;
            name = $('form[name="SIMPLE_FORM_ZAYAVKASKIDKA"]').find('input[name="form_text_243"]').val();
            phone = $('form[name="SIMPLE_FORM_ZAYAVKASKIDKA"]').find('input[name="form_text_244"]').val();
            city = $(".cityselect .curentcity").text();
            form_title = "Р—Р°РїРёС€РёСЃСЊ РЅР° РїСЂРѕР±РЅРѕРµ РІРѕР¶РґРµРЅРёРµ";
            url = getUrl();
            if ("" !== name && "" !== phone && "" !== city) $.ajax({
                type: "POST",
                url: "/ajax/sendInAmo.php",
                data: {
                    name,
                    phone,
                    city,
                    form_title,
                    url,
                    gmthours,
                    site
                }
            });
            var debug_data = {
                name,
                phone,
                city,
                form_title,
                url,
                gmthours,
                site
            };
            console.log(JSON.stringify(debug_data));
        }));
    }));
    window["FLS"] = true;
    isWebp();
    spollers();
    formFieldsInit({
        viewPass: false
    });
    pageNavigation();
})();