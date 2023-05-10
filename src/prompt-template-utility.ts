export const normalizePromptTemplateToStore = (template: string) =>
    template
        .split("\n")
        .filter((line) => !line.match(/^\s*\/\//))
        .map((line) => line.trim())
        .join("\\n");

export const normalizePromptTemplateToEdit = (template: string) =>
    template.replace(/\\n/g, "\n");
