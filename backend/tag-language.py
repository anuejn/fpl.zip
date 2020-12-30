import sys
import json

if len(sys.argv) < 2:
    print("usage: tag-language.py [LANG] [JSON_FILE ...]")
    sys.exit(1)

lang = sys.argv[1]

for filename in sys.argv[2:]:
    with open(filename, 'r+') as fd:
        meta = json.load(fd)
        meta['language'] = lang
        fd.seek(0)
        json.dump(meta, fd)
        fd.truncate()
