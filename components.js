class HexInputList extends HTMLOListElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Input event
        this.addEventListener("input", (e) => {
            if (!e.data) {
                e.target.value = "0";
                let prev = e.target.parentElement.previousElementSibling;
                if (prev && !prev.firstElementChild.readOnly) {
                    HexInputList.setInputFocus(prev.firstElementChild);
                }
            } else {
                let reData = e.data.match(/[0-9a-fA-F]/);
                if (reData) {
                    e.target.value = reData[0].toUpperCase();
                } else {
                    let prevVal = e.target.value.match(/[0-9a-fA-F]/);
                    if (prevVal) {
                        e.target.value = prevVal[0].toUpperCase();
                    } else {
                        e.target.value = "0";
                    }
                }
                let next = e.target.parentElement.nextElementSibling;
                if (next) {
                    HexInputList.setInputFocus(next.firstElementChild);
                }
            }
            let maskLiList = [...document.getElementById("mask-input-list").children].slice(1);
            let filterLiList = [...document.getElementById("filter-input-list").children].slice(1);
            
            for (let li of maskLiList.map((el, i) => [el, filterLiList[i]])) {
                this.setBinaryBoxValue(li[0].children[1], li[0].children[0].value);
                let faded = parseInt(li[0].children[0].value, 16).toString(2).padStart(4, "0").split("").map((b) => parseInt(b));
                this.setBinaryBoxValue(li[1].children[1], li[1].children[0].value, faded);
            }
            document.querySelectorAll("[is=id-table]").forEach(el => el.highlightIds());
        });

        // Set caret position on click
        this.addEventListener("click", (e) => {
            if (e.target.tagName == "INPUT") {
                HexInputList.setInputFocus(e.target);
            }
        });

        // Move caret event
        this.addEventListener("keydown", (e) => {
            if (e.keyCode == 37 || e.keyCode == 39) {
                let directionIsRight = (e.keyCode - 37)/2;
                if (directionIsRight) {
                    let next = e.target.parentElement.nextElementSibling;
                    if (next) {
                        HexInputList.setInputFocus(next.firstElementChild);
                    }
                } else {
                    let prev = e.target.parentElement.previousElementSibling;
                    if (prev && !prev.firstElementChild.readOnly) {
                        HexInputList.setInputFocus(prev.firstElementChild);
                    }
                }
            }
        });
    }


    static get observedAttributes() { return ["data-count"]; }

    attributeChangedCallback(name, oldValue, newValue) {

        while (this.firstElementChild) {
            this.removeChild(this.firstElementChild);
        }

        // Add inputs
        const count = parseInt(this.dataset.count);
        for (let i = 0; i < count + 1; i++) {
            let inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.maxLength = 2;
            inputElement.value = "0";
            inputElement.classList.add("input");
            if (i < 1) {
                inputElement.readOnly = true;
                inputElement.classList.add("is-static");
                inputElement.tabIndex = -1;
                inputElement.value = "0×";
            } else {
                /* inputElement.addEventListener("mouseover", () => {
                    let index = [...inputElement.parentElement.parentElement.children].indexOf(inputElement.parentElement) - 1;
                    
                    let maskLi = document.getElementById("mask-input-list").children[index + 1];
                    this.maskBinary = HexInputList.createBinaryBox(index);
                    HexInputList.setBinaryBoxValue(this.maskBinary, maskLi.children[0].value);
                    maskLi.appendChild(this.maskBinary);

                    let filterLi = document.getElementById("filter-input-list").children[index + 1];
                    this.filterBinary = HexInputList.createBinaryBox(index);
                    let faded = parseInt(maskLi.children[0].value, 16).toString(2).padStart(4, "0").split("").map((b) => parseInt(b));
                    HexInputList.setBinaryBoxValue(this.filterBinary, filterLi.children[0].value, faded);
                    filterLi.appendChild(this.filterBinary);
                //}); */
                //inputElement.addEventListener("mouseout", () => {
                //    this.maskBinary.remove();
                //    this.filterBinary.remove();
                //});
            }
            let liElement = document.createElement("li");
            liElement.appendChild(inputElement);
            if (i > 0) {
                let binBox = this.createBinaryBox(i - 1);
                this.setBinaryBoxValue(binBox, inputElement.value);
                liElement.appendChild(binBox);
            }
            this.appendChild(liElement);
        }
        document.querySelectorAll("[is=id-table]").forEach(el => el.highlightIds());
    }

    createBinaryBox(index) {
        let box = document.createElement("div");
        box.classList.add("binary-rep");
        box.style.left = `${3 + (index * 2)}em`;
        return box
    }

    setBinaryBoxValue(el, hexVal, active = [1, 1, 1, 1]) {
        let list = parseInt(hexVal, 16).toString(2).padStart(4, "0").split("").map((n, i) => {
            return {
                hexBit: n,
                activeBit: active[i],
                index: i
            }
        });
        for (let li of list) {
            let span;
            if (el.children.length === 4) {
                span = el.children[li.index];
            } else {
                span = document.createElement("span");
                el.appendChild(span);
            }
            span.innerHTML = li.hexBit;
            if (li.activeBit === 1) {
                span.style.opacity = null;
            } else {
                span.style.opacity = "0.5";
            }
        }
    }

    static setInputFocus(el) {
        el.focus();
        el.setSelectionRange(1, 1);
    }

    getHexValue() {
        return parseInt([...this.children].slice(1).map(e => e.firstElementChild.value).join(""), 16);
    }


}

class IdTable extends HTMLTableElement {
    constructor() {
        super();
    }

    static get observedAttributes() { return ["data-min", "data-max", "data-count", "data-hex"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        const count = parseInt(this.dataset.count);
        const wrap = 64;
        const radix = this.dataset.decimal ? 10 : 16;

        const min = wrap*Math.floor(parseInt(this.dataset.min)/wrap);
        const max = parseInt(this.dataset.max);
        if (max - min > 10000) return;

        while (this.firstElementChild) {
            this.removeChild(this.firstElementChild);
        }

        const tableHeadEl = document.createElement("thead");
        this.prepend(tableHeadEl);
        var tableHeadRowEl = document.createElement("tr");
        tableHeadEl.appendChild(tableHeadRowEl);
        var tableHeadFirstHead = document.createElement("th");
        tableHeadRowEl.appendChild(tableHeadFirstHead);
        tableHeadFirstHead.textContent = "0×";
        var tableHeadCellEl;
        for (let i = 0; i < wrap; i++) {
            tableHeadCellEl = document.createElement("th");
            tableHeadCellEl.textContent = i.toString(radix).toUpperCase();
            tableHeadRowEl.appendChild(tableHeadCellEl)
        }
        
        const tableBodyEl = document.createElement("tbody");
        this.appendChild(tableBodyEl);
        let k = min;
        var tableRowEl, tableCellEl, tableRowHeadEl;
        for (let i = min; i < max; i++) {
            if (k % wrap == 0) {
                tableRowEl = document.createElement("tr");
                tableBodyEl.appendChild(tableRowEl);
                tableRowHeadEl = document.createElement("th");
                tableRowEl.appendChild(tableRowHeadEl);
                tableRowHeadEl.textContent = k.toString(radix).toUpperCase();
            }
            tableCellEl = document.createElement("td");
            tableRowEl.appendChild(tableCellEl);
            tableCellEl.id = "can-id-"+i.toString();
            tableCellEl.innerHTML = "&#183;"
            tableCellEl.title = "0x" + i.toString(radix).toUpperCase().padStart(count, '0');
            tableCellEl.title += "\n" + i.toString();
            k++;
        }
        this.highlightIds();
    }

    highlightIds() {
        const maskEl = document.getElementById("mask-input-list");
        const filterEl = document.getElementById("filter-input-list");

        const m = maskEl.getHexValue();
        const f = filterEl.getHexValue();
        for (let tr of this.childNodes.item(1).childNodes.values()) {
            for (let td of tr.childNodes.values()) {
                if (td.tagName === "TH") continue;
                const n = parseInt(td.id.replace("can-id-", ""));
                if ((n & m) == (f & m)) {
                    td.classList.add("is-selected");
                } else {
                    td.classList.remove("is-selected");
                }
            }
        }
    }
}


customElements.define('hex-input-list', HexInputList, { extends: 'ol' });
customElements.define('id-table', IdTable, { extends: 'table' });