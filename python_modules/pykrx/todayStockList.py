import pandas as pd
from pykrx import stock

from datetime import datetime

now = datetime.now()
today_date = now.strftime('%Y%m%d')

market_list = ['KOSPI', 'KOSDAQ', 'KONEX']

SAVE_PATH = './stock_property_files/kor_stock_list.csv'

kor_ticker_list_df = pd.DataFrame()

for market_nm in market_list:
    ticker_list = stock.get_market_ticker_list(today_date, market=market_nm)
    for tickers in ticker_list:
        corp_name = stock.get_market_ticker_name(tickers)
        df = pd.DataFrame({'ticker':tickers,
                           'corp_name':corp_name,
                           'market': market_nm
                          }, index = [0])
        kor_ticker_list_df = pd.concat([kor_ticker_list_df,df])
kor_ticker_list_df = kor_ticker_list_df.reset_index(drop = True)

kor_ticker_list_df.to_csv(SAVE_PATH)