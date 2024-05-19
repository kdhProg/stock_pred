import pandas_datareader as pdr
import pandas as pd
import yfinance as yf
import sys
import json
from datetime import datetime

# yf.pdr_override()
# df = pdr.get_data_yahoo(주식 종목(한국주식의 경우 ".KS") [, 시작일(YYYY-mm-dd)] [,종료일(YYYY-mm-dd)])
# df = pdr.get_data_yahoo("005930.KS", "2022-02-21", "2022-02-22")

# df = yf.download("005930.KS", "2022-02-21", "2022-03-22")
# print(df.head())

CSV_PATH = './python_modules/csvFiles'

ticker = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]

CSV_PATH = CSV_PATH + '/' + ticker + '_' + datetime.today().strftime("%Y%m%d%H%M%S") +'.csv'

df = yf.download(ticker, start_date, end_date)
if df is not None:
    
    # save to csv
    df.to_csv(CSV_PATH)
    
    res = df.to_json()
    print(res)
else:
    print()

# 결과 출력

