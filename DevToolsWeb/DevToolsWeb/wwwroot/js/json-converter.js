// ================================
// Initialize JSON Editor
// ================================

const container = document.getElementById("jsonInput");

const editor = new JSONEditor(container, {
    mode: "code",
    mainMenuBar: false,
    statusBar: true,
    onChange: function () {
        toggleButtons();
    }

});

// ================================
// Button Events
// ================================
const btnConvert = document.getElementById("convertBtn");
const btnClear = document.getElementById("clearBtn");
const btnCopy = document.getElementById("copyBtn");
const btnDownload = document.getElementById("btnDownload");
const textareaButtons = [btnConvert, btnClear, btnCopy, btnDownload];
btnConvert.addEventListener("click", convertJson);

btnClear.addEventListener("click", function () {
    editor.set({});
    document.getElementById("outputEditor").textContent = "";
    toggleButtons()
});
btnCopy.addEventListener("click", function () {
    navigator.clipboard.writeText(
        document.getElementById("outputEditor").textContent
    );
});

function toggleButtons() {
    let hasText = false;
    try {
        const text = editor.getText().trim();
        hasText = text !== "" && text !== "{}";

    } catch {
        hasText = false;
    }
    toggleMainButtons(hasText, textareaButtons);
    //textareaButtons.forEach(btn => {
    //    btn.disabled = !hasText;
    //    btn.style.opacity = hasText ? 1 : 0.5;
    //    btn.style.cursor = hasText ? "pointer" : "not-allowed";
    //});

}
// ================================
// Main Convert Function
// ================================

function convertJson() {
    const type = document.getElementById("converterType").value;

    try {
        const json = editor.get();
        let output = "";

        switch (type) {
            case "csharp":
                output = generateCSharp(json, "Root");
                break;

            case "typescript":
                output = generateTypeScript(json, "Root");
                break;

            case "sql":
                output = generateSQL(json, "MyTable");
                break;

            case "xml":
                output = formatXml(jsonToXml(json, "root"));
                break;
        }

        document.getElementById("outputEditor").textContent = output;

    } catch (err) {
        showMessage("Invalid JSON: " + err.message, "err", "converterMessage")
    }
}

// ================================
// C# GENERATOR (Recursive)
// ================================

function generateCSharp(obj, className, classes = []) {

    if (Array.isArray(obj)) {
        return generateCSharp(obj[0], className, classes);
    }

    let properties = "";

    for (let key in obj) {
        const value = obj[key];
        const propName = capitalize(key);

        if (Array.isArray(value)) {
            if (typeof value[0] === "object") {
                const childClass = capitalize(key);
                generateCSharp(value[0], childClass, classes);
                properties += `    public List<${childClass}> ${propName} { get; set; }\n`;
            } else {
                properties += `    public List<${mapCSharpType(value[0])}> ${propName} { get; set; }\n`;
            }
        }
        else if (typeof value === "object" && value !== null) {
            const childClass = capitalize(key);
            generateCSharp(value, childClass, classes);
            properties += `    public ${childClass} ${propName} { get; set; }\n`;
        }
        else {
            properties += `    public ${mapCSharpType(value)} ${propName} { get; set; }\n`;
        }
    }

    const classDef =
        `public class ${className}
{
${properties}}`;

    classes.unshift(classDef);

    return classes.join("\n\n");
}

function mapCSharpType(value) {
    if (typeof value === "string") return "string";
    if (typeof value === "boolean") return "bool";
    if (typeof value === "number") {
        return Number.isInteger(value) ? "int" : "decimal";
    }
    return "object";
}

// ================================
// TYPESCRIPT GENERATOR
// ================================

function generateTypeScript(obj, interfaceName, interfaces = []) {

    if (Array.isArray(obj)) {
        return generateTypeScript(obj[0], interfaceName, interfaces);
    }

    let properties = "";

    for (let key in obj) {
        const value = obj[key];

        if (Array.isArray(value)) {
            if (typeof value[0] === "object") {
                const childInterface = capitalize(key);
                generateTypeScript(value[0], childInterface, interfaces);
                properties += `  ${key}: ${childInterface}[];\n`;
            } else {
                properties += `  ${key}: ${mapTypeScriptType(value[0])}[];\n`;
            }
        }
        else if (typeof value === "object" && value !== null) {
            const childInterface = capitalize(key);
            generateTypeScript(value, childInterface, interfaces);
            properties += `  ${key}: ${childInterface};\n`;
        }
        else {
            properties += `  ${key}: ${mapTypeScriptType(value)};\n`;
        }
    }

    const interfaceDef =
        `export interface ${interfaceName} {
${properties}}`;

    interfaces.unshift(interfaceDef);

    return interfaces.join("\n\n");
}

function mapTypeScriptType(value) {
    if (typeof value === "string") return "string";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    return "any";
}

// ================================
// SQL GENERATOR (Basic)
// ================================

function generateSQL(obj, tableName) {

    if (Array.isArray(obj)) {
        obj = obj[0];
    }

    let columns = "";

    for (let key in obj) {
        const value = obj[key];

        columns += `    ${key} ${mapSQLType(value)},\n`;
    }

    columns = columns.replace(/,\n$/, "\n");

    return `CREATE TABLE ${tableName} (
${columns});`;
}

function mapSQLType(value) {
    if (typeof value === "string") return "NVARCHAR(255)";
    if (typeof value === "boolean") return "BIT";
    if (typeof value === "number") {
        return Number.isInteger(value) ? "INT" : "DECIMAL(18,2)";
    }
    return "NVARCHAR(MAX)";
}

// ================================
// Helpers
// ================================
function jsonToXml(obj, rootName) {

    function convert(obj) {
        let xml = "";

        for (let key in obj) {

            if (Array.isArray(obj[key])) {

                obj[key].forEach(item => {
                    xml += `<${key}>${convert(item)}</${key}>`;
                });

            } else if (typeof obj[key] === "object" && obj[key] !== null) {

                xml += `<${key}>${convert(obj[key])}</${key}>`;

            } else {

                xml += `<${key}>${obj[key]}</${key}>`;

            }
        }

        return xml;
    }

    return `<${rootName}>${convert(obj)}</${rootName}>`;
}
function formatXml(xml) {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;

    xml.split('\r\n').forEach(node => {
        let indent = 0;

        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        }

        formatted += new Array(pad + 1).join('  ') + node + '\r\n';
        pad += indent;
    });

    return formatted;
}
function download(type) {
    const output = document.getElementById("outputEditor").textContent
    downloadOutput(type, output)
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
let fileInput = document.getElementById("jFConverterInput")
fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    validateFileInput(file, "converterMessage")
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            uploadJsonFile(event, editor, fileInput);
            toggleButtons(); // enable buttons                
        } catch (err) {
            showMessage("Invalid JSON file", "err", "convertermessage");
        }
    };
    reader.readAsText(file);
});
