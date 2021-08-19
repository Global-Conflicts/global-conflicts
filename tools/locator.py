import sys
import requests
import json
import wikitextparser

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
    SELECT ?point ?countryLabel WHERE {{
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
        FILTER NOT EXISTS {{?country wdt:P576 ?date}}
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en" }}
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

    for item in data['results']['bindings']:
        if 'countryLabel' in item:
            value = item['countryLabel']['value']
            if value not in countries:
                countries.append(value)

        if 'point' in item:
            rawValue = item['point']['value']
            [lat, lng] = rawValue.replace('Point(', '').replace(')', '').split(' ')
            coordinates.append([float(lat), float(lng)])

    return countries, coordinates

if __name__ == "__main__":
    main()
