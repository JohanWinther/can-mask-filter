class HexInputList extends HTMLOListElement {
    constructor() {
        super();

        this.style.setProperty("list-style", "none");
        let li = document.createElement("li");
        let hexInput = document.createElement(HexInput);
        hexInput.setAttribute("is", "hex-input");
        hexInput.classList.add("input", "is-size-1");
        li.appendChild(hexInput);
        this.appendChild(li);
        console.log(li);
    }
}

class HexInput extends HTMLInputElement {
    constructor() {
        super();
        this.type = "text";
        this.maxLength = 1;
    }
}


customElements.define('hex-input-list', HexInputList, { extends: 'ol' });
customElements.define('hex-input', HexInput, { extends: 'input' });