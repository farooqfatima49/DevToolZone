
const btnCompare = document.getElementById("btnCompare");
const btnClear = document.getElementById("btnClear");
const btnDownload = document.getElementById("btnDownload");
const encoderButtons = [btnEncode, btnDecode, btnClear];
const outputButtons = [btnCopy, btnOutputClear, btnDownload];
const jsonInput = document.getElementById("inputText");

jsonInput.addEventListener("input", toggleButtons);
function toggleButtons() {
    const hasText = jsonInput.value.trim().length > 0;
    encoderButtons.forEach(btn => {
        btn.disabled = !hasText;
        btn.style.opacity = hasText ? 1 : 0.5;
        btn.style.cursor = hasText ? "pointer" : "not-allowed";
    });
}
const jsonOutput = document.getElementById("outputText");
jsonOutput.addEventListener("input", () => {
    toggleOutputButtons()
});
function toggleOutputButtons() {
    const hasText = jsonOutput.value.trim().length > 0;
    outputButtons.forEach(btn => {
        btn.disabled = !hasText;
        btn.style.opacity = hasText ? 1 : 0.5;
        btn.style.cursor = hasText ? "pointer" : "not-allowed";
    });
}
function encodeBase64() {

    const input = document.getElementById("inputText").value;

    try {

        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById("outputText").value = encoded;
        toggleOutputButtons()
    } catch {
        showMessage("Unable to encode the input.", "err", "encodermessage")       
    }

}

function decodeBase64() {
    const input = document.getElementById("inputText").value;
    try {

        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById("outputText").value = decoded;
        toggleOutputButtons()
    } catch {
        showMessage("Invalid Base64 string.", "err", "encodermessage")       
    }

}

function copyOutput() {

    const output = document.getElementById("outputText");
    output.select();
    document.execCommand("copy");

}

function clearFields(bit) {
    if (bit == 1) {
        document.getElementById("outputText").value = "";
        toggleOutputButtons()
    }
    else {
        document.getElementById("inputText").value = "";
        toggleButtons()
    }     
}
function download(type) {
    const output = document.getElementById("outputText").value;
    downloadOutput(type, output)
}
//function downloadOutput() {
//    debugger
//    const output = document.getElementById("outputText").value;
//    download("base64-output.txt", "encodermessage", output);   
//}
let fileInput = document.getElementById("encoderInput")
fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
     if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showMessage("File too large. Max 2MB allowed.", "err", "encodermessage")   
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        document.getElementById("inputText").value = content;
        toggleButtons()
    };

    reader.readAsText(file);
});