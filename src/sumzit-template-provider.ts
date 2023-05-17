import * as vscode from "vscode";

import {
    normalizePromptTemplateToEdit,
    normalizePromptTemplateToStore,
} from "./prompt-template-utility";

export const TEMPLATE_URI = vscode.Uri.parse("sumzit:/template");

const COMMENT =
    "// Edit the template for a prompt.\n" +
    "// Use {!} to mark where the selected text is inserted\n";

export class SumzitTemplateProvider implements vscode.FileSystemProvider {
    private emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    private timeModified = 0;

    private validateFilePath(uri: vscode.Uri) {
        if (
            uri.toString().toLowerCase() !==
            TEMPLATE_URI.toString().toLowerCase()
        ) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
    }

    public onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> =
        this.emitter.event;

    public watch(
        uri: vscode.Uri,
        options: {
            readonly recursive: boolean;
            readonly excludes: readonly string[];
        }
    ): vscode.Disposable {
        // Ignore
        return new vscode.Disposable(() => {});
    }

    public stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        this.validateFilePath(uri);
        return {
            type: vscode.FileType.File,
            ctime: 0,
            mtime: this.timeModified,
            size: 0,
        };
    }

    public readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
        this.validateFilePath(uri);
        const config = vscode.workspace.getConfiguration("sumzit");
        const templateText = normalizePromptTemplateToEdit(
            config.get<string>("template") || ""
        );
        return Buffer.from(COMMENT + templateText, "utf-8");
    }

    public writeFile(
        uri: vscode.Uri,
        content: Uint8Array,
        options: { readonly create: boolean; readonly overwrite: boolean }
    ): void | Thenable<void> {
        this.validateFilePath(uri);
        const config = vscode.workspace.getConfiguration("sumzit");
        const templateText = normalizePromptTemplateToStore(content.toString());
        config.update(
            "template",
            templateText,
            vscode.ConfigurationTarget.Global
        );
        this.timeModified = new Date().getTime();
    }

    public readDirectory(
        uri: vscode.Uri
    ): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        return [[TEMPLATE_URI.path, vscode.FileType.File]];
    }

    public createDirectory(uri: vscode.Uri): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions(uri);
    }

    public delete(
        uri: vscode.Uri,
        options: { readonly recursive: boolean }
    ): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions(uri);
    }

    public rename(
        oldUri: vscode.Uri,
        newUri: vscode.Uri,
        options: { readonly overwrite: boolean }
    ): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions(oldUri);
    }

    public copy?(
        source: vscode.Uri,
        destination: vscode.Uri,
        options: { readonly overwrite: boolean }
    ): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions(source);
    }
}
