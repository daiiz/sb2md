#!/bin/sh
echo "run"
platex raw.tex
dvipdfmx raw.dvi
open raw.pdf
