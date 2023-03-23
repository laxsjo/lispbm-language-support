# lispbm-language-support README

This brings basic language support for the lispBM language to vscode.

[LispBM](https://github.com/svenssonjoel/lispBM) is a functional programming
language in the lisp family designed to be run on microcontrollers.

This is the first real extention I write for vscode, so don't put too much
faith in this package.

## Features

This package adds the new language `LispBM`.

The primary feature are the provided Textmate grammar definitions.
This means that basic syntax highlighting is supported (no [semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)!).

Bracket definitions are also provided.

<!--
Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

## Requirements

This package has no requirements, just install and enjoy! :)

## Extension Settings

There are no extensions for this package.

<!-- Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

-   Only the first and last parameters in macro and function definitions get
    proper syntax highlighting.
-   `cond` blocks don't have proper syntax highlighting.

## Release Notes

### 0.0.1

Initial release of the package