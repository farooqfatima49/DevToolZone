const container = document.getElementById("jsonOutput");
const options = {
    mode: "code",        // default Code mode
    modes: ["code", "tree"],
    search: true,
    mainMenuBar: true,
    onModeChange: function (newMode) {
        updateEditorButtons()
        updateToggleButton();
        expandCollapse();
    }
};
let searchMarkers1 = [];
let searchMarkers2 = [];
const editor = new JSONEditor(container, options);
// -------------------- Buttons --------------------
const btnFormat = document.getElementById("btnFormat");
const btnValidate = document.getElementById("btnValidate");
const btnClear = document.getElementById("btnClear");
const btnCopy = document.getElementById("btnCopy");
const btnExpand = document.getElementById("btnExpand");
const btnMinify = document.getElementById("btnMinify");
const btnFix = document.getElementById("btnFix");
const editorButtons = [btnClear, btnCopy];
const textareaButtons = [btnFormat, btnValidate, btnFix, btnMinify];

// -------------------- Update Buttons State --------------------
function updateToggleButton() {
    // Enable button only in tree mode
    btnExpand.disabled = editor.getMode() !== 'tree';
    btnExpand.style.opacity = btnExpand.disabled ? 0.5 : 1;
    btnExpand.style.cursor = btnExpand.disabled ? 'not-allowed' : 'pointer';
}
let isExpanded = false;

btnExpand.addEventListener('click', () => {
    expandCollapse()
});
function expandCollapse() {
    if (!btnExpand.disabled) {
        if (isExpanded) {
            editor.collapseAll();
            isExpanded = false;
        } else {
            editor.expandAll();
            isExpanded = true;
        }
        btnExpand.textContent = isExpanded ? 'Collapse' : 'Expand';
    }
}
const jsonInput = document.getElementById("jsonInput");

jsonInput.addEventListener("input", () => {
    const hasText = jsonInput.value.trim().length > 0;
    textareaButtons.forEach(btn => {
        btn.disabled = !hasText;
        btn.style.opacity = hasText ? 1 : 0.5;
        btn.style.cursor = hasText ? "pointer" : "not-allowed";
    });
});
const jsonOutput = document.getElementById("jsonOutput");
jsonOutput.addEventListener("input", () => {
    updateEditorButtons()
});
function updateEditorButtons() {
    let hasText = false;
    try {
        const json = editor.get();
        if (json && (Object.keys(json).length > 0 || Array.isArray(json) && json.length > 0)) {
            hasText = true;
        }
    } catch (e) {
        // invalid JSON, still rely on inputText
    }
    editorButtons.forEach(btn => {
        btn.disabled = !hasText;
        btn.style.opacity = hasText ? 1 : 0.5;
        btn.style.cursor = hasText ? "pointer" : "not-allowed";
    });
}

// -------------------- JSON Functions --------------------
function formatJson() {
    try {
        const input = document.getElementById("jsonInput").value;
        const parsed = JSON.parse(input);
        editor.set(parsed);
        showMessage("Valid JSON formatted successfully ✅", "success","formattermessage");
    } catch (e) {
        showMessage("Invalid JSON:" + e.message, "err", "formattermessage");       
    }
    updateEditorButtons();
}
function minifyJson() {
    try {
        const input = document.getElementById("jsonInput").value;
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        editor.set(parsed);
        document.getElementById("jsonInput").value = minified;
        showMessage("JSON minified successfully ✅", "success", "formattermessage");
    } catch (e) {
        showMessage("Invalid JSON: " + e.message, "err", "formattermessage");
    }

    // Update your buttons (enable/disable as per editor state)
    updateEditorButtons();
}
function validateJson() {
    const rawInput = document.getElementById("jsonInput").value;

    if (!rawInput.trim()) {
        showMessage("JSON input is empty ❌", "err", "formattermessage");
        return;
    }

    try {
        const parsed = JSON.parse(rawInput); // try parsing
        editor.set(parsed);                  // load JSON into editor if valid
        showMessage("Valid JSON ✅", "success", "formattermessage");
        updateEditorButtons();
    } catch (e) {
        showMessage(`Invalid JSON ❌ — ${e.message}`, "err", "formattermessage");

        // Highlight error line in textarea
        const pos = e.message.match(/position (\d+)/);
        if (pos) {
            const index = parseInt(pos[1], 10);
            const lines = rawInput.slice(0, index).split("\n");
            const lineNumber = lines.length;

            // Scroll textarea to the line
            const textarea = document.getElementById("jsonInput");
            const lineHeight = 20; // approximate line height in px
            textarea.scrollTop = (lineNumber - 1) * lineHeight;

            // Optional: highlight the error line
            const allLines = rawInput.split("\n");
            const highlighted = allLines.map((line, i) =>
                i === lineNumber - 1 ? `>>> ${line}` : line
            ).join("\n");
            textarea.value = highlighted;
        }

        //updateButtonsState();
    }
}
function clearFields() {
    editor.set({});
    showMessage("", "success", "formattermessage");
    updateEditorButtons();
}
function copyOutput() {
    try {
        const jsonText = editor.getText();
        navigator.clipboard.writeText(jsonText);
        showMessage("Copied to clipboard 📋", "success","formattermessage");
    } catch (e) {
        showMessage("Nothing to copy ❌", "err", "formattermessage");
    }
    updateEditorButtons();
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape all special characters
}
function replaceKeyValue(obj, key, newValue) {
    if (Array.isArray(obj)) {
        obj.forEach(item => replaceKeyValue(item, key, newValue));
    } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach(k => {
            if (k === key) {
                obj[k] = newValue; // replace value
            } else {
                replaceKeyValue(obj[k], key, newValue); // recursive
            }
        });
    }
}

//function replaceValueByKey() {
//    const key = document.getElementById("replaceKey").value.trim();
//    const value = document.getElementById("replaceValue").value;
//    const inputEl = document.getElementById("jsonInput");

//    if (!key) {
//        showMessage("Please enter a key to replace ❌", "err", "formattermessage");
//        return;
//    }

//    let inputText = inputEl.value;
//    if (!inputText) {
//        showMessage("JSON input is empty ❌", "err", "formattermessage");
//        return;
//    }

//    try {
//        const parsed = JSON.parse(inputText);

//        // Replace all matching key values
//        replaceKeyValue(parsed, key, value);

//        // Update textarea and editor
//        const newJsonText = JSON.stringify(parsed, null, 4);
//        inputEl.value = newJsonText;
//        editor.set(parsed);

//        showMessage(`All values of key "${key}" replaced ✅`, "success", "formattermessage");
//        // updateButtonsState();
//    } catch (err) {
//        showMessage("Invalid JSON: " + err.message, "err", "formattermessage")
//    }
//}
//function ParseJson(input) {
  
//    try {
//        JSON.parse(input);
//        editor.set(JSON.parse(input));
//    } catch (e) {
//        showMessage(`Invalid JSON ❌ — ${e.message}`, "err", "formattermessage");

//        // Attempt to highlight error line
//        const pos = e.message.match(/position (\d+)/);
//        if (pos) {
//            const index = parseInt(pos[1], 10);
//            const linesUntilError = input.slice(0, index).split("\n");
//            const lineNumber = linesUntilError.length;
//            // Optional: scroll editor to line
//            editor.scrollToLine(lineNumber - 1);
//        }
//    }
//}

function autoFixJson(input) {
    let fixed = input;
    fixed = fixed.replace(/'/g, '"'); // single → double quotes
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1'); // trailing commas
    return fixed;
}
function fixJson() {
   
    const input = document.getElementById("jsonInput").value;
    let fixedInput = autoFixJson(input);
    try {
        const parsed = JSON.parse(fixedInput);
        editor.set(parsed);
        showMessage("JSON parsed successfully after auto-fix ✅", "success", "formattermessage");
    } catch (err) {
        showMessage("Invalid JSON: " + err.message, "err", "formattermessage")
    }
}



function openFindBar(showReplace = false) {
    document.getElementById("editorFindBar").classList.remove("hidden");

    if (!showReplace) {
        document.getElementById("replaceGroup").style.display = "none";
    } else {
        document.getElementById("replaceGroup").style.display = "inline-block";
    }

    document.getElementById("editorFind").focus();
}

function closeFindBar() {
    document.getElementById("editorFindBar").classList.add("hidden");
    matches = [];
    updateMatchCounter();
}
let matches = [];
let currentMatchIndex = -1;
let searchMarkers = [];

// ------------------ Perform Search ------------------
function performSearch() {
    const word = document.getElementById("editorFind").value.trim();
    const aceEditor = editor.aceEditor;

    // Clear old markers
    searchMarkers.forEach(id => aceEditor.session.removeMarker(id));
    searchMarkers = [];
    matches = [];
    currentMatchIndex = -1;

    if (!word) {
        updateMatchCounter();
        return;
    }

    const Search = ace.require("ace/search").Search;

    const search = new Search();
    search.set({
        needle: word,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    });

    const ranges = search.findAll(aceEditor.session);

    ranges.forEach(range => {
        matches.push(range);

        const markerId = aceEditor.session.addMarker(
            range,
            "search-highlight",
            "text",
            false
        );

        searchMarkers.push(markerId);
    });

    if (matches.length > 0) {
        currentMatchIndex = 0;
        scrollToMatch();
    }

    updateMatchCounter();
}
function scrollToMatch() {
    if (matches.length === 0) return;

    const aceEditor = editor.aceEditor;
    const range = matches[currentMatchIndex];

    aceEditor.scrollToLine(range.start.row, true, true, function () { });
    aceEditor.selection.setRange(range);
}
function findNext() {
    if (matches.length === 0) return;

    currentMatchIndex = (currentMatchIndex + 1) % matches.length;
    scrollToMatch();
    updateMatchCounter();
}

function findPrev() {
    if (matches.length === 0) return;

    currentMatchIndex =
        (currentMatchIndex - 1 + matches.length) % matches.length;

    scrollToMatch();
    updateMatchCounter();
}

function updateMatchCounter() {
    const counter = document.getElementById("matchCount");
    if (matches.length === 0) {
        counter.innerText = "0 / 0";
    } else {
        counter.innerText =
            (currentMatchIndex + 1) + " / " + matches.length;
    }
}

function replaceCurrent() {
    if (matches.length === 0) return;

    const aceEditor = editor.aceEditor;
    const replaceValue = document.getElementById("editorReplace").value;

    const range = matches[currentMatchIndex];

    aceEditor.session.replace(range, replaceValue);

    validateAndRefresh();
}

function replaceAll() {
    const aceEditor = editor.aceEditor;
    const find = document.getElementById("editorFind").value;
    const replace = document.getElementById("editorReplace").value;

    if (!find) return;

    const text = aceEditor.getValue();

    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, "gi");

    const newText = text.replace(regex, replace);

    aceEditor.setValue(newText, -1);

    validateAndRefresh();
}
document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const dropdown = this.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
});
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        openFindBar(false);
    }

    if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        openFindBar(true);
    }

    if (e.key === "Escape") {
        closeFindBar();
    }
});
document.getElementById("searchBtn")
    .addEventListener("click", function () {
        performSearch();
    });
document.getElementById("editorFind")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });

function highlightWord(editor, word, markerArray) {
    const aceEditor = editor.aceEditor;
    const Range = ace.require("ace/range").Range;

    // Remove old markers
    markerArray.forEach(id => aceEditor.session.removeMarker(id));
    markerArray.length = 0;

    if (!word || word.trim() === "") return;

    const content = aceEditor.getValue();
    const lines = content.split("\n");

    lines.forEach((line, row) => {
        let col = 0;
        while ((col = line.indexOf(word, col)) !== -1) {
            const range = new Range(row, col, row, col + word.length);
            const markerId = aceEditor.session.addMarker(
                range,
                "search-highlight",
                "text",
                false
            );
            markerArray.push(markerId);
            col += word.length;
        }
    });
}
function validateAndRefresh() {
    const aceEditor = editor.aceEditor;

    try {
        JSON.parse(aceEditor.getValue());
        showMessage("Replace successful ✅", "green");
    } catch {
        showMessage("Warning: JSON is invalid ❌", "red");
    }

    performSearch();
}
function parseValue(value) {
    try {
        return JSON.parse(value);
    } catch {
        return value; // treat as string if not valid JSON
    }
}
function replaceKeyValue() {

    const keyToFind = document.getElementById("editorFind").value.trim();
    const newValueRaw = document.getElementById("editorReplace").value;

    if (!keyToFind) return;

    const aceEditor = editor.aceEditor;

    let jsonData;

    try {
        jsonData = JSON.parse(aceEditor.getValue());
    } catch (e) {
        showMessage("Invalid JSON:" + e.message, "err", "formattermessage");
        return;
    }

    let replaceCount = 0;

    function recursiveReplace(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(item => recursiveReplace(item));
        }
        else if (typeof obj === "object" && obj !== null) {

            Object.keys(obj).forEach(key => {

                if (key === keyToFind) {
                    obj[key] = parseValue(newValueRaw);
                    replaceCount++;
                }

                recursiveReplace(obj[key]);
            });
        }
    }

    recursiveReplace(jsonData);

    aceEditor.setValue(JSON.stringify(jsonData, null, 2), -1);

    showMessage(`${replaceCount} key value(s) replaced ✅`, "success","formattermessage");
}