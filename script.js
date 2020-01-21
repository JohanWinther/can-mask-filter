var idTableEl, filterEl, maskEl;
var currentCaret = 0;

document.addEventListener("DOMContentLoaded", () => {

    idTableEl = document.getElementById("idTable");
    maskEl = document.getElementById("maskInput");
    filterEl = document.getElementById("filterInput");

    

    maskEl.hexValue = 0;
    maskEl.value = "0x0";
    ["focus"].forEach(function (e) {
        maskEl.addEventListener(e, checkcaret, false);
        filterEl.addEventListener(e, checkcaret, false);
    });
    maskEl.addEventListener("input", (e)=>{
        changeInput(e, maskEl);
        highlightIds();
    });

    filterEl.hexValue = 0;
    filterEl.value = "0x0";
    filterEl.addEventListener("input", (e) => {
        changeInput(e, filterEl);
        highlightIds();
    });

    for (let el of document.querySelectorAll("input[name=bit-length]")) {
        el.addEventListener("change", (e) => {
            changeBitLength(parseInt(e.target.attributes["data-value"].value));
        });
    }

    createTable(512);
    changeBitLength(8);

});

function changeBitLength(b) {
    bitLength = b;
    changeInput(null, maskEl);
    changeInput(null, filterEl);
    highlightIds();
}

function checkcaret(e) {
    if (e.target.selectionStart < 2) setCaret(e.target, 2);
}

function setCaret(el, start) {
    el.setSelectionRange(start, start);
}

function changeInput(e, el) {
    currentCaret = el.selectionStart;
    newVal = el.value.substr(1); 
    newVal = newVal.replace("x", "");
    if (e !== null && e.data && e.data.match(/[^0-9a-fA-F]/g)) {
        currentCaret = currentCaret < 2 ? 2 : currentCaret;
        currentCaret--;
        newVal = newVal.replace(/[^0-9a-fA-F]/g, "");
    } else if (e && !e.data) {
        newVal = newVal.substr(0, currentCaret-2) + "0" + newVal.substr(currentCaret-2);
    } else {
        newVal = newVal.substr(0, currentCaret-2) + newVal.substr(currentCaret-1);
    }
    newVal = newVal.substr(0, bitLength);
    el.value = "0x" + newVal.toUpperCase().padStart(bitLength, "0");
    el.hexValue = parseInt(newVal, 16);
    setCaret(el, currentCaret);
}

function highlightIds() {
    m = maskEl.hexValue;
    f = filterEl.hexValue;
    for (let tr of idTableEl.children) {
        for (let td of tr.children) {
            n = parseInt(td.id.replace("can-id-",""));
            if ((n & m) == (f & m)) {
                td.classList.add("is-selected");
            } else {
                td.classList.remove("is-selected");
            }
        }
    }
}

function createTable(n) {
    tableStr = "";
    for (let i = 0; i < n; i++) {
        if (i % 32 == 0) {
            tableStr += "<tr>";
        }
        tableStr += `<td id="can-id-${i}" title="0x${i.toString(16).toUpperCase()}">${i}</td>`;
        if (i % 32 == 32 - 1) {
            tableStr += "</tr>";
        }
    }
    idTableEl.innerHTML = tableStr;
    highlightIds();
}