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
