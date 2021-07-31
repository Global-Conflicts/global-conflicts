import os
import sys
import json
import argparse
from hashlib import sha256
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-o', '--output', type=str)
    args = parser.parse_args()
    output_directory = args.output

    clean_directory(output_directory)

    for line in sys.stdin:
        data = json.loads(line)
        save_to_file(data['plaintext'], data['date'], output_directory)
        sys.stdout.write(line)

def clean_directory(path):
    Path(path).mkdir(parents=True, exist_ok=True)
    files = list(filter(lambda f: f.name.endswith('.txt'), os.scandir(path)))
    for file in files:
        os.unlink(file.path)


def save_to_file(news_report, date, folder):
    hash_id = sha256(news_report.encode('utf-8')).hexdigest()[0:6]
    filename = f'{date}-{hash_id}.txt'
    path = os.path.join(folder, filename)
    with open(path, "w") as text_file:
        text_file.write(news_report)

if __name__ == "__main__":
    main()
