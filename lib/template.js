// 项
class item_b extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var t_time = this.getAttribute("time"),
            v_text = this.getAttribute("text"),
            e_date = this.getAttribute("date");
        this.list = this.getAttribute("list")?.split(",") || [];
        var time = document.createElement("input");
        time.type = "time";
        time.value = t_time;
        var text = document.createElement("input");
        text.type = "text";
        text.value = v_text;
        var time_line = document.createElement("div");
        var date = document.createElement("input");
        date.type = "date";
        date.value = e_date;

        text.oninput = () => {
            if (text.value != "" && !this.nextElementSibling) {
                var n_i = document.createElement("item-b");
                n_i.setAttribute("time", "00:25");
                let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                n_i.setAttribute(
                    "date",
                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, 0)}-${String(d.getDate()).padStart(
                        2,
                        0
                    )}`
                );
                n_i.id = new Date().getTime();
                this.after(n_i);
            }
        };
        text.onkeydown = (e) => {
            if (e.key == "Backspace" && text.value == "") {
                this.remove();
            }
        };

        var b = document.createElement("input");
        b.type = "checkbox";
        b.checked = this.list.length % 2;
        var progress = document.createElement("progress");
        progress.value = 0;

        b.oninput = () => {
            this.list.push(new Date().getTime());
        };

        time_line.appendChild(b);
        time_line.appendChild(progress);

        this.appendChild(time);
        this.appendChild(text);
        this.appendChild(time_line);
        this.appendChild(date);
    }

    get time() {
        return this.querySelector("input[type='time']").value;
    }
    get text() {
        return this.querySelector("input[type='text']").value;
    }
    get play() {
        return this.querySelector("input[type='checkbox']").checked;
    }
    get date() {
        return this.querySelector("input[type='date']").value;
    }

    reflash() {
        if (this.list.length % 2 == 0) return;
        let t = 0;
        for (let i = 0; i < this.list.length - 1; i += 2) {
            t += this.list[i + 1] - this.list[i];
        }
        let n_date = new Date().getTime();
        t += n_date - this.list[this.list.length - 1];

        if (this.querySelector("input[type='time']").value) {
            let a_t_l = this.querySelector("input[type='time']").value.split(":");
            let a_t = Number(a_t_l[0]) * 60 * 60 * 1000 + Number(a_t_l[1]) * 60 * 1000;
            this.querySelector("progress").value = t / a_t;
        }

        let e_date = this.querySelector("input[type='date']").value;
        if (e_date != "") {
            let e_t = new Date(e_date).getTime();
            if (n_date > e_t) {
                console.log("超时");
            }
        }
    }
}

window.customElements.define("item-b", item_b);
