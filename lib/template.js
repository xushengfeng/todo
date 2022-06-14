// 进度
class pro extends HTMLElement {
    constructor() {
        super();
    }

    _value = this.getAttribute("value");

    connectedCallback() {
        var div = document.createElement("div");
        div.style.width = `${this._value * 100}%`;

        this.appendChild(div);
    }

    set value(v) {
        this._value = v;
        var div = this.querySelector("div");
        if (!div) {
            var div = document.createElement("div");
            this.appendChild(div);
        }
        div.style.width = `${this._value * 100}%`;
    }

    get value() {
        return this._value;
    }

    set play(v) {
        if (v) {
            this.classList.add("pro_play");
        } else {
            this.classList.remove("pro_play");
        }
    }
}

window.customElements.define("progress-b", pro);

// 项
class item_b extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        let d_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, 0)}-${String(d.getDate()).padStart(
            2,
            0
        )}`;

        var t_time = this.getAttribute("time") || "00:25",
            v_text = this.getAttribute("text"),
            e_date = this.getAttribute("date") || d_date;
        this.list = this.getAttribute("list")?.split(",") || [];
        var time = document.createElement("input");
        time.type = "time";
        time.value = t_time;
        var text = document.createElement("input");
        text.type = "text";
        text.value = v_text;
        var date = document.createElement("input");
        date.type = "date";
        date.value = e_date;

        text.oninput = () => {
            if (text.value != "" && !this.nextElementSibling) {
                var n_i = document.createElement("item-b");
                n_i.id = new Date().getTime();
                this.after(n_i);
            }
        };
        text.onkeydown = (e) => {
            if (e.key == "Backspace" && text.value == "") {
                this.remove();
            }
        };
        this.appendChild(time);
        this.appendChild(text);

        var b = document.createElement("lock-b");
        var progress = document.createElement("progress-b");
        this.appendChild(progress);
        progress.value = 0;

        progress.onclick = () => {
            this.list.push(new Date().getTime());
            progress.play = Boolean(this.list.length % 2);
        };

        this.appendChild(date);
    }

    get time() {
        return this.querySelector("input[type='time']").value;
    }
    get text() {
        return this.querySelector("input[type='text']").value;
    }
    get play() {
        return this.querySelector("lock-b").checked;
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
            this.querySelector("progress-b").value = t / a_t;
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
