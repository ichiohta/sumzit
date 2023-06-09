import * as vscode from "vscode";

import { createCompleteCommand, CommandMode } from "./complete-command";
import { editPromptTemplateCommand } from "./edit-prompt-template-command";
import { SumzitTemplateProvider, TEMPLATE_URI } from "./sumzit-template-provider";

export function activate(context: vscode.ExtensionContext) {
    const registerCommand = (name: string, command: () => void) => {
        const disposable = vscode.commands.registerCommand(name, command);
        context.subscriptions.push(disposable);
    };

    const replaceCommand = createCompleteCommand(context, CommandMode.REPLACE);
    const insertBeforeCommand = createCompleteCommand(context, CommandMode.INSERT_BEFORE);
    const insertAfterCommand = createCompleteCommand(context, CommandMode.INSERT_AFTER);
    const outputCommand = createCompleteCommand(context, CommandMode.OUTPUT);
    const documentCommand = createCompleteCommand(context, CommandMode.DOCUMENT);

    registerCommand("sumzit.replaceWithCompletion", replaceCommand);
    registerCommand("sumzit.insertCompletionBefore", insertBeforeCommand);
    registerCommand("sumzit.insertCompletionAfter", insertAfterCommand);
    registerCommand("sumzit.outputCompletion", outputCommand);
    registerCommand("sumzit.documentCompletion", documentCommand);
    registerCommand("sumzit.editPromptTemplate", editPromptTemplateCommand);

    vscode.workspace.registerFileSystemProvider(
        TEMPLATE_URI.scheme,
        new SumzitTemplateProvider(),
        {
            isCaseSensitive: false,
        }
    );
}

export function deactivate() {}
