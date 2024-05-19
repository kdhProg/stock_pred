import pandas as pd
import sys

from keras.layers import LSTM
from keras.models import Sequential
from keras.layers import Dense
import keras.backend as K

from sklearn.preprocessing import MinMaxScaler


# df = pd.read_csv('data_1150_20240508.csv',encoding='cp949')

# 과거 몇일의 데이터로 예측(25 -> 10으로 변경)
PAST_PRED_DAYS = 10

# JAVA가 줄것
# CSV_NAME = sys.argv[1]

# CSV_PATH = "./python_modules/csvFiles/" + CSV_NAME

df = pd.read_csv("./csvFiles/005930.KS_20240512154144.csv")



df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values(by='Date')
total_dates = len(df)
thirty_percent = int(total_dates * 0.3)   # 누적 30%정도의 날짜를 기준으로 split 예정
selected_date = df.iloc[thirty_percent - 1:thirty_percent]['Date'].dt.strftime('%Y-%m-%d').values[0]


split_date = thirty_percent

train = df.loc[:split_date, ['Close']]
test = df.loc[split_date:, ['Close']]

sc = MinMaxScaler()

train_sc = sc.fit_transform(train)

test_sc = sc.transform(test)

train_sc_df = pd.DataFrame(train_sc, columns=['Scaled'],index=train.index)

test_sc_df = pd.DataFrame(test_sc, columns=['Scaled'], index=test.index)

for s in range(1, 1+PAST_PRED_DAYS):
  train_sc_df['shift_{}'.format(s)] = train_sc_df['Scaled'].shift(s)
  test_sc_df['shift_{}'.format(s)] = test_sc_df['Scaled'].shift(s)
  
  
X_train = train_sc_df.dropna().drop('Scaled', axis=1)
y_train = train_sc_df.dropna()[['Scaled']]
X_test = test_sc_df.dropna().drop('Scaled', axis=1)
y_test = test_sc_df.dropna()[['Scaled']]


X_train = X_train.values
X_test= X_test.values
y_train = y_train.values
y_test = y_test.values

X_train_t = X_train.reshape(X_train.shape[0], PAST_PRED_DAYS, 1)
X_test_t = X_test.reshape(X_test.shape[0], PAST_PRED_DAYS, 1)


K.clear_session()
model = Sequential()
model.add(LSTM(20, input_shape=(PAST_PRED_DAYS, 1))) # (timestep, feature)
model.add(Dense(1)) # output 개수 = 1
model.compile(loss='mean_squared_error', optimizer='adam')


model.fit(X_train_t, y_train, epochs=100,batch_size=10, verbose=0)
  

# today라고 했지만 그냥 csv의 맨 마지막일
today = (df.loc[:, ['Close']])

today_sc = sc.transform(today)
today_sc_df = pd.DataFrame(today_sc, columns=['Scaled'], index=today.index)

for s in range(1, 1+PAST_PRED_DAYS):
  today_sc_df['shift_{}'.format(s)] = train_sc_df['Scaled'].shift(s)

today_test = today_sc_df.dropna().drop('Scaled', axis=1)
today_test= today_test.values

today_train_t = today_test.reshape(today_test.shape[0], PAST_PRED_DAYS, 1)

tomorrow = today_train_t[0].reshape(1,PAST_PRED_DAYS,1)



tomorrow_rst = model.predict(tomorrow)
# print(tomorrow_rst)

realVal = sc.inverse_transform(tomorrow_rst)
output = round(realVal[0][0])
print(output)