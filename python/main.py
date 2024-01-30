# 暂停程序运行
import time
# 后面扒下来的数据是字符串里面包着字典，毫无可读性，可以通过json字符串和python字典的相互转换来提高可读性
import json
from selenium import webdriver
from selenium.webdriver.common.by import By

# 用于请求
import requests

# 配置代理并启动WebDriver
from selenium.webdriver.chrome.options import Options

# 读取xlx文件数据
import pandas as pd

# 先把火山编号拿到
# holocene = pd.read_excel('../data/Holocene.xlsx', sheet_name='Holocene Volcano List')  # 全新世
# pleistocene = pd.read_excel('../data/Pleistocene.xlsx', sheet_name='Pleistocene Volcano List')  # 更新世

# h_ids = []
# p_ids = []
# for i in holocene.iloc[:, [0]].values.tolist():
#     h_ids.append(i[0])
# for i in pleistocene.iloc[:, [0]].values.tolist():
#     p_ids.append(i[0])

# with open('./data/h_id.json', 'w', encoding='utf-8', errors="igone") as f:
#     json.dump(h_ids, f, indent=4, ensure_ascii=False)
# with open('./data/p_id.json', 'w', encoding='utf-8', errors="igone") as f:
#     json.dump(p_ids, f, indent=4, ensure_ascii=False)

# url = "https://volcano.si.edu/volcano.cfm?vn="

# # 岩石类型汇总
# rock_type = []
# # 火山类型汇总
# volcano_type = []

# 从json中读取数据
# 初始数据 包括id region subregion数据
with open('./data/run_data.json', 'r', errors='igone', encoding='utf-8') as f:
    runData = json.loads(f.read())
# 岩石类型
with open('./data/rockType.json', 'r', errors='igone', encoding='utf-8') as f:
    rock_type = json.loads(f.read())
# 火山类型

with open('./data/volcanoType.json', 'r', errors='igone', encoding='utf-8') as f:
    volcano_type = json.loads(f.read())

h_datas = []
finish_data = []

driver = 0

# p_datas = []
# ids用于测试
ids = [runData[0], runData[1]]
for i in runData:
    try:
        print(i['number'])
        finish_data.append(i['number'])

        chrome_options = Options()
        # 禁用扩展插件，因为我也不是太懂，总之没了这句，浏览器会报警提示如下图。魔法，勿动。
        chrome_options.add_argument('--ignore-certificate-errors')
        # 如果Selenium驱动放在了python.exe同级目录下，executable_path参数可以省略
        driver = webdriver.Chrome(options=chrome_options)

        driver.get(f"https://volcano.si.edu/volcano.cfm?vn={str(i['number'])}&vtab=GeneralInfo")
        driver.encoding = 'utf-8'
        time.sleep(2)
        try:
            volcanoType = driver.find_element(By.XPATH,
                                              "//table[@role = 'presentation']/*/*/td/table/tbody/tr[4]/td").text.split(
                '\n')
        except:
            time.sleep(10)
            volcanoType = driver.find_element(By.XPATH,
                                              "//table[@role = 'presentation']/*/*/td/table/tbody/tr[4]/td").text.split(
                '\n')

        # 汇总火山类型
        for vT in volcanoType:
            if vT not in volcano_type:
                volcano_type.append(vT)

        country = driver.find_element(By.XPATH,
                                      "//div[@id = 'ProfileHolocene']/div[@class = 'volcano-info-table']/ul/li/a").text
        primaryType = driver.find_element(By.XPATH,
                                          "//div[@id = 'ProfileHolocene']/div[@class = 'volcano-info-table']/ul[1]/li[2]").text

        basicData = driver.find_element(By.XPATH, "//table[@role = 'presentation']/*/*/td/table/tbody/tr[2]/td[2]")
        basicData = basicData.text.split('\n\n')
        isDetail = True
        isMajor = True
        isMinor = True
        rockType_major = ''
        rockType_minor = ''
        tectonicSetting = ''
        population = []
        try:
            # 可能会有数据缺失的部分
            count = 6
            rockType_major = driver.find_element(By.XPATH,
                                                 f"//table[@role = 'presentation']/*/*/td/table/tbody/tr[{count}]/td")
            if "Major" not in rockType_major.text:
                isMajor = False
                rockType_major = []
            else:
                # 处理并汇总岩石类型数据
                temporaryRock = rockType_major.text.split('\n')
                rockType_major = []
                for rT in temporaryRock:
                    tempRock = rT.split(' / ')
                    for temprT in tempRock:
                        rockType_major.append(temprT)
                        if (temprT not in rock_type):
                            rock_type.append(temprT)
                count += 1

            # print(count)
            rockType_minor = driver.find_element(By.XPATH,
                                                 f"//table[@role = 'presentation']/*/*/td/table/tbody/tr[{str(count)}]/td")
            if "Minor" not in rockType_minor.text:
                isMinor = False
                rockType_minor = []
                count += 1
            else:
                # 处理并汇总岩石类型数据
                temporaryRock = rockType_minor.text.split('\n')
                rockType_minor = []
                for rT in temporaryRock:
                    tempRock = rT.split(' / ')
                    for temprT in tempRock:
                        rockType_minor.append(temprT)
                        if (temprT not in rock_type):
                            rock_type.append(temprT)
                count += 2

            # print(count)
            tectonicSetting = driver.find_element(By.XPATH,
                                                  f"//table[@role = 'presentation']/*/*/td/table/tbody/tr[{str(count)}]/td").text.split(
                '\n')
            count += 2
            # print(count)
            pop = driver.find_element(By.XPATH,
                                      f"//table[@role = 'presentation']/*/*/td/table/tbody/tr[{str(count)}]/td[2]")
            # 处理人口数据
            population = []
            pop = pop.text.split('\n')
            for p in pop:
                p = p.split(',')
                Sum = 0
                for temp in p:
                    Sum = Sum * 1000 + int(temp)
                population.append(Sum)
        except:
            isDetail = False
        pic = driver.find_element(By.XPATH, "//img[@class = 'volcano-image']")
        geologicalSummary = driver.find_element(By.XPATH,
                                                "//table[@role = 'presentation']/*/*/td[2]/table/tbody/tr[2]/td")

        # 火山图片
        pic.screenshot(f"./img/{i}.png")

        data = {
            "id": basicData[0],  # 火山编号
            "region": i["region"],
            "subregion": i["subregion"],
            "lastKnownEruption": basicData[1],  # 上一次爆发
            "country": country,
            "primaryType": primaryType,
            "elevation": int(float(basicData[2].split(' ')[0])),  # 海拔 单位为m
            "location": {
                "type": "Point",
                "coordinates": [
                    (1 if "E" in basicData[3] else -1) * float(basicData[3].split('\n')[1].split('°')[0])
                    ,
                    (1 if "N" in basicData[3] else (-1)) * float(basicData[3].split('°')[0])
                ]
            },
            "latitude": float(basicData[3].split('°')[0]),  # 纬度
            "longitude": float(basicData[3].split('\n')[1].split('°')[0]),  # 经度
            'isNorth': True if "N" in basicData[3] else False,
            'isEast': True if "E" in basicData[3] else False,
            "volcanoType": volcanoType,  # 火山类型
            "geologicalSummary": geologicalSummary.text  # 地质总结

        }
        if isDetail:
            data["isDetail"] = isDetail
            data["rockTypes"] = {  # 岩石类型
                "isMajor": isMajor,
                "isMinor": isMinor,
                "major": rockType_major,
                "minor": rockType_minor
            }
            # print(tectonicSetting)
            # print(population)
            data["tectonicSetting"] = tectonicSetting,  # 地质构造
            data["tectonicSetting"] = list(data["tectonicSetting"])[0]
            data["population"] = population,  # 人口 5km 10km 30km 100km
            data["population"] = list(data["population"])[0]
            # print(data["tectonicSetting"])
            # print(data["population"])
        else:
            data["isDetail"] = isDetail

        h_datas.append(data)
        driver.close()
        driver.quit()
    except:
        print('error')
        # driver.close()
        # driver.quit()
        # 存储文件
        with open('./data/holocene.json', 'w', errors='igone', encoding='utf-8') as f:
            json.dump(h_datas, f, indent=4, ensure_ascii=False)
        with open('./data/finishData.json', 'w', errors='igone', encoding='utf-8') as f:
            json.dump(finish_data, f, indent=4, ensure_ascii=False)
        with open('./data/rockType.json', 'w', errors='igone', encoding='utf-8') as f:
            json.dump(rock_type, f, indent=4, ensure_ascii=False)
        with open('./data/volcanoType.json', 'w', errors='igone', encoding='utf-8') as f:
            json.dump(volcano_type, f, indent=4, ensure_ascii=False)
        print(IndexError)
        break
# print(h_datas)
# 存储文件
with open('./data/holocene.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(h_datas, f, indent=4, ensure_ascii=False)
with open('./data/finishData.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(finish_data, f, indent=4, ensure_ascii=False)
with open('./data/rockType.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(rock_type, f, indent=4, ensure_ascii=False)
with open('./data/volcanoType.json', 'w', errors='igone', encoding='utf-8') as f:
    json.dump(volcano_type, f, indent=4, ensure_ascii=False)
