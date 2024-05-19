import json
import os
import pandas as pd

# 자바에서 실행시 -> 파이썬에서 참조하는 폴더 경로가 바뀜(자바 기준으로 설정 ㄱ)
dir_path = './uploadedFiles'

os.chdir(dir_path)

dirList = os.listdir()
target = dirList[0]

df = pd.read_csv(target,encoding='cp949')

columns = df.columns.to_list()
rows = df.shape[0]

response = {"name":target,"columns":columns,"rows":rows}
response = json.dumps(response)
# print(type(df.columns))

# temp json
# tempJson = '{"first": "aa", "second": "bb", "third": "cc"}'


print(response)

