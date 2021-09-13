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
        insert_plaintext(worksheet, row, data.get('plaintext'))
        insert_casualties(worksheet, row, data.get('casualty_description'), data.get('casualty_count'))
        insert_regions(worksheet, row, data.get('regions'))
        insert_coordinates(worksheet, row, data.get('coordinates'), row_format)

    insert_dropdown(worksheet, number)

    workbook.close()

def insert_header(worksheet, header_format):
    worksheet.write(0, 0, 'Plain report', header_format)
    worksheet.write(0, 1, 'Correct? ➔', header_format)
    worksheet.write(0, 2, 'Casualty description', header_format)
    worksheet.write(0, 3, 'Correct? ➔', header_format)
    worksheet.write(0, 4, 'Casualty description', header_format)
    worksheet.write(0, 5, 'Correct? ➔', header_format)
    worksheet.write(0, 6, 'Regions', header_format)
    worksheet.write(0, 7, 'Correct? ➔', header_format)
    worksheet.write(0, 8, 'Coordinates', header_format)
    worksheet.freeze_panes(1, 0)

def insert_dropdown(worksheet, rows):
    states = [
        'Valid Accurate Complete', 'Invalid Accurate Complete', 'Valid Inaccurate Complete',
        'Invalid Inaccurate Complete', 'Valid Accurate Incomplete', 'Invalid Accurate Incomplete',
        'Valid Inaccurate Incomplete', 'Invalid Inaccurate Incomplete'
    ]
    worksheet.data_validation(1, 1, rows, 1, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 3, rows, 3, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 5, rows, 5, {'validate': 'list', 'source': states})
    worksheet.data_validation(1, 7, rows, 7, {'validate': 'list', 'source': states})

def insert_plaintext(worksheet, row, plaintext):
    worksheet.write(row, 0, plaintext)

def insert_casualties(worksheet, row, description, count):
    worksheet.write(row, 2, description)
    worksheet.write(row, 4, count)

def insert_regions(worksheet, row, regions):
    cell = ', '.join(regions)
    worksheet.write(row, 6, cell)

def insert_coordinates(worksheet, row, coordinates, row_format):
    col = 8
    for coordinate in coordinates:
        lat, lng = coordinate
        link_url = f'{LINK_URL}?zoom=4&mlat={lat}&mlon={lng}'
        worksheet.write_url(row, col, link_url, row_format, f'{lat}, {lng}')
        col += 1

if __name__ == "__main__":
    main()
