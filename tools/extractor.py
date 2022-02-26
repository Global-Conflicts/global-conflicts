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
    args = parser.parse_args()
    category = args.category

    for line in sys.stdin:
        data = json.loads(line)
        news_reports = extract_news_reports(data['items'], category)

        for report in news_reports:
            plaintext = convert_to_plain_text(report)
            hashed = sha256(plaintext.encode('utf-8')).hexdigest()[0:6]
            date = data['date']
            key = f'{date}-{hashed}'
            output = json.dumps({
                'key': key,
                'wikitext': report,
                'plaintext': plaintext,
                'date': date,
                'url': data['url']
            })
            sys.stdout.write(output + '\n')

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
    return child

def convert_to_plain_text(report):
    return wikitextparser.parse(report).plain_text()

if __name__ == "__main__":
    main()
