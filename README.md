# LispBM language support

This brings basic language support for the lispBM language to vscode.

[LispBM](https://github.com/svenssonjoel/lispBM) is a functional programming
language in the lisp family designed to be run on microcontrollers.

This is the first real extention I write for vscode, so don't put too much
faith in this extension.

## Features

This extension adds the new language `LispBM`.

The primary feature are the provided Textmate grammar definitions.
This means that basic syntax highlighting is supported (no [semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)!).

Bracket definitions are also provided.

Custom folding ranges can be specified using comments. Start the range with a
`;#region` line and end it with a `;#endregion` comment.
Custom text after `#region` and `#endregion` is allowed.
Example:

```lisp
;#region My Optional Region

; This can be folded :)
(def a 5)
(print a)

;#endregion
```

## Requirements

This extension has no requirements, just install and enjoy! :)

## Extension Settings

There are no settings for this extension.

<!-- Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## Known Issues

None! :)

## Building

You need to have vsce and Node installed. Make them available with `nix develop` (you need to have Nix installed).
Then run

```shell
mkdir dist
vsce package -o dist/
```

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for more details

### 0.0.1

Initial release of the extension.

### 0.1.0

- Changed line comments from `;;` to single `;`. This seems to fix an issue where
  bracket pair colorization would colorize brackets in comments.
- Added default file icon

### 0.1.1

- Fixed a lot of syntax grammar issues, including broken quoted lists, and supporting
  inserting function expressions into quasi-quoted lists, and lots of function
  parameter list improvements.

### 0.2.0

- Add indentation to language config. Pressing enter will now auto indent more
  often.
- Improved textmate operator recognition.

### 0.2.2

- Add syntax grammar support for `@const-start` and `@const-end` (their
  [documentation](https://github.com/vedderb/bldc/blob/master/lispBM/lispBM/doc/lbmref.md#const-start)).

### 0.2.3

- Add syntax support for match structure.
- Fix `<=`, `>=`, and `not-eq` not being recognized as operators.

### 0.3.0

- Add custom folding marker comments
- Fix a lot of indentation issues.
- Fix unrecognized `true` and `false` constants.

### 0.3.1

- Add support for `@const-symbol-strings`

### 0.3.2

- Fix escaped characters in strings not being detected.

### 0.3.3

- Add support for `read-eval-program`, `undefine`, `import`, and `defunret`.

### 0.3.4

- Add more operators, like `cdr`
- Add missing numeric literals
