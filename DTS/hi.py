import json
import csv

# Load JSON data
with open('hey.json', 'r') as f:
    data = json.load(f)

# Open files to write the SIF data and edge attributes
with open('output.sif', 'w') as f, open('edge_attributes.csv', 'w', newline='') as g:
    # Create a CSV writer for the edge attributes
    attr_writer = csv.writer(g)
    # Write header row
    attr_writer.writerow(['source', 'target', 'interaction', 'question', 'option'])

    for item in data:
        source = item['queid']
        question = item['question']
        for option_text, targets in item['options'].items():
            if not isinstance(targets, list):
                targets = [targets]
            for target in targets:
                # Write each option as an edge from the question to the next question
                f.write(f'{source}\t{option_text}\t{target}\n')
                # Write edge attributes
                attr_writer.writerow([source, target, option_text, question, option_text])




# import json
# import csv

# # Load JSON data
# with open('fp.json', 'r') as f:
#     data = json.load(f)

# # Open a file to write the CSV data
# with open('output.csv', 'w', newline='') as g:
#     # Create a CSV writer
#     csv_writer = csv.writer(g)
#     # Write header row
#     csv_writer.writerow(['source', 'target', 'interaction', 'question', 'option', 'is_diagnosis'])

#     for item in data:
#         source = item['queid']
#         question = item['question']
#         is_diagnosis = item.get('is_diagnoisis', "0")

#         for option_text, targets in item['options'].items():
#             # Ensure targets is a list so we can iterate over it
#             if not isinstance(targets, list):
#                 targets = [targets]
#             for target in targets:
#                 # Write each option as an edge from the question to the next question or diagnosis
#                 csv_writer.writerow([source, target, option_text, question, option_text, is_diagnosis])
