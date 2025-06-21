{ pkgs, ... }:
{
  # Used to find the project root
  projectRootFile = "flake.nix";

  programs.nixfmt.enable = true;
  programs.prettier.enable = true;

  # Files to exclude from formatting.
  settings.global.excludes = [
    # Generated files
    "dist/**"

    # No formatter for LispBM :(
    "*.lbm"
    "*.lisp"

    # Misc files which don't need formatting
    ".gitignore"
    ".gitattributes"
    ".vscodeignore"
    "*.png"
  ];
}
