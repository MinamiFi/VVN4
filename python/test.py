import json
import time

# 从json中读取数据
with open('./data/rockType.json', 'r', errors='igone', encoding='utf-8') as f:
    vType1 = json.loads((f.read()))
with open('./data/rockType1.json', 'r', errors='igone', encoding='utf-8') as f:
    vType2 = json.loads((f.read()))

for v in vType2:
    if v not in vType1:
        vType1.append(v)

# with open('./data/AllvolcanoType.json', 'w', errors='igone', encoding='utf-8') as f:
#     json.dump(vType1, f, indent=4, ensure_ascii=False)
with open('./data/AllrockType.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(vType1, f, indent=4, ensure_ascii=False)
