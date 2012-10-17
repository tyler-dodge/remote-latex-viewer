Remote LaTeX Viewer
===================

CLI for watching and compiling a .tex file. Serves the file to all remotes listening on selected port, and refreshes on changes.

Usage
-----

* `rlv <tex-file> <port (default 3000)>`

**Example Usage:**

* `/path/to/rlv.sh myFile.tex`
* `open http://localhost:3000`
* Save myFile.tex and it will recompile and show the new pdf in the browser. If there are compile erorrs, they will be shown.
