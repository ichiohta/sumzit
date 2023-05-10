import * as vscode from "vscode";

import { createComplete } from "./complete";

const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0.0;

export enum CommandMode {
    REPLACE = 0,
    INSERT = 1,
    OUTPUT = 2,
}

const createCompleteWithConfiguration = (
    config: vscode.WorkspaceConfiguration
) => {
    const apiKey = config.get<string>("apiKey") || "";
    const model = config.get<string>("model") || "";
    const maxTokens = config.get<number>("maxTokens") || DEFAULT_MAX_TOKENS;
    const temperature =
        config.get<number>("temperature") || DEFAULT_TEMPERATURE;
    return createComplete({ apiKey, model, maxTokens, temperature });
};

const reportError = (error: unknown) => {
    const typed = error as {
        response?: { data: string; status: string };
        message?: string;
    };
    if (typed.response) {
        console.log(typed.response.status);
        console.log(typed.response.data);
    } else {
        console.log(typed.message);
    }
};

const withProgress = (
    message: string,
    task: (isCancelled: () => boolean) => Promise<void>
) => {
    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Your smart AI",
            cancellable: true,
        },
        (progress, token) =>
            new Promise<void>(async (resolve) => {
                progress.report({
                    message,
                    increment: 1,
                });
                try {
                    const isCancelled = () => token.isCancellationRequested;
                    await task(isCancelled);
                } catch (error) {
                    reportError(error);
                } finally {
                    resolve();
                }
            })
    );
};

const selectAll = (editor: vscode.TextEditor): vscode.Selection => {
    const { document } = editor;
    const lastLine = document.lineCount - 1;
    const wholeRange = new vscode.Range(
        0, 0, lastLine, document.lineAt(lastLine).text.length
    );
    return new vscode.Selection(wholeRange.start, wholeRange.end);
}

const getSelection = (editor: vscode.TextEditor): { text: string, selection: vscode.Selection } => {
    const selectedText = editor.document.getText(editor.selection);
    const { start, end } = editor.selection;
    const noSelection = (start.compareTo(end) === 0);
    const selection = noSelection ? selectAll(editor) : new vscode.Selection(start, end);
    const text = noSelection ? editor.document.getText(selection) : selectedText;

    return {
        text,
        selection,
    };
};

export const createCompleteCommand = (
    context: vscode.ExtensionContext,
    mode: CommandMode
) => {
    return async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const config = vscode.workspace.getConfiguration("sumzit");
        const template = config.get<string>("template") || "";
        const complete = createCompleteWithConfiguration(config);

        withProgress("Calculating", async (isCancelled: () => boolean) => {
            const { text, selection } = getSelection(editor);
            const prompt = template
                .replace(/\\n/g, "\r\n")
                .replace(/\{!\}/, text);
            const completion = await complete(prompt);

            if (isCancelled()) {
                return;
            }

            editor.edit((editBuilder) => {
                if (mode === CommandMode.REPLACE) {
                    // Replace with the existing text
                    editBuilder.replace(selection, completion);
                } else if (mode === CommandMode.INSERT) {
                    // Insert at the current location
                    const start = editor.selection.start;
                    editBuilder.insert(start, completion);
                    editBuilder.insert(start, "\n");
                } else if (mode === CommandMode.OUTPUT) {
                    const output = vscode.window.createOutputChannel('Sumzit');
                    output.appendLine(completion);
                    output.show();
                }
            });
        });
    };
};
