const btnObfuscate = document.getElementById("btnObfuscate");
const btnMinify = document.getElementById("btnMinify");
const btnClear = document.getElementById("btnClear");
const jsonInput = document.getElementById("jsInput");

const inputButtons = [btnObfuscate, btnMinify, btnClear];
const outputButtons = [btnCopy, btnDownload];
jsonInput.addEventListener("input", toggleButtons);
function toggleButtons() {
    const hasText = jsonInput.value.trim().length > 0;    
    toggleMainButtons(hasText, inputButtons);
}
const jsonOutput = document.getElementById("jsOutput");
jsonOutput.addEventListener("input", () => {
    toggleOutputButtons();
});
function toggleOutputButtons() {
    const hasText = jsonOutput.value.trim().length > 0;    
    toggleMainButtons(hasText, outputButtons);
}
function obfuscateJs() {
    const input = document.getElementById("jsInput").value;
    if (!input.trim()) return;
    try {
        // Simple obfuscation (Base64 encoding)
        const encoded = btoa(unescape(encodeURIComponent(input)));
        const obfuscated = `eval(atob("${encoded}"))`;
        document.getElementById("jsOutput").value = obfuscated;
        toggleOutputButtons()
    } catch (e) {
        showMessage("Unable to obfuscate input.", "err", "obfuscatormessage")         
    }
}
function minifyJs() {
    const input = document.getElementById("jsInput").value;
    if (!input.trim()) return;

    const minified = input
        .replace(/\s+/g, " ")
        .replace(/\s*([{};,:])\s*/g, "$1");

    document.getElementById("jsOutput").value = minified;
    toggleOutputButtons()
}
function copyJs() {
    CopyOutput(document.getElementById("jsOutput"));
}
function downloadJs() {
    const output = document.getElementById("jsOutput").value;
    downloadOutput("application/javascript", output);
}
function clearJs() {
    document.getElementById("jsInput").value = "";
    document.getElementById("jsOutput").value = "";
    toggleButtons();
    toggleOutputButtons();
}