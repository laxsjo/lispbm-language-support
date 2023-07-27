# Change Log

All notable changes to the "lispbm-language-support" extension will be documented in this file.

<!-- Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file. -->

## 0.0.1

-   Initial release

## 0.1.0

-   Changed line comments from `;;` to single `;`. This seems to fix an issue where
    bracket pair colorization would colorize brackets in comments.
-   Added default file icon

## 0.1.1

-   Fixed syntax grammar issues, including broken quoted lists, and supporting
    inserting function expressions into quasi-quoted lists
-   Added grammar for `let`. It should now detect variable names in the binding
    list.
-   Fixed all function related parameter lists. This included also adding
    recognition for `fn` and `lambda` expressions as functions, so that their
    parameter lists got changed properly.

## 0.2.0

-   Added indentation to language config. Pressing enter will now auto indent.
-   Fixed comments not being detected in `let` and parameter list expressions
-   Added more precise textmate scopes to operators.
-   Made splice and insert (`,` and `,@`) operators be recognized when in front of
    single symbol.

### 0.2.2

-   Add syntax grammar support for `@const-start` and `@const-end` (their
    [documentation](https://github.com/vedderb/bldc/blob/master/lispBM/lispBM/doc/lbmref.md#const-start)).

### 0.2.3

-   Fix `<=`, `>=`, and `not-eq` not being recognized as operators.
-   Add syntax support for match structure.

### 0.3.0

-   Added the ability to specify custom folding ranges. Start and end a range with
    `;#region` and `;#endregion`.
    See the description for an example.
-   Fixed that moving line up or down decreased the indentation too incorrectly.
-   Lines are now automatically indented when pressing enter in the middle of a
    list.
-   Fixed function calls as the matched expression in a match block not being
    recognized as functions in the grammar.
-   Fixed that the `true` and `false` bindings to `t` and `nil` weren't
    recognized as language constants.

### 0.3.1

-   Added support for the new `@const-symbol-strings`
    ([documentation](https://github.com/svenssonjoel/lispBM/blob/master/doc/lbmref.md#const-symbol-strings))

### 0.3.2

-   Fixed escaped characters in strings not being detected.

### 0.3.3

-   Fixed `read-eval-program` and `undefine` not being detected as special
    forms.
-   `import` is now detected as a control keyword. ([documentation](https://github.com/vedderb/bldc/blob/master/lispBM/README.md#import)).
-   `defunret` functions are now supported ([documentation](https://github.com/vedderb/bldc/blob/master/lispBM/README.md#defunret)).

### 0.3.4

-   Add support for operators `cdr`, `first`, `rest`, and `bitwise-*`
-   Add support for all different number type postfixes. (ex: `1u32`, `3.14f64`)
    (see more examples in the [LispBM guide](https://github.com/vedderb/bldc/blob/master/lispBM/lispBM/doc/manual/ch1_introduction.md#values-and-types))
-   There is a known bug that negative integers aren't detected...
