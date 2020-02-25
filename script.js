document.addEventListener("DOMContentLoaded", () => {

    // Set bit length upon change
    document.getElementById("bit-length-control").addEventListener("change", (e) => {
        document.querySelectorAll('[is=hex-input-list]').forEach(el => el.dataset.count = Math.ceil(e.target.dataset.value/4));
        document.querySelectorAll('[is=id-table]').forEach(el => el.dataset.count = Math.ceil(e.target.dataset.value / 4));
    });

    // Trigger bit length event if refreshed
    document.querySelectorAll("input[name=bit-length]").forEach(radio => {
        if (radio.checked) radio.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Set range-min upon change
    document.getElementById('table-min').addEventListener("change", e => {
        if (e.target.value == "" || e.target.valueAsNumber < 0) e.target.value = "0";
        document.querySelectorAll('[is=id-table]').forEach(el => {
            el.dataset.min = e.target.value;
        });
    });

    // Set range-max upon change
    document.getElementById('table-max').addEventListener("change", e => {
        if (e.target.value == "" || e.target.valueAsNumber < 0) e.target.value = "0";
        document.querySelectorAll('[is=id-table]').forEach(el => {
            el.dataset.max = e.target.value;
        });
    });
    
    // Trigger range change event if refreshed
    [...document.getElementsByClassName('table-length-input')].forEach(el => el.dispatchEvent(new Event("change", { bubbles: true })));

    // Event listeners for copy buttons
    document.querySelectorAll(".copy-button").forEach(button => {
        button.addEventListener("click", (e) => {
            let input = document.createElement('input');
            input.setAttribute('value', "0x"+[...e.target.previousElementSibling.children].slice(1).map(i => i.firstElementChild.value).join(""));
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        });
    });


    // Set focus to first input
    document.getElementById("mask-input-list").children[1].firstElementChild.focus();

    // Trigger input event
    let inputEvent = new InputEvent("input", {bubbles: true});
    document.getElementById("mask-input-list").children[1].firstElementChild.dispatchEvent(inputEvent);

});
