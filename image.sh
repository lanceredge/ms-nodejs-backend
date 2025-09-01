#!/bin/bash

folder="./img"

echo "Checking images in $folder..."

for file in "$folder"/*; do
    # Skip non-files
    [ -f "$file" ] || continue

    # Get image dimensions
    width=$(sips -g pixelWidth "$file" | awk '/pixelWidth/ {print $2}')
    height=$(sips -g pixelHeight "$file" | awk '/pixelHeight/ {print $2}')

    # Make sure we got valid output
    if [[ "$width" =~ ^[0-9]+$ && "$height" =~ ^[0-9]+$ ]]; then
        if [ "$width" -eq "$height" ]; then
            echo "[1:1]  $(basename "$file")"
        else
            echo "[≠1:1] $(basename "$file")"
        fi
    else
        echo "[SKIP] $(basename "$file") - Not a valid image?"
    fi
done
