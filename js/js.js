function r() {
    let item = document.querySelectorAll("item-b");
    for (let i of item) {
        i.reflash();
    }
}

setInterval(r, 500);

function save() {
    let o = {};
    let item = document.querySelectorAll("item-b");
    for (let i of item) {
        if (i.text)
            o[i.id] = {
                time: i.time,
                text: i.text,
                list: i.list,
                date: i.text,
            };
    }

    let a = document.createElement("a");
    let blob = new Blob([JSON.stringify(o)]);
    a.download = "todo_list.json";
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(String(blob));
}
