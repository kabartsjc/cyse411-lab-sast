// app.js

// Example of eval() usage (vulnerable to code injection)
function evalInjection(userInput) {
    eval("console.log('User input: ' + " + userInput + ")");
}

// Example of insecure use of `document.write` (can lead to XSS)
function insecureWrite(userInput) {
    document.write("<h1>" + userInput + "</h1>");
}

// Call functions with simulated insecure input
evalInjection("' ; alert('Hacked!'); //");
insecureWrite("<script>alert('XSS');</script>");
