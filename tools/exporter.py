import os
import sys
import json
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-o', '--output', type=str)
    args = parser.parse_args()
    output_directory = args.output

    clean_directory(output_directory)

    for line in sys.stdin:
        data = json.loads(line)
        save_to_file(data['key'], data['plaintext'], data['date'], output_directory)
        sys.stdout.write(line)

def clean_directory(path):
    Path(path).mkdir(parents=True, exist_ok=True)
    files = list(filter(lambda f: f.name.endswith('.txt'), os.scandir(path)))
    for file in files:
        os.unlink(file.path)


def save_to_file(key, news_report, date, folder):
    filename = f'{key}.txt'
    path = os.path.join(folder, filename)
    with open(path, "w") as text_file:
        text_file.write(news_report)

if __name__ == "__main__":
    main()
