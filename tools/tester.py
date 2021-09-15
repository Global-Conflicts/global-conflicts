import os
import sys
import json
import argparse
import random
import xlsxwriter

LINK_URL = 'https://osm.org/'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('path', type=str)
    parser.add_argument('-n', '--number', type=int)
    args = parser.parse_args()
    path = args.path
    number = args.number

    workbook = xlsxwriter.Workbook(path)
    worksheet = workbook.add_worksheet()

    lines = sys.stdin.readlines();

    header_format = workbook.add_format({'bold': True})
    row_format = workbook.add_format({'text_wrap': True, 'valign': 'top', 'align': 'left'})
    worksheet.set_column(0, 20, 20, row_format)

    insert_header(worksheet, header_format)

    for row in range(1, number + 1):
        line = random.choice(lines)
        data = json.loads(line)

        worksheet.set_row(row, 200)
        insert_source(worksheet, row, data.get('key'), data.get('url'), row_format)
        insert_plaintext(worksheet, row, data.get('plaintext'))
        insert_casualties(worksheet, row, data.get('casualty_description'), data.get('casualty_count'))
        insert_regions(worksheet, row, data.get('regions'))
        insert_coordinates(worksheet, row, data.get('coordinates'), row_format)

    insert_dropdown(worksheet, number)

    workbook.close()

def insert_header(worksheet, header_format):
    worksheet.write(0, 0, 'Source', header_format)
    worksheet.write(0, 1, 'Plain text', header_format)
    worksheet.write(0, 2, 'Correct? ➔', header_format)
    worksheet.write(0, 3, 'Casualty description', header_format)
    worksheet.write(0, 4, 'Correct? ➔', header_format)
    worksheet.write(0, 5, 'Casualty count', header_format)
    worksheet.write(0, 6, 'Correct? ➔', header_format)
    worksheet.write(0, 7, 'Regions', header_format)
    worksheet.write(0, 8, 'Correct? ➔', header_format)
    worksheet.write(0, 9, 'Coordinates', header_format)
    worksheet.freeze_panes(1, 0)

def insert_dropdown(worksheet, rows):
    states = [
        'Valid Accurate Complete', 'Invalid Accurate Complete', 'Valid Inaccurate Complete',
        'Invalid Inaccurate Complete', 'Valid Accurate Incomplete', 'Invalid Accurate Incomplete',
        'Valid Inaccurate Incomplete', 'Invalid Inaccurate Incomplete'
    ]
    worksheet.data_validation(1, 2, rows, 2, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 4, rows, 4, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 6, rows, 6, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 8, rows, 8, {'validate': 'list', 'source': states})

def insert_source(worksheet, row, key, url, row_format):
    worksheet.write_url(row, 0, url, row_format, key);

def insert_plaintext(worksheet, row, plaintext):
    worksheet.write(row, 1, plaintext)

def insert_casualties(worksheet, row, description, count):
    worksheet.write(row, 3, description)
    worksheet.write(row, 5, count)

def insert_regions(worksheet, row, regions):
    cell = ', '.join(regions)
    worksheet.write(row, 7, cell)

def insert_coordinates(worksheet, row, coordinates, row_format):
    col = 9
    for coordinate in coordinates:
        lat, lng = coordinate
        link_url = f'{LINK_URL}?zoom=4&mlat={lat}&mlon={lng}'
        worksheet.write_url(row, col, link_url, row_format, f'{lat}, {lng}')
        col += 1

if __name__ == "__main__":
    main()
