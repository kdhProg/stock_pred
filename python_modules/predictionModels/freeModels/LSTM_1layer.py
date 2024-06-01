import pandas as pd
import sys
import json

from pykrx import stock

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from keras.layers import LSTM
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
import keras.backend as K
from keras.callbacks import EarlyStopping
from sklearn.metrics import mean_squared_error

from collections import OrderedDict

from sklearn.preprocessing import MinMaxScaler

# data 형식
# ticker : 027580 / str
# startDate : 2024-05-01 / str
# endDate : 2024-05-25 / str
# epoch : str  --> 주의 : str형태로 인식됨
# predColumns : ['Open', 'High'] / list
# targetColumn : High / str
# pastPredDays : int
# trainTestSplit : int
# validPercentage : int
# batchSize : int

# 용례 : data.get('ticker')

# SpringBoot -> Python
server_request = sys.stdin.read()
req = json.loads(server_request)

pred_columns = req.get("predColumns")
target_column = req.get("targetColumn")
PAST_PRED_DAYS = int(req.get("pastPredDays"))
start_date = req.get("startDate")
end_date = req.get("endDate")
ticker = req.get("ticker")
epoch = int(req.get("epoch"))
train_test_split = int(req.get("trainTestSplit"))
valid_percentage = int(req.get("validPercentage"))
batch_size = int(req.get("batchSize"))


original_data = stock.get_market_ohlcv_by_date(fromdate=start_date, todate=end_date, ticker=ticker)
df = original_data.copy()

df.reset_index(inplace=True)

df.rename(columns = {'날짜' : 'Date'}, inplace = True)
df.rename(columns = {'시가' : 'Open'}, inplace = True)
df.rename(columns = {'고가' : 'High'}, inplace = True)
df.rename(columns = {'저가' : 'Low'}, inplace = True)
df.rename(columns = {'종가' : 'Close'}, inplace = True)
df.rename(columns = {'거래량' : 'Volumne'}, inplace = True)

df = df.sort_values(by='Date')

total_dates = len(df)
thirty_percent = int(total_dates * (1-(train_test_split)/100))
split_date = df.iloc[thirty_percent - 1:thirty_percent]['Date'].dt.strftime('%Y-%m-%d').values[0]

split_index = (df[df['Date']==split_date].index)[0]

train = df.loc[:split_index,pred_columns]
test = df.loc[split_index:,pred_columns]

train = np.diff(train, axis=0)
test = np.diff(test, axis=0)

sc_X = MinMaxScaler()
sc_y = MinMaxScaler()

findIndex = pred_columns.index(target_column)

for i in range(len(pred_columns)):
  if(pred_columns.index(pred_columns[i]) == findIndex):
    if i==0:
      # print(pred_columns[i])
      train_sc = sc_y.fit_transform(((train[:,i])).reshape(train.shape[0],1))
    else:
      # print(pred_columns[i])
      train_sc = np.hstack((train_sc, sc_y.fit_transform(((train[:,i])).reshape(train.shape[0],1))))

  else:
    if i==0:
      # print(pred_columns[i])
      train_sc = sc_X.fit_transform(((train[:,i])).reshape(train.shape[0],1))
    else:
      # print(pred_columns[i])
      train_sc = np.hstack((train_sc, sc_X.fit_transform(((train[:,i])).reshape(train.shape[0],1))))
      

for i in range(len(pred_columns)):
  if(pred_columns.index(pred_columns[i]) == findIndex):
    if i==0:
      # print(pred_columns[i])
      test_sc = sc_y.transform(((test[:,i])).reshape(test.shape[0],1))
    else:
      # print(pred_columns[i])
      test_sc = np.hstack((test_sc, sc_y.transform(((test[:,i])).reshape(test.shape[0],1))))

  else:
    if i==0:
      # print(pred_columns[i])
      test_sc = sc_X.transform(((test[:,i])).reshape(test.shape[0],1))
    else:
      # print(pred_columns[i])
      test_sc = np.hstack((test_sc, sc_X.transform(((test[:,i])).reshape(test.shape[0],1))))
      
train_sc_df = pd.DataFrame(train_sc,columns=pred_columns)
test_sc_df = pd.DataFrame(test_sc,columns=pred_columns)

X_train = []
y_train = []
for i in range(len(train_sc_df) - PAST_PRED_DAYS):
    temp0 = train_sc_df.iloc[i:i+PAST_PRED_DAYS,:]
    X_train.append(temp0)
    temp1 = train_sc_df.iloc[i+PAST_PRED_DAYS,pred_columns.index(target_column)]
    y_train.append(temp1)
    
X_test = []
y_test = []
for i in range(len(test_sc_df) - PAST_PRED_DAYS):
    temp0 = test_sc_df.iloc[i:i+PAST_PRED_DAYS,:]
    X_test.append(temp0)
    temp1 = test_sc_df.iloc[i+PAST_PRED_DAYS,pred_columns.index(target_column)]
    y_test.append(temp1)

X_train = np.array(X_train)
X_test = np.array(X_test)
y_train = np.array(y_train)
y_test = np.array(y_test)

validation_split = valid_percentage/100
split_index = int(len(X_train) * (1 - validation_split))
X_val, y_val = X_train[split_index:], y_train[split_index:]



# model

K.clear_session()

model = Sequential()
model.add(LSTM(20, input_shape=(PAST_PRED_DAYS, len(pred_columns))))
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer='adam')
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

model.fit(X_train, y_train, epochs=epoch, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[early_stop], verbose=0)

first_val = ((df[target_column].values)[split_index+1]).reshape(1,1)

y_pred = model.predict(X_test,verbose=0)

y_pred_inversed = sc_y.inverse_transform(y_pred)
y_pred_original  = np.cumsum(np.vstack((first_val, y_pred_inversed)), axis=0)

y_test1 = np.transpose(y_test)
y_test1 = y_test1.reshape(y_test1.shape[0],1)
y_test_inversed = sc_y.inverse_transform(y_test1)
y_test_original = np.cumsum(np.vstack((first_val, y_test_inversed)), axis=0)


x_index = list(df.loc[split_index:split_index+(len(test_sc_df) - PAST_PRED_DAYS),['Date']].values)
x_index = list(map(lambda x: (str(x))[2:12],x_index))


tomorrow_data = (test_sc_df.tail(PAST_PRED_DAYS))
tomorrow_reshape = (np.array(tomorrow_data)).reshape(1,PAST_PRED_DAYS,len(pred_columns))
tomorrow_pred_raw = model.predict(tomorrow_reshape,verbose=0)
tomorrow_pred_raw_inv = sc_y.inverse_transform(tomorrow_pred_raw)
tomorrow_rst  = np.cumsum(np.vstack((first_val, tomorrow_pred_raw_inv)), axis=0)
tomorrow_value = int(tomorrow_rst[-1:][0][0])

rst = OrderedDict()
rst["x_index"] = x_index
# //1 --> 소수점 버리기
rst["pred"] = list(map(lambda x: (x[0])//1,y_pred_original))  
rst["real"] = list(map(lambda x: x[0],y_test_original))
rst["tomorrow_value"] = tomorrow_value

rst = json.dumps(rst)
print(rst)

