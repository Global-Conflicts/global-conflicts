import sys
import requests
import json
import wikitextparser
import wptools

def main():
    for line in sys.stdin:
        data = json.loads(line)
        data['regions'] = ['Russia']
        data['coordinates'] = [-77.038659, 38.931567]
        # data['regions'] = find_regions(data['wikitext'])
        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def find_regions(wikitext):
    links = scrape_links(wikitext)
    return []

def scrape_links(wikitext):
    parsed = wikitextparser.parse(wikitext)
    output = []
    for link in parsed.wikilinks:
        regions = get_regions_for_page(link.title)
        output.append(regions)
    return output

def get_regions_for_page(title):
    page = wptools.page(
        title,
        silent=True,
        skip=['imageinfo', 'labels', 'query', 'querymore', 'random', 'restbase', 'wikidata']
    )
    content = page.get_parse()
    infobox = content.data['infobox']
    print(infobox)

if __name__ == "__main__":
    main()
