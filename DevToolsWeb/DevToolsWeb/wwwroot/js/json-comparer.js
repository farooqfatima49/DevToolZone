
const container1 = document.getElementById("editor1");
const container2 = document.getElementById("editor2");
const options = {
    mode: "code",
    mainMenuBar: false // default Code mod
};
const editor1 = new JSONEditor(container1, options);
const editor2 = new JSONEditor(container2, options);
let markers1 = [], markers2 = [];
function clearEditors() {
    const ace1 = editor1.aceEditor;
    const ace2 = editor2.aceEditor;

    // Remove previous markers
    markers1.forEach(id => ace1.session.removeMarker(id));
    markers2.forEach(id => ace2.session.removeMarker(id));

    markers1 = [];
    markers2 = [];

    // Clear text
    editor1.updateText('');
    editor2.updateText('');
    document.getElementById('comparermessage').innerText = '';
}

function compareJson() {    
    try {
        const obj1 = editor1.get();
        const obj2 = editor2.get();

        const text1 = JSON.stringify(obj1, null, 2);
        const text2 = JSON.stringify(obj2, null, 2);

        editor1.updateText(text1);
        editor2.updateText(text2);

        highlightDifferences(text1, text2);

        if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
            showMessage("JSONs are identical ✅", "success", "comparermessage") 
           
        } else {
            showMessage("JSONs have differences ❌", "err", "comparermessage") 
           
        }

    } catch (err) {
        showMessage("Invalid JSON: " + err.message, "err", "comparermessage")
    }
}
function normalizeJson(text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text; // fallback if invalid
    }
}
function highlightDifferences(text1, text2) {

    const normalized1 = normalizeJson(text1);
    const normalized2 = normalizeJson(text2);

    const lines1 = normalized1.split("\n");
    const lines2 = normalized2.split("\n");

    const ace1 = editor1.aceEditor;
    const ace2 = editor2.aceEditor;

    const Range = ace.require("ace/range").Range;

    // Clear old markers safely
    markers1.forEach(id => ace1.session.removeMarker(id));
    markers2.forEach(id => ace2.session.removeMarker(id));
    markers1 = [];
    markers2 = [];

    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {

        const line1 = lines1[i] ?? "";
        const line2 = lines2[i] ?? "";

        if (line1.trim() !== line2.trim()) {

            if (i < lines1.length) {
                const range1 = new Range(i, 0, i, line1.length);
                const markerId1 = ace1.session.addMarker(range1, "diff-highlight", "fullLine");
                markers1.push(markerId1);
            }

            if (i < lines2.length) {
                const range2 = new Range(i, 0, i, line2.length);
                const markerId2 = ace2.session.addMarker(range2, "diff-highlight", "fullLine");
                markers2.push(markerId2);
            }
        }
    }
}
//function highlightDifferences(text1, text2) {
//    const lines1 = text1.split("\n");
//    const lines2 = text2.split("\n");

//    const ace1 = editor1.aceEditor;
//    const ace2 = editor2.aceEditor;

//    const Range = ace.require("ace/range").Range; // use global ace

//    // Remove previous markers
//    markers1.forEach(id => ace1.session.removeMarker(id));
//    markers2.forEach(id => ace2.session.removeMarker(id));
//    markers1 = [];
//    markers2 = [];

//    const maxLines = Math.max(lines1.length, lines2.length);

//    for (let i = 0; i < maxLines; i++) {
//        if (lines1[i] !== lines2[i]) {
//            if (lines1[i] !== undefined) {
//                markers1.push(ace1.session.addMarker(new Range(i, 0, i, 1), "diff-highlight", "fullLine"));
//            }
//            if (lines2[i] !== undefined) {
//                markers2.push(ace2.session.addMarker(new Range(i, 0, i, 1), "diff-highlight", "fullLine"));
//            }
//        }
//    }
//}