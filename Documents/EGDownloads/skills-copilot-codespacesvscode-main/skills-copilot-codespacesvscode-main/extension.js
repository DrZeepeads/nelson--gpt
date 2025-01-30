const vscode = require('vscode');

function calculateNumbers(var1, var2) {
    // Perform calculation and show result in VS Code information message
    const result = var1 + var2;
    vscode.window.showInformationMessage(`Calculation result: ${result}`);
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('skills-copilot-extension.calculateNumbers', () => {
        // Prompt user for two numbers
        vscode.window.showInputBox({ prompt: 'Enter first number' })
            .then(var1 => {
                if (var1) {
                    vscode.window.showInputBox({ prompt: 'Enter second number' })
                        .then(var2 => {
                            if (var2) {
                                calculateNumbers(Number(var1), Number(var2));
                            }
                        });
                }
            });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
