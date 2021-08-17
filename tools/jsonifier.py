import os
import sys
import json
import argparse
from hashlib import sha256
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('path', type=str)
    args = parser.parse_args()
    path = args.path

    with open(path, "w") as text_file:
        text_file.write('{"incidents":[')
        text_file.write(','.join(sys.stdin))
        text_file.write(']}')

if __name__ == "__main__":
    main()
