#!/bin/sh
platex raw.tex
dvipdfmx raw.dvi
open raw.pdf
