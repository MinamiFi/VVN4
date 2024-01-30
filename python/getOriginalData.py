import pandas as pd
import json

datas = []
holocene = pd.read_excel('./data/Holocene.xlsx', sheet_name='Holocene Volcano List')  # 全新世

# for i in holocene.iloc[:, [0]].values.tolist():
#     data = {}
#     data["ids"] = (i[0])
#     data["region"] = ()

# 读取第二列全部值
numbers = holocene.loc[:, "Volcano Number"].tolist()
name = holocene.loc[:, 'Volcano Name'].tolist()
regions = holocene.loc[:, "Region"].tolist()
subregions = holocene.loc[:, 'Subregion'].tolist()
for i in range(len(numbers)):
    data = {
        "name": name[i],
        "number": numbers[i],
        "region": regions[i],
        "subregion": subregions[i],
    }
    datas.append(data)
# print(datas)

with open('./data/original_data.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(datas, f, indent=4, ensure_ascii=False)
