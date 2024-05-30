import sys
from pykrx import stock
import json
from collections import OrderedDict

ticker = sys.argv[1]
colName = sys.argv[2]
start_date = sys.argv[3]
end_date = sys.argv[4]

df = stock.get_market_ohlcv_by_date(fromdate=start_date, todate=end_date, ticker=ticker)

# 한글 컬럼 -> 영문
df.rename(columns = {'날짜' : 'Date'}, inplace = True)
df.rename(columns = {'시가' : 'Open'}, inplace = True)
df.rename(columns = {'고가' : 'High'}, inplace = True)
df.rename(columns = {'저가' : 'Low'}, inplace = True)
df.rename(columns = {'종가' : 'Close'}, inplace = True)
df.rename(columns = {'거래량' : 'Volumne'}, inplace = True)


x_index = list(df.index.values)
x_index = list(map(lambda x: (str(x))[:10],x_index))

y_val = list(df[colName])

rst = OrderedDict()
rst["index"] = x_index
rst["val"] = y_val

rst = json.dumps(rst)
print(rst)
