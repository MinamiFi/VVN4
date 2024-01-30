import json
import time

# 从json中读取数据
with open('./data/holoceneWithName.json', 'r', errors='igone', encoding='utf-8') as f:
    holoData = json.loads((f.read()))

new_data = []
for h in holoData:
    temp = h["lastKnownEruption"].split(' ')
    if temp[0] == "Unknown":
        print(1)
        h["iseruption"] = False
    else:
        h["iseruption"] = True
        print(h["id"])
        h["eruption"] = ((-1) if temp[1] == 'BCE' else 1) * int(temp[0])

    new_data.append(h)
    # time.sleep(2)

with open('./data/holoceneLatest.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(new_data, f, indent=4, ensure_ascii=False)
