import sys
import json
import re
import wikitextparser

def main():
    for line in sys.stdin:
        data = json.loads(line)
        try:
            data = parse_date(data)
            output = json.dumps(data)
            sys.stdout.write(output + '\n')
        except Exception as e:
            pass

def parse_date(data):
    source = data['source']
    match = re.search(r'\|content=(.*)}}', source, re.S)
    if match is None:
        extract = source
    else:
        extract = match.group(1)
    extract = extract.replace('\n\n', '\n').replace('\n\n', '\n')
    parsed = wikitextparser.parse(extract)
    parsed_lists = parse_lists(parsed)
    del data['source']
    data['items'] = parsed_lists
    return data

def parse_lists(parsed):
    results = []

    lists = parsed.get_lists()
    bolds = parsed.get_bolds(recursive=False)
    # After 2020, the headlines are formatted as bolds, not as lists
    isNewFormat = len(bolds) > 0

    if isNewFormat:
        # '''Armed conflicts and attacks'''
        # *[[Afghanistan conflict (1978–present)|Afghanistan conflict]]
        for bold_header, sublist in zip(bolds, lists):
            item = bold_header.text
            subitems = parse_sublist(sublist)
            results.append({'item': item, 'subitems': subitems})
    else:
        # ;Armed conflicts and attacks
        # *[[Afghanistan conflict (1978–present)|Afghanistan conflict]]
        for i in range(0, len(lists), 2):
            item = parse_headline_from_list(lists[i])
            subitems = parse_sublist(lists[i+1])
            results.append({'item': item, 'subitems': subitems})

    return results

def parse_headline_from_list(parsed):
    return parsed.items[0]

def parse_sublist(parsed):
    results = []
    for index, item in enumerate(parsed.items):
        try:
            subitems = parse_sublist(parsed.sublists(index)[0])
            results.append({'item': item, 'subitems': subitems})
        except IndexError:
            results.append(item)
    return results

if __name__ == "__main__":
    main()
