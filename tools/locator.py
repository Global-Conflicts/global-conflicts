import sys
import requests
import json
import wikitextparser

def main():
    for line in sys.stdin:
        data = json.loads(line)
        data['coordinates'] = [-77.038659, 38.931567]
        data['regions'] = find_regions(data['wikitext'])
        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def scrape_links(wikitext):
    parsed = wikitextparser.parse(wikitext)
    output = []
    for link in parsed.wikilinks:
        output.append(link.title)
    return output

def find_regions(wikitext):
    links = scrape_links(wikitext)
    parameters = "\r\n".join(map(lambda x: f"\"{x}\"@en", links))

    query = f"""
    SELECT *
    WHERE
    {{
        VALUES ?value
        {{
        {parameters}
        }}

        ?place rdfs:label ?value ;
        dbo:country ?country .

        ?country a dbo:Country ;
        rdfs:label ?commonName .

        FILTER ( LANG ( ?commonName ) = 'en' )
    }}
    """

    url = f'https://dbpedia.org/sparql?query={query}&timeout=10000&format=application%2Fsparql-results%2Bjson'
    response = requests.get(url)
    source = response.content.decode('utf-8')

    if response.status_code != 200:
        return

    data = json.loads(source)
    
    return list(set(map(lambda x: x['commonName']['value'], data['results']['bindings'])))

if __name__ == "__main__":
    main()
