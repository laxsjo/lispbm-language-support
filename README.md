Temp README

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

```clj
;#region My Optional Region

; This can be folded :)
(def a 5)
(print a)

;#endregion
```

## Requirements

- A serial port accessible to the OS (e.g. `/dev/ttyUSB0` on Linux, `COM3` on Windows)
- A device running LispBM with the VESC packet protocol interface (e.g. the ESP32C3 example from the LispBM repository)

## Device Integration

Version 0.4.0 adds direct communication with LispBM devices over serial using the VESC packet protocol.

When a `.lbm` or `.lisp` file is open, a row of buttons appears in the editor title bar:

| Button | Command | Description |
|--------|---------|-------------|
| `plug` | Connect | Connect to a serial port |
| `disconnect` | Disconnect | Close the serial connection |
| `cloud-upload` | Upload | Stream the current file to the device |
| `play` | Evaluate | Evaluate an expression on the device |
| `refresh` | Reset | Restart the LispBM evaluator |
| `pause` | Pause | Pause the evaluator |
| `continue` | Continue | Resume the evaluator |
| `pulse` | Stats | Show heap and memory usage |

Device output (print statements and REPL results) appears in the **LispBM** output channel.

All commands are also available via `Ctrl+Shift+P` → `LispBM: ...`.

## Extension Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `lispbm.serialPort` | *(prompt on connect)* | Serial port path, e.g. `/dev/ttyUSB0` |
| `lispbm.baudRate` | `115200` | Baud rate for the serial connection |
| `lispbm.streamChunkSize` | `256` | Chunk size in bytes when uploading code |

## Known Issues

None! :)

## Building

```shell
make          # compile TypeScript
make package  # produce a .vsix installable package
```

Install the resulting `.vsix` via Extensions panel → `...` → **Install from VSIX...**

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

### 0.3.5

- Fix bug causing incorrect symbol highlighting
- Support strings and numbers in match patterns
- Support the ".lbm" extension
- Remove the ".lispbm" extension

### 0.3.6

- Add missing special forms
- Fix negative integer parsing

### 0.3.7

- Add support for `defmacro`

### 0.4.0

- Add basic VESC Packet compatibility, allowing devices to be connected over serial interfaces
