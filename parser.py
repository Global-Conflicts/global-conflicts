from datetime import date, timedelta
import csv
import requests
import wikitextparser

def scrape_all():
    start = date(2010, 1, 1)
    end = date(2020, 1, 1)
    dates = [start + timedelta(days=x) for x in range((end - start).days + 1)]
    return [scrape_date(date) for date in dates]

def scrape_date(date):
    timestamp = date.strftime('%Y_%B_%-d')
    print(timestamp)
    url = f'https://en.wikipedia.org/wiki/Portal%3aCurrent_events/{timestamp}?action=raw'
    page = requests.get(url)
    source = page.content.decode('utf-8')
    try:
        news_items = parse_date(source)
        news_items_with_date = [[date, item] for item in news_items]
        return news_items_with_date
    except Exception as e:
        print('Error', e)
        return None

def parse_date(source):
    left = '<!-- All news items below this line -->'
    right = '<!-- All news items above this line -->'
    extract = source[source.index(left) + len(left) : source.index(right)]
    parsed = wikitextparser.parse(extract)
    parsed_lists = parsed.get_lists()
    try:
        category = 'Armed conflicts and attacks'
        index = [x.items[0] for x in parsed_lists].index(category)
        news_items = parsed_lists[index + 1]
        return parse_news_items(news_items)
    except ValueError:
        return []

def parse_news_items(news_items):
    result = []
    for index, item in enumerate(news_items.items):
        try:
            subitems = news_items.sublists(index)[0].items
            subitems_with_prefix = [f'{item} {subitem}' for subitem in subitems]
            result.extend(subitems_with_prefix)
        except IndexError:
            result.append(item)

    result = [wikitextparser.parse(item).plain_text() for item in result]

    print(len(result), 'items found')
    return result

def export_to_csv(results):
    with open('export.csv', mode='w') as csv_file:
        writer = csv.writer(csv_file)
        for item in results:
            if item != None:
                writer.writerows(item)
    

if __name__ == "__main__":
    results = scrape_all()
    export_to_csv(results)
