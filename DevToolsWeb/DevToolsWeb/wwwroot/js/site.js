// -------------------- Theme Toggle --------------------
const toggle = document.getElementById("themeToggle");
if (toggle) {
    toggle.checked = localStorage.getItem("theme") === "dark";
}
// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
}

toggle.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light"; // default light
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
});
const faqBtns = document.querySelectorAll(".faq-question");
faqBtns.forEach(button => {   
    button.addEventListener("click", () => {
        const answer = button.nextElementSibling;
        if (answer.style.maxHeight) {
            // Collapse
            answer.style.maxHeight = null;
            answer.style.paddingTop = "0";
            answer.style.paddingBottom = "0";
        } else {
            // Collapse all others first (optional)
            document.querySelectorAll(".faq-answer").forEach(a => {
                a.style.maxHeight = null;
                a.style.paddingTop = "0";
                a.style.paddingBottom = "0";
            });
            // Expand this
            answer.style.maxHeight = answer.scrollHeight + "px";
            answer.style.paddingTop = "10px";
            answer.style.paddingBottom = "10px";
        }
    });
});
function showMessage(text, type, id) {
    const msg = document.getElementById(id);
    msg.innerText = text;
    msg.style.color = type == "err" ? "red" :"green";
}
function uploadJsonFile(event, jsonEditor, input) {
    const json = JSON.parse(event.target.result);   // validate JSON
    let updatedJson = JSON.stringify(json, null, 4); // pretty format
    jsonEditor.updateText(updatedJson);
    input.value = "";
}
function validateFileInput(file,msgId) {
    if (!file) return;
    if (!file.name.endsWith(".json")) {
        showMessage("Please upload a valid JSON file.", "err", msgId)
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showMessage("File too large. Max 2MB allowed.", "err", msgId)
        return;
    }
}
function downloadOutput(type,output) {
    debugger
   
    if (!output) {
        alert("Nothing to download");
        return;
    }

    let fileName = "output";
    let mimeType = "text/plain";
    let data = output;

    if (type === "json") {
        try {
            data = JSON.stringify(JSON.parse(output), null, 2);
            mimeType = "application/json";
            fileName += ".json";
        } catch {
            alert("Invalid JSON");
            return;
        }
    }

    if (type === "xml") {
        mimeType = "application/xml";
        fileName += ".xml";
    }

    if (type === "txt") {
        fileName += ".txt";
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}
