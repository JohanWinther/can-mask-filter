document.addEventListener("DOMContentLoaded", () => {

    // Set bit length
    document.querySelectorAll("input[name=bit-length]").forEach(radio => {
        if (radio.checked) document.querySelectorAll('[is=hex-input-list]').forEach(el => el.dataset.count = Math.ceil(radio.dataset.value / 4));
    });

    document.getElementById("bit-length-control").addEventListener("change", (e) => {
        document.querySelectorAll('[is=hex-input-list]').forEach(el => el.dataset.count = Math.ceil(e.target.dataset.value/4));
    });

    //createTable(512);

    document.getElementById("mask-input-list").children[2].firstElementChild.focus();

});
