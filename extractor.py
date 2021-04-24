import sys
import json
import argparse
import wikitextparser

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('category', type=str, nargs='+')
    args = parser.parse_args()
    category = args.category

    for line in sys.stdin:
        data = json.loads(line)
        news_reports = extract_news_reports(data['items'], category)
        news_reports = convert_to_plain_text(news_reports)

        print(news_reports)

def extract_news_reports(data, category):
    for node in data:
        print(node['item'])
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





if __name__ == "__main__":
    main()
