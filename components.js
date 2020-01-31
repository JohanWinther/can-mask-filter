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
                if (prev && !prev.firstElementChild.readOnly) prev.firstElementChild.focus();
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
                if (next) next.firstElementChild.focus();
            }
            document.querySelectorAll("[is=id-table]").forEach(el => el.highlightIds());
        });

        // Move caret event
        this.addEventListener("keydown", (e) => {
            if (e.keyCode == 37 || e.keyCode == 39) {
                let directionIsRight = (e.keyCode - 37)/2;
                if (directionIsRight) {
                    let next = e.target.parentElement.nextElementSibling;
                    if (next) next.firstElementChild.focus();
                } else {
                    let prev = e.target.parentElement.previousElementSibling;
                    if (prev && !prev.firstElementChild.readOnly) prev.firstElementChild.focus();
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
            }
            let liElement = document.createElement("li");
            liElement.appendChild(inputElement);
            this.appendChild(liElement);
        }
        document.querySelectorAll("[is=id-table]").forEach(el => el.highlightIds());
    }

    getHexValue() {
        return parseInt([...this.children].slice(2).map(e => e.firstElementChild.value).join(""), 16);
    }


}

class IdTable extends HTMLTableElement {
    constructor() {
        super();
        this.appendChild(document.createElement("tbody"));
    }

    static get observedAttributes() { return ["data-min", "data-max", "data-count"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        const count = parseInt(this.dataset.count);
        const wrap = count === 3 ? 32 : 16;

        const min = parseInt(this.dataset.min);
        const max = parseInt(this.dataset.max);
        if (max - min > 10000) return;

        while (this.firstElementChild.firstElementChild) {
            this.firstElementChild.removeChild(this.firstElementChild.firstElementChild);
        }

        let k = 0;
        for (let i = min; i < max; i++) {
            var tableRowEl, tableCellEl;
            if (k % wrap == 0) {
                tableRowEl = document.createElement("tr");
            }
            tableCellEl = document.createElement("td");
            tableCellEl.id = "can-id-"+i.toString();
            tableCellEl.textContent = "0x"+i.toString(16).toUpperCase().padStart(count,'0');
            tableCellEl.title = i.toString();
            tableRowEl.appendChild(tableCellEl);
            if (k % wrap === wrap - 1 || k === max - min - 1) {
                this.firstElementChild.appendChild(tableRowEl);
            }
            k++;
        }
        this.highlightIds();
    }

    highlightIds() {
        const maskEl = document.getElementById("mask-input-list");
        const filterEl = document.getElementById("filter-input-list");

        const m = maskEl.getHexValue();
        const f = filterEl.getHexValue();
        for (let tr of this.firstElementChild.children) {
            for (let td of tr.children) {
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