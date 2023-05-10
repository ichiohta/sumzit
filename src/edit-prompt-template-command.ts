import * as vscode from "vscode";

import {
    normalizePromptTemplateToEdit,
    normalizePromptTemplateToStore,
} from "./prompt-template-utility";

const COMMENT =
    "// Edit the template for a prompt.\n" +
    "// Use {!} to mark where the selected text is inserted\n";

export const editPromptTemplateCommand = async () => {
    const config = vscode.workspace.getConfiguration("sumzit");
    const templateText = config.get<string>("template") || "";
    const LANGUAGE_ID = "plaintext";

    const templateDocument = await vscode.workspace.openTextDocument({
        language: LANGUAGE_ID,
        content: normalizePromptTemplateToEdit(COMMENT + templateText),
    });

    const updateTemplate = (updatedDocument: vscode.TextDocument) => {
        if (templateDocument === updatedDocument) {
            const updated = normalizePromptTemplateToStore(templateDocument.getText());
            config.update(
                "template",
                updated,
                vscode.ConfigurationTarget.Global
            );
        }
    };

    vscode.workspace.onDidChangeTextDocument((event) =>
        updateTemplate(event.document)
    );
    vscode.workspace.onDidCloseTextDocument(updateTemplate);

    await vscode.window.showTextDocument(templateDocument);
};
