#!/bin/bash

for f in *.svg; do
  rsvg-convert "$f" -o "${f%.svg}.png"
done