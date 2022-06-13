function r() {
    let item = document.querySelectorAll("item-b");
    for (let i of item) {
        i.reflash();
    }
}

setInterval(r, 500);
