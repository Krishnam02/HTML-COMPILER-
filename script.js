// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Apply Saved Theme on Load
window.onload = function () {
    loadHistory();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
};

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// Run Code
function runCode() {
    let htmlCode = document.getElementById("html-code").value;
    let cssCode = `<style>${document.getElementById("css-code").value}</style>`;
    let jsCode = document.getElementById("js-code").value;
    let preview = document.getElementById("preview").contentWindow.document;
    let errorConsole = document.getElementById("error-console");

    errorConsole.style.display = "none";
    errorConsole.innerText = "";

    preview.open();
    preview.write(`
        <html>
        <head>${cssCode}</head>
        <body>
            ${htmlCode}
            <script>
                window.onerror = function(message, source, lineno, colno, error) {
                    const errorBox = parent.document.getElementById("error-console");
                    errorBox.style.display = "block";
                    errorBox.innerText = "🚨 JS Error: " + message + " at line " + lineno;
                };
                try {
                    ${jsCode}
                } catch (err) {
                    window.onerror(err.message, "", err.lineNumber);
                }
            <\/script>
        </body>
        </html>
    `);
    preview.close();
}

// Save & Load Projects
function saveCode() {
    let codeData = {
        html: document.getElementById("html-code").value,
        css: document.getElementById("css-code").value,
        js: document.getElementById("js-code").value,
        time: new Date().toLocaleString()
    };
    let history = JSON.parse(localStorage.getItem("codeHistory")) || [];
    history.push(codeData);
    localStorage.setItem("codeHistory", JSON.stringify(history));
    loadHistory();
}

function loadLastCode() {
    let history = JSON.parse(localStorage.getItem("codeHistory")) || [];
    if (history.length > 0) {
        let lastCode = history[history.length - 1];
        document.getElementById("html-code").value = lastCode.html;
        document.getElementById("css-code").value = lastCode.css;
        document.getElementById("js-code").value = lastCode.js;
    }
}

// Load & Delete History
function loadHistory() {
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("codeHistory")) || [];

    history.forEach((code, index) => {
        let div = document.createElement("div");
        div.classList.add("history-item");
        div.innerHTML = `📄 ${code.time} <button onclick="deleteHistory(${index})">❌</button>`;
        historyList.appendChild(div);
    });
}

function deleteHistory(index) {
    let history = JSON.parse(localStorage.getItem("codeHistory")) || [];
    history.splice(index, 1);
    localStorage.setItem("codeHistory", JSON.stringify(history));
    loadHistory();
}
