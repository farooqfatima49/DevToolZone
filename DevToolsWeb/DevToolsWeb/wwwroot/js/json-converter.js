// ================================
// Initialize JSON Editor
// ================================

const container = document.getElementById("jsonInputEditor");

const editor = new JSONEditor(container, {
    mode: "code",
    mainMenuBar: false,
    statusBar: true
});

// ================================
// Button Events
// ================================

document.getElementById("convertBtn")
    .addEventListener("click", convertJson);

document.getElementById("clearBtn")
    .addEventListener("click", function () {
        editor.set({});
        document.getElementById("outputEditor").textContent = "";
    });

document.getElementById("copyBtn")
    .addEventListener("click", function () {
        navigator.clipboard.writeText(
            document.getElementById("outputEditor").textContent
        );
    });

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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}