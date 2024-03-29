import sys
import argparse
import requests
import json
from datetime import date, timedelta

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('days', nargs="?", type=int, default=30)
    args = parser.parse_args()
    start_date = date.today() - timedelta(days=args.days)
    end_date = date.today()
    scrape_range(start_date, end_date)

def scrape_range(start, end):
    dates = [start + timedelta(days=x) for x in range((end - start).days + 1)]
    for date in dates:
        scrape_date(date)

def scrape_date(date):
    timestamp = date.strftime('%Y_%B_%-d')
    url = f'https://en.wikipedia.org/wiki/Portal%3aCurrent_events/{timestamp}'
    rawUrl = f'{url}?action=raw'
    page = requests.get(rawUrl)
    source = page.content.decode('utf-8')
    output = json.dumps({
        'date': date.strftime('%Y-%m-%d'),
        'source': source,
        'url': url
    })
    sys.stdout.write(output + '\n')

if __name__ == "__main__":
    main()
