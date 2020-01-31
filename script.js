document.addEventListener("DOMContentLoaded", () => {

    // Set bit length
    document.querySelectorAll("input[name=bit-length]").forEach(radio => {
        if (radio.checked) {
            document.querySelectorAll('[is=hex-input-list]').forEach(el => el.dataset.count = Math.ceil(radio.dataset.value / 4));
            document.querySelectorAll('[is=id-table]').forEach(el => el.dataset.count = Math.ceil(radio.dataset.value / 4));
        }
    });

    document.getElementById("bit-length-control").addEventListener("change", (e) => {
        document.querySelectorAll('[is=hex-input-list]').forEach(el => el.dataset.count = Math.ceil(e.target.dataset.value/4));
        document.querySelectorAll('[is=id-table]').forEach(el => el.dataset.count = Math.ceil(e.target.dataset.value / 4));
    });

    document.getElementById('table-min').addEventListener("change", e => {
        if (e.target.value == "" || e.target.valueAsNumber < 0) e.target.value = "0";
        document.querySelectorAll('[is=id-table]').forEach(el => {
            el.dataset.min = e.target.value;
        });
    });

    document.getElementById('table-max').addEventListener("change", e => {
        if (e.target.value == "" || e.target.valueAsNumber < 0) e.target.value = "0";
        document.querySelectorAll('[is=id-table]').forEach(el => {
            el.dataset.max = e.target.value;
        });
    });

    document.getElementById("mask-input-list").children[2].firstElementChild.focus();

});
