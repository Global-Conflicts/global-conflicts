import sys
import re
import requests
import json
from pyopenie import OpenIE5

test = [
    {
        "confidence": 0.9168198459177435,
        "sentence": "The U.S. president Barack Obama gave his speech on Tuesday to thousands of people.",
        "extraction": {
            "arg1": {
                "text": "Nine officials",
                "offsets": None
            },
            "rel": {
                "text": "killed by",
                "offsets": None
            },
            "arg2s": [
                {
                    "text": "his speech",
                    "offsets": None
                },
                {
                    "text": "on Tuesday",
                    "offsets": None
                },
                {
                    "text": "to thousands of people",
                    "offsets": None
                }
            ],
            "context": None,
            "negated": False,
            "passive": False
        }
    },
    {
        "confidence": 0.38089450366724514,
        "sentence": "The U.S. president Barack Obama gave his speech on Tuesday to thousands of people.",
        "extraction": {
            "arg1": {
                "text": "Barack Obama",
                "offsets": None
            },
            "rel": {
                "text": "kills",
                "offsets": None
            },
            "arg2s": [
                {
                    "text": "2 people",
                    "offsets": None
                }
            ],
            "context": None,
            "negated": False,
            "passive": False
        }
    },
]

keywords_arg1 = ['killed by']
keywords_arg2 = ['kills']
digits = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six',
    'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
]

def main():
    for line in sys.stdin:
        data = json.loads(line)
        casulty_description = extract_casualty_description(data['plaintext'])
        casulty_count = extract_casualty_number(casulty_description)
        data['casualty_description'] = casulty_description
        data['casualty_count'] = casulty_count
        output = json.dumps(data)
        sys.stdout.write(output + '\n')

def extract_casualty_description(wikitext):
    extractions = get_extractions(wikitext)
    for (arg1, rel, arg2) in extractions:
        if rel in keywords_arg1:
            return arg1
        if rel in keywords_arg2:
            return arg2
    return None

def extract_casualty_number(description):
    if description is None:
        return None

    # extract literal numbers
    for i, digit in enumerate(digits):
        if digit.lower() in description.lower():
            return i
    # extract numerical numbers
    numbers = re.findall(r'\b\d+\b', description)

    if len(numbers) == 0:
        return None
    else:
        return int(numbers[0])

def get_extractions(text):
    #extractor = OpenIE5('http://localhost:9000')
    #extractions = extractor.extract(text)
    extractions = test
    results = []
    for relation in extractions:
        arg1 = relation['extraction']['arg1']['text']
        rel = relation['extraction']['rel']['text']
        arg2 = ' '.join(map(lambda x: x['text'], relation['extraction']['arg2s']))
        results.append((arg1, rel, arg2))
    return results

if __name__ == "__main__":
    main()
