import sys
import argparse
import requests
import json
from datetime import date, timedelta

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('start', type=date.fromisoformat)
    parser.add_argument('end', type=date.fromisoformat)
    args = parser.parse_args()
    scrape_range(args.start, args.end)

def scrape_range(start, end):
    dates = [start + timedelta(days=x) for x in range((end - start).days + 1)]
    for date in dates:
        scrape_date(date)

def scrape_date(date):
    timestamp = date.strftime('%Y_%B_%-d')
    url = f'https://en.wikipedia.org/wiki/Portal%3aCurrent_events/{timestamp}?action=raw'
    page = requests.get(url)
    source = page.content.decode('utf-8')
    output = json.dumps({'date': date.strftime('%Y-%m-%d'), 'source': source})
    sys.stdout.write(output + '\n')

if __name__ == "__main__":
    main()
