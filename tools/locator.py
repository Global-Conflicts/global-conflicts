import sys
import requests
import json
import wikitextparser
import itertools

def main():
    for line in sys.stdin:
        data = json.loads(line)
        countries, coordinates = query_wikidata(data['wikitext'])
        data['coordinates'] = coordinates
        data['regions'] = countries
        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def scrape_links(wikitext):
    parsed = wikitextparser.parse(wikitext)
    output = []
    for link in parsed.wikilinks:
        output.append(link.title)
    return output

def query_wikidata(wikitext):
    links = scrape_links(wikitext)
    parameters = "\r\n".join(map(lambda x: f"\"{x}\"@en", links))

    query = f"""
    SELECT ?point ?iso3code WHERE {{
      VALUES ?page {{
        {parameters}
      }}
      ?sitelink schema:about ?item;
                schema:isPartOf <https://en.wikipedia.org/>;
                schema:name ?page.
      Optional {{
        ?item  p:P625 ?coordinate.
        ?coordinate ps:P625 ?point.
      }}
      Optional {{
        ?item p:P17 ?historic_country.
        ?historic_country ps:P17 ?country.
        FILTER NOT EXISTS {{?country wdt:P31 wd:Q3024240}}
        ?country wdt:P298 ?iso3code
      }}
    }}
    """

    headers = {
        'User-Agent': 'User-Agent: ArmedConflictsPipeline/0.1 (jfbausch@outlook.com)',
    }

    url = f'https://query.wikidata.org/sparql?format=json&timeout=5000&query={query}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return [], []

    source = response.content.decode('utf-8')
    data = json.loads(source)

    countries = []
    coordinates = []

    # Extract countries and coordinates
    for item in data['results']['bindings']:
        if 'iso3code' in item:
            value = item['iso3code']['value']
            if value not in countries:
                countries.append(value)

        if 'point' in item:
            rawValue = item['point']['value']
            # note, lng and lat is switched in Wikidata Point
            [lng, lat] = rawValue.replace('Point(', '').replace(')', '').split(' ')
            coordinates.append([float(lat), float(lng)])

    deleted_indices = set()
    combinations = list(itertools.combinations(enumerate(coordinates), 2))

    for ((a_i, [a_lat, a_lng]), (_, [b_lat, b_lng])) in combinations:
        if (round(a_lat) == round(b_lat)) and (round(a_lat) == round(b_lat)):
            # duplicate fond
            deleted_indices.add(a_i)

    for i in sorted(deleted_indices, reverse=True):
        del coordinates[i]

    return countries, coordinates

if __name__ == "__main__":
    main()
