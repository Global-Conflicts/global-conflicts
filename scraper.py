from typing import List
from lxml import html, etree
import requests

class ScrapedIncident():
    def __init__(self, year: int, month: str, date: int, description: str) -> None:
        self.year = year
        self.month = month
        self.date = date
        self.description = description

months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

months = ["December"]

def scrape_all() -> List[ScrapedIncident]:
    years = list(range(2020, 2020 + 1))
    return [scrape_month(y, m) for y in years for m in months]


def print_nodes(nodes):
    print([etree.tostring(x, pretty_print=True) for x in nodes])

def scrape_month(year: int, month: str) -> List[ScrapedIncident]:
    print('Scraping', year, month)
    url = f'https://en.m.wikipedia.org/wiki/Portal:Current_events/{month}_{year}'
    page = requests.get(url)
    tree = html.fromstring(page.content)
    dayDivs = tree.xpath('//div[@class="vevent"]//div[@class="description"]')
    return [scrape_day(dayDiv) for dayDiv in dayDivs]

def scrape_day(node) -> List[ScrapedIncident]:
    dailyDivs = node.xpath('.//b[text()="Armed conflicts and attacks"]')
    print(len(dailyDivs))
    return ScrapedIncident(2929, 'January', 1, 'df')

def export_to_file(incidents: List[ScrapedIncident]) -> None:
    return None

if __name__ == "__main__":
    scrape_all()
