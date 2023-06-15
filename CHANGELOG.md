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

-   Add the ability to specify custom folding ranges. Start and end a range with `;#region` and `;#endregion`.
