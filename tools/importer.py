import os
import sys
import json
import gzip
import xml.etree.ElementTree as ET
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str)
    args = parser.parse_args()
    input_directory = args.input

    for line in sys.stdin:
        data = json.loads(line)
        root = read_file(data['key'], data['plaintext'], data['date'], input_directory)

        # calculate average sentiment
        # sentiment_elements = root.findall('{http:///org/hucompute/textimager/uima/type.ecore}Sentiment')
        # sentiments = [float(e.get('sentiment')) for e in sentiment_elements]
        # data['sentiment'] = sum(sentiments) / len(sentiments)
        
        relation_elements = root.findall('{http:///org/hucompute/textimager/uima/type.ecore}OpenIERelation')
        relations = [convert_openie_relation(e) for e in relation_elements]
        data['relations'] = relations

        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def convert_openie_relation(element):
    return {
        'arg1': element.get('valueArg1'),
        'rel': element.get('valueRel'),
        'arg2': element.get('valueArg2')
    }

def read_file(key, news_report, date, folder):
    filename = f'{key}.txt.xmi.gz'
    path = os.path.join(folder, filename)
    with gzip.open(path, 'rb') as f:
        xml_content = f.read()
        root = ET.fromstring(xml_content)
        return root

if __name__ == "__main__":
    main()
