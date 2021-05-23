import os
import sys
import json
import argparse
import wikitextparser
from hashlib import sha256
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('category', type=str, nargs='+')
    parser.add_argument('-o', '--output', type=str)
    args = parser.parse_args()
    category = args.category
    output_directory = args.output

    clean_directory_or_exit(output_directory)

    for line in sys.stdin:
        data = json.loads(line)
        news_reports = extract_news_reports(data['items'], category)
        news_reports = convert_to_plain_text(news_reports)

        for report in news_reports:
            save_to_file(report, data['date'], output_directory)

def clean_directory_or_exit(path):
    Path(path).mkdir(parents=True, exist_ok=True)
    files = list(filter(lambda f: f.name.endswith('.txt'), os.scandir(path)))
    for file in files:
        os.unlink(file.path)


def extract_news_reports(data, category):
    for node in data:
        if isinstance(node, dict) and (node['item'] in category):
            return flatten_news_reports(node['subitems'])
    return []

def flatten_news_reports(subitems):
    results = []
    for node in subitems:
        if isinstance(node, str):
            results.append(node)
        else:
            children = flatten_news_reports(node['subitems'])
            merged = [merge_parent_child(node['item'], child) for child in children]
            results.extend(merged)
    return results

def merge_parent_child(parent, child):
    return parent.strip(" :") + ': ' + child


def convert_to_plain_text(news_reports):
    return [wikitextparser.parse(report).plain_text() for report in news_reports]


def save_to_file(news_report, date, folder):
    hash_id = sha256(news_report.encode('utf-8')).hexdigest()[0:6]
    filename = f'{date}-{hash_id}.txt'
    path = os.path.join(folder, filename)
    with open(path, "w") as text_file:
        text_file.write(news_report)

if __name__ == "__main__":
    main()
