import * as vscode from "vscode";

import {
    TEMPLATE_URI
} from './sumzit-template-provider';

export const editPromptTemplateCommand = async () => {
    const templateDocument = await vscode.workspace.openTextDocument(TEMPLATE_URI);
    await vscode.window.showTextDocument(templateDocument);
};
