import sys
from pykrx import stock
import json
from collections import OrderedDict

ticker = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]

df = stock.get_market_ohlcv_by_date(fromdate=start_date, todate=end_date, ticker=ticker)
x_index = list(df.index.values)
x_index = list(map(lambda x: (str(x))[:10],x_index))

y_val = list(df['종가'])

rst = OrderedDict()
rst["index"] = x_index
rst["val"] = y_val

rst = json.dumps(rst)
print(rst)
