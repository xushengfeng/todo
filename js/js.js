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
        o[i.id] = {
            time: i.time,
            text: i.text,
            list: i.list.join(","),
            date: i.date,
        };
    }
    write_file(JSON.stringify(o));
}

document.getElementById("download").onclick = save;

var upload_el = document.getElementById("upload_file");

function render(o) {
    let t = "";
    for (let i in o) {
        let item = `<item-b id="${i}" time="${o[i].time}" text="${o[i].text}" list="${o[i].list}" date="${o[i].date}"></item-b>`;
        t += item;
    }
    document.getElementById("main").innerHTML = t;
}

var fileHandle;

if (window.showOpenFilePicker) {
    document.getElementById("upfile").onclick = file_load;
} else {
    document.getElementById("upfile").onclick = () => {
        upload_el.click();
    };
    upload_el.onchange = file_load;
}

async function file_load() {
    let file;
    if (window.showOpenFilePicker) {
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
        if (fileHandle.kind != "file") return;
        file = await fileHandle.getFile();
    } else {
        file = upload_el.files[0];
    }

    let reader = new FileReader();
    reader.onload = () => {
        let o = JSON.parse(reader.result);
        render(o);
    };
    reader.readAsText(file);
}

async function write_file(text) {
    if (fileHandle && (await fileHandle.requestPermission({ mode: "readwrite" })) === "granted") {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
    } else {
        let a = document.createElement("a");
        let blob = new Blob([text]);
        a.download = `xtodo-${new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replaceAll(":", "-")
            .replace("T", "-")}.json`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(String(blob));
    }
}
