import os
import sys
import json
import gzip
import xml.etree.ElementTree as ET
import argparse
from hashlib import sha256
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str)
    args = parser.parse_args()
    input_directory = args.input

    for line in sys.stdin:
        data = json.loads(line)
        root = read_file(data['plaintext'], data['date'], input_directory)

        # calculate average sentiment
        sentiment_elements = root.findall('{http:///org/hucompute/textimager/uima/type.ecore}Sentiment')
        sentiments = [float(e.get('sentiment')) for e in sentiment_elements]
        data['sentiment'] = sum(sentiments) / len(sentiments)

        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def read_file(news_report, date, folder):
    hash_id = sha256(news_report.encode('utf-8')).hexdigest()[0:6]
    filename = f'{date}-{hash_id}.txt.xmi.gz'
    path = os.path.join(folder, filename)
    with gzip.open(path, 'rb') as f:
        xml_content = f.read()
        root = ET.fromstring(xml_content)
        return root

if __name__ == "__main__":
    main()
