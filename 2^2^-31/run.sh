#!/bin/sh

PREV_TIME=$(date +%s%N);

gcc -g aberth.c -O3 -o aberth -lgmp -lmpfr -DPREC=0x7FFFFF

./aberth

AFTER_TIME=$(date +%s%N);

echo "$(($(($AFTER_TIME - $PREV_TIME))/1000000)) ms"