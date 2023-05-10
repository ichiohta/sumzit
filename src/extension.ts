import * as vscode from 'vscode';

import { createCompleteCommand, CommandMode } from './complete-command';
import { editPromptTemplateCommand } from './edit-prompt-template-command';

export function activate(context: vscode.ExtensionContext) {
	const registerCommand = (name: string, command: () => void) => {
		const disposable = vscode.commands.registerCommand(name, command);
		context.subscriptions.push(disposable);
	}

	const replaceCommand = createCompleteCommand(context, CommandMode.REPLACE);
	const insertCommand = createCompleteCommand(context, CommandMode.INSERT);
	const outputCommand = createCompleteCommand(context, CommandMode.OUTPUT);

	registerCommand('sumzit.replaceWithCompletion', replaceCommand);
    registerCommand('sumzit.insertCompletion', insertCommand);
	registerCommand('sumzit.outputCompletion', outputCommand);
	registerCommand('sumzit.editPromptTemplate', editPromptTemplateCommand);
}

export function deactivate() {}
