# sumzit - An AI Authoring Aid

## Feature

This extension allows you to complete a selected region using [OpenAI](https://platform.openai.com/docs/guides/completion) and use the result in a few different ways.

1. Replace the selected region with the completion

2. Insert the completion where the cursor is

3. Open a new document with the completion

4. Write the completion to the dedicated output window.

If you do not select a region, it's considered that the entire file is selected.

You can customize the prompt for OpenAI chat completion to articulate the task with a selected region, giving you more control over the output.

## How to Use Completion

First, you need to configure your API key for OpenAI API in the settings. You can get one [here](https://platform.openai.com/).

[]()




## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

### It's Bot Quick
Completion takes time, especially when the prompt is complicated. This asynchronicity might lead to some confusion especially when you are invoking 'sumzit:Replace selection with completion'. It will try to replace


 You can cancel it any time 

- You can cancel 
Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 1.0.0

Initial release of sumzit.
