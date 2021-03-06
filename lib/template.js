// 时间
class time extends HTMLElement {
    constructor() {
        super();
    }

    _value = this.getAttribute("value");

    connectedCallback() {}

    add() {
        var h = document.createElement("span");
        var m = document.createElement("span");
        h.contentEditable = true;
        m.contentEditable = true;
        h.inputMode = "tel";
        m.inputMode = "tel";
        var d = document.createTextNode(":");

        this.appendChild(h);
        this.appendChild(d);
        this.appendChild(m);
    }

    set value(v) {
        var l = v.split(":");
        var els = this.querySelectorAll("span");
        if (els.length == 0) {
            this.add();
            els = this.querySelectorAll("span");
        }
        if (l.length == 2) {
            els[0].innerText = l[0];
            els[1].innerText = l[1];
        }
    }

    get value() {
        return this.innerText;
    }
}

window.customElements.define("time-b", time);

// 进度
class pro extends HTMLElement {
    constructor() {
        super();
    }

    _value = this.getAttribute("value");

    connectedCallback() {
        var div = document.createElement("div");
        div.style.width = `${this._value * 100}%`;
        let text = document.createElement("span");
        div.appendChild(text);

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
        if (this.querySelector("input")) return;
        let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        let d_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, 0)}-${String(d.getDate()).padStart(
            2,
            0
        )}`;

        if (!this.id) this.id = new Date().getTime();

        var t_time = this.getAttribute("time") || "00:25",
            v_text = this.getAttribute("text"),
            e_date = this.getAttribute("date") || d_date;
        this.list =
            this.getAttribute("list")
                ?.split(",")
                .filter((v) => v != "") || [];
        var time = document.createElement("time-b");
        time.type = "time";
        time.value = t_time;
        var text = document.createElement("input");
        text.type = "text";
        text.value = v_text;
        var date = document.createElement("input");
        date.type = "date";
        date.value = e_date;

        var button = document.createElement("button");
        button.title = button.name = this.hide ? "显示项" : "隐藏项";
        var h_f = () => {
            this.hide = true;
            var d_b = document.createElement("button");
            d_b.id = "remove";
            d_b.onclick = () => {
                this.remove();
            };
            button.after(d_b);
            button.onclick = s_f;
            button.title = button.name = "显示项";
        };
        var s_f = () => {
            this.hide = false;
            this.querySelector("#remove").remove();
            button.onclick = h_f;
            button.title = button.name = "隐藏项";
        };
        button.onclick = h_f;

        this.appendChild(button);

        text.oninput = () => {
            if (text.value != "" && !this.nextElementSibling) {
                var n_i = document.createElement("item-b");
                n_i.id = new Date().getTime();
                this.after(n_i);
            }
        };
        text.onkeydown = (e) => {
            if (e.key == "Backspace" && text.value == "") {
                if (this.nextElementSibling) this.nextElementSibling.querySelector("input").focus();
                this.remove();
            } else if (e.key == "ArrowDown") {
                if (this.nextElementSibling) this.nextElementSibling.querySelector("input").focus();
            } else if (e.key == "ArrowUp") {
                if (this.previousElementSibling) this.previousElementSibling.querySelector("input").focus();
            }
        };
        this.appendChild(time);
        this.appendChild(text);

        var progress = document.createElement("progress-b");
        this.appendChild(progress);
        progress.value = 0;

        this.r_pro();

        progress.onclick = () => {
            this.list.push(new Date().getTime());
            progress.play = Boolean(this.list.length % 2);
        };

        this.appendChild(date);
    }

    get time() {
        return this.querySelector("time-b").value;
    }
    get text() {
        return this.querySelector("input[type='text']").value;
    }
    get date() {
        return this.querySelector("input[type='date']").value;
    }

    get hide() {
        return this.className.split(" ").includes("item_hide");
    }
    set hide(v) {
        if (v) {
            this.parentElement.appendChild(this);
            this.classList.add("item_hide");
            if (this.list.length % 2 != 0) this.querySelector("progress-b").click();
        } else {
            this.classList.remove("item_hide");
        }
    }

    notied = false;

    over_time = false;

    reflash() {
        if (this.list.length % 2 != 0 && this.r_pro() && !this.notied) {
            this.notied = true;
            let notification = noti("到时间", {
                body: `任务 ${this.text || ""} 已经到时间\n点击以暂停`,
            });
            if (notification)
                notification.onclick = () => {
                    this.querySelector("progress-b").click();
                };
        }

        let e_date = this.querySelector("input[type='date']").value;
        if (e_date != "") {
            let e_t = new Date(e_date).getTime() + new Date().getTimezoneOffset() * 60 * 1000;
            let n_date = new Date().getTime();
            if (n_date > e_t && !this.over_time) {
                noti("超时", {
                    body: `任务 ${this.text || ""} 已超时`,
                });
                this.over_time = true;
            }
        }
    }

    r_pro = () => {
        let t = 0;
        let n_date = new Date().getTime();
        if (this.list.length % 2 == 0) {
            for (let i = 0; i < this.list.length; i += 2) {
                t += this.list[i + 1] - this.list[i];
            }
        } else {
            for (let i = 0; i < this.list.length - 1; i += 2) {
                t += this.list[i + 1] - this.list[i];
            }
            t += n_date - this.list[this.list.length - 1];
        }

        let m = Math.trunc(t / 60000);
        let h = Math.trunc(m / 60);
        this.querySelector("progress-b > div >span").innerText = `${h}:${String(m % 60).padStart(2, "0")}`;

        if (this.querySelector("time-b").value) {
            let a_t_l = this.querySelector("time-b").value.split(":");
            let a_t = Number(a_t_l[0]) * 60 * 60 * 1000 + Number(a_t_l[1]) * 60 * 1000;
            this.querySelector("progress-b").value = t / a_t;
            return t / a_t > 1;
        }
    };
}

window.customElements.define("item-b", item_b);

/**
 * 通知
 * @param {string} title 标题
 * @param {NotificationOptions} op 参数
 * @returns Notification
 */
function noti(title, op) {
    // 先检查浏览器是否支持
    if (!("Notification" in window)) {
        alert(title + "\n" + op.body);
    }

    // 检查用户是否同意接受通知
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(title, op);
        return notification;
    }

    // 否则我们需要向用户获取权限
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // 如果用户接受权限，我们就可以发起一条消息
            if (permission === "granted") {
                var notification = new Notification(title, op);
                return notification;
            }
        });
    }
}
