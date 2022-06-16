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
                list: i.list.join(","),
                date: i.date,
            };
    }

    let a = document.createElement("a");
    let blob = new Blob([JSON.stringify(o)]);
    a.download = `xtodo-${new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replaceAll(":", "-")
        .replace("T", "-")}.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(String(blob));
}

document.getElementById("download").onclick = save;

var upload_el = document.getElementById("upload_file");
upload_el.onchange = () => {
    var filereader = new FileReader();
    filereader.readAsText(upload_el.files[0]);
    filereader.onload = () => {
        let o = JSON.parse(filereader.result);
        render(o);
    };
};

function render(o) {
    let t = "";
    for (let i in o) {
        let item = `<item-b id="${i}" time="${o[i].time}" text="${o[i].text}" list="${o[i].list}" date="${o[i].date}"></item-b>`;
        t += item;
    }
    document.getElementById("main").innerHTML = t;
}

document.getElementById("upfile").onclick = () => {
    upload_el.click();
};

var fileHandle;

async function file_load() {
    [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: "JSON",
                accept: {
                    "text/*": [".json"],
                },
            },
        ],
        excludeAcceptAllOption: true,
    });

    const file = await fileHandle.getFile();

    if (fileHandle.kind != "file") return;

    let reader = new FileReader();
    reader.onload = () => {
        let o = JSON.parse(reader.result);
        render(o);
    };
    reader.readAsText(file);
}

async function write_file(text) {
    if (fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
    }
}
