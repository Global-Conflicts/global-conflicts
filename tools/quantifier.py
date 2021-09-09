import sys
import re
import json

keywords_arg1 = [
    'are killed',
    'were killed',
    'was shot',
    'is killed',
    'die',
    'are shot',
    'are fatally shot',
    'is shot',
    'have been killed',
    'died',
    'has been killed',
    'was killed',
    'is assassinated',
    'are also killed',
    'were shot',
    'is fatally shot'
]

keywords_arg2 = [
    'has killed',
    'killed',
    'kill',
    'killing',
    'shoot',
    'kills',
    'assaulted',
    'assault'
]

digits = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six',
    'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
]

def main():
    for line in sys.stdin:
        data = json.loads(line)

        relations = data['relations']
        del data['relations'] # remove array from output to preserve memory


        casulty_description = extract_casualty_description(relations)
        casulty_count = extract_casualty_number(casulty_description)

        data['casualty_description'] = casulty_description
        data['casualty_count'] = casulty_count

        output = json.dumps(data)
        # sys.stdout.write(output + '\n')

def extract_casualty_description(relations):
    for relation in relations:
        if relation.get('rel') in keywords_arg1:
            return relation.get('arg1')
        if relation.get('rel') in keywords_arg2:
            return relation.get('arg1')

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
