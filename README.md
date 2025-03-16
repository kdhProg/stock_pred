# 주식 예측 웹개발 프로젝트

## 개요
이 프로젝트는 **개인 연습용 주식 예측 사이트**입니다. 머신러닝을 활용하여 주식 동향을 예측하며, 
회원가입 및 커뮤니티 게시판과 같은 필수 사용자 기능을 구현합니다. 
구독 기능을 제한적으로 제공하지만, 실제 결제 API와는 연결되지 않습니다.

---

## 개발도구
- **Visual Studio Code**
- **Google Colab**
- **IntelliJ IDEA**

---

## 기술스택
### 프론트엔드
- **React**: 18.3.1
- **Node.js**: 18.20.2

### 백엔드
- **Java**: 17
- **Spring Boot**: 3.2.5

### 데이터베이스
- **ORM**: JPA
- **DB**: H2 Database

### 예측모델
- **python** 3.10.4
- 필수 설치 패키지 리스트 : [requirements.txt](./requirements.txt).
- 파이썬 패키지 설치
```bash
pip install -r requirements.txt
```
- **디펜던시 관련 공지** : 본 프로젝트에는 필수적이지 않은 패키지가 있을 수 있습니다.
- 핵심 패키지:
    - Keras
    - scikit-learn
    - NumPy
    - Pandas
    - pykrx
- **pykrx 관련 공지** : 크롤링 대상 사이트의 상황에 따른 pykrx API의 오류가 발생할 수 있습니다.
- 크롤링 패키지 상세 정보 : [pykrx repository](https://github.com/sharebook-kr/pykrx)

## 주요 특징
- **머신러닝을 활용한 주식 동향 예측**
- **회원가입 / 게시판 / 구독 결제 시스템**
---

## 프로젝트 시작
1. **저장소 복제**:
```bash
git clone https://github.com/kdhProg/stockPrediction
```

2. **프론트엔드 라이브러리 설치**
   
```bash
cd front/react
```
```bash
npm install
```
3. **프론트엔드 개발서버 실행**
```bash
npm run
```
4. **백엔드 개발서버 실행**
---
## 백엔드 구현 특징

### 1. **인증 / 인가**
- **스프링 시큐리티**를 이용하여 구현하였습니다.

### 2. **유저 테이블 설계**
- user / userpassword / userprofile / usersubsription으로 나누어 설계하였습니다.

---
## 스크린샷
<b>* 메인페이지</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/116d4bea-82ad-4684-8765-7ab794b9e620" alt="">
</p>
<b>* 회원가입</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/61d14872-01f7-4b4d-9d1a-915c5e54d8a5" alt="">
</p>
<b>* 로그인</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/89e38d20-9f72-42d6-9577-6341d06e3190" alt="">
</p>
<b>* 티커 선택</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/d4aa7a0a-a1ca-4b6a-92bb-39d0a6e7655c" alt="">
</p>
<b>* 데이터 프리뷰</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/b325211e-7123-4ead-9f54-d11c432c8ea5" alt="">
</p>
<b>* 예측</b>
<p align="center">
<img width="70%" src="https://github.com/user-attachments/assets/76c00e17-1d76-4435-91bc-5224927e16f0" alt="">
</p>


---

## 예측 모델 요약

1. **데이터 가져오기**
    - **`pykrx`** API를 이용하여 데이터를 가져옵니다.

2. **데이터 전처리**
    - train / test로 분리
    - 차분 적용
    - min-max 스케일링 적용

3. **LSTM 입력데이터 생성**
    - 지정한 예측 일수에 따른 데이터 포맷 생성

4. **모델 학습**

5. **예측 수행**

---
## 예측 모델 상세

### 1. 입력 데이터 가져오기
pykrx 라이브러리를 통해 사용자 입력 날짜와 주식 티커를 기준으로 데이터를 가져옵니다. 데이터 컬럼 이름은 일관성을 위해 변경됩니다.

```python
original_data = stock.get_market_ohlcv_by_date(fromdate=start_date, todate=end_date, ticker=ticker)
df = original_data.copy()
df.rename(columns={'날짜': 'Date', '시가': 'Open', '고가': 'High', '저가': 'Low', '종가': 'Close', '거래량': 'Volumne'}, inplace=True)
df = df.sort_values(by='Date')
```

### 2. 데이터 분할 및 차분 처리
사용자 정의 비율에 따라 데이터셋을 훈련 세트와 테스트 세트로 분리하며, 차분 처리를 적용해 데이터 정상성을 확보합니다.
```python
train = np.diff(df.loc[:split_index, pred_columns], axis=0)
test = np.diff(df.loc[split_index:, pred_columns], axis=0)
```

### 3. 데이터 정규화
Min-Max Scaling을 적용해 데이터를 0과 1 사이로 정규화합니다.
```python
sc_X = MinMaxScaler()
sc_y = MinMaxScaler()

train_sc = sc_y.fit_transform(train[:, findIndex].reshape(-1, 1))
test_sc = sc_y.transform(test[:, findIndex].reshape(-1, 1))
```


### 4. LSTM 입력 시퀀스 생성
PAST_PRED_DAYS 파라미터에 따라 데이터를 시퀀스로 변환합니다.
```python
X_train, y_train = [], []
for i in range(len(train_sc_df) - PAST_PRED_DAYS):
    X_train.append(train_sc_df.iloc[i:i + PAST_PRED_DAYS, :])
    y_train.append(train_sc_df.iloc[i + PAST_PRED_DAYS, pred_columns.index(target_column)])

X_train = np.array(X_train)
y_train = np.array(y_train)
```
### 5. LSTM 모델 구조와 학습
LSTM 레이어와 Dense 출력 레이어로 구성된 모델을 생성합니다. EarlyStopping을 사용해 10번 연속 검증 손실이 개선되지 않을 경우, 최적의 가중치로 복원합니다.
```python
model = Sequential()
model.add(LSTM(20, input_shape=(PAST_PRED_DAYS, len(pred_columns))))
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer='adam')
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

model.fit(X_train, y_train, epochs=epoch, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[early_stop], verbose=0)
```

### 6. 예측 및 역변환
학습된 모델로 테스트 세트를 예측한 뒤, 역변환을 통해 원래 값으로 복원합니다. 차분된 값을 누적 합산하여 원래 시계열 데이터를 복원합니다.
```python
y_pred = model.predict(X_test, verbose=0)
y_pred_inversed = sc_y.inverse_transform(y_pred)
y_pred_original = np.cumsum(np.vstack((first_val, y_pred_inversed)), axis=0)
```
### 7. 예측
최근 데이터를 바탕으로 식 값을 예측합니다.
```python
new_df = stock.get_market_ohlcv_by_date(fromdate=before_N_days, todate=today_str, ticker=ticker)
new_df_diff = np.diff(new_df[pred_columns], axis=0)

tomorrow_data = new_sc_df.tail(PAST_PRED_DAYS)
tomorrow_pred_raw = model.predict(tomorrow_reshape, verbose=0)
tomorrow_pred_raw_inv = sc_y.inverse_transform(tomorrow_pred_raw)
```

### 8. 출력 및 결과
예측 결과는 JSON 형식으로 정리되며, 프론트엔드와 통합됩니다.
```python
rst = OrderedDict()
rst["x_index"] = x_index
rst["pred"] = list(map(lambda x: (x[0]) // 1, y_pred_original))
rst["real"] = y_test_original.tolist()
rst["tomorrow_value"] = tomorrow_value
rst["today_value"] = today_value

print(json.dumps(rst))
```


---



