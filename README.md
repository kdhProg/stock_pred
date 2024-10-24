# Stock Prediction Website

## Overview
This project is a **personal practice stock prediction site**. It leverages machine learning to forecast stock trends and provides essential user functionalities, such as membership registration and a community board. While the site offers a paid subscription feature, it does not connect to a payment API.

---

## Development Tools
- **Visual Studio Code (VSCode)**
- **Google Colab**
- **IntelliJ IDEA**

---

## Tech Stack
### Frontend
- **React**: 18.3.1
- **Node.js**: 18.20.2

### Backend
- **Java**: 17
- **Spring Boot**: 3.2.5

### Database
- **ORM**: JPA
- **DB**: H2 Database

### Prediction model
- **python** 3.10.4
- To install the necessary Python packages, please use the provided [requirements.txt](./requirements.txt) file.
- Install python dependencies
```bash
pip install -r requirements.txt
```
- **Note on Dependencies** : This requirements.txt reflects the general Python environment I commonly use, and therefore it may contain packages that are not essential for this specific project.
  For this project, the core dependencies include:
    - Keras
    - scikit-learn
    - NumPy
    - Pandas
    - pykrx
- **Important Notice on pykrx** : Be aware that changes to the crawling site may cause the pykrx API to malfunction. If you encounter such issues, please consult the official pykrx repository for updates or troubleshooting.
- For more details, refer to the [pykrx repository](https://github.com/sharebook-kr/pykrx).

## Key Features
- **Stock Prediction using Machine Learning**
    - Predict stock trends based on historical data.
- **User Registration & Community Board**
    - Notice boards and open discussion forums.
- **Paid Subscription Service**
    - Basic infrastructure for premium services (Payment API not connected).
---

## How to Run
1. **Clone the repository**:
```bash
git clone https://github.com/kdhProg/stockPrediction
```

2. **Move to front/react folder & Install dependencies for the frontend**
   
```bash
cd front/react
```
```bash
npm install
```
3. **Run the frontend**
```bash
npm run
```
4. **Run the backend(run springboot app)**
---
## Backend Implementation Details

### 1. **Authentication and Authorization**
- **Login**: Implemented using **Spring Security** to handle both authentication and authorization. This ensures that user credentials are secure and roles are properly managed.

### 2. **User Table Design**
- **User-Related Tables**:
    - **User**
    - **UserPassword**
    - **UserProfile**
    - **UserSubscription**

- **Design Choice**:  
  User information is **split across multiple tables** rather than being stored in a single table. Each of these tables has a **one-to-one bidirectional relationship** with the **User** table.

- **Reason for Splitting**:  
  Storing all user-related information in a single table would result in unnecessary data being queried every time a user record is accessed. By **separating the data by purpose**, only the relevant information is retrieved when needed, improving performance and reducing unnecessary data transfers.

---

## Python Prediction process Summary

1. **Get Data**
    - Fetch stock data using **`pykrx`** with user-specified ticker and date range.

2. **Preprocess Data**
    - Split into **training and testing sets**.
    - Apply **differencing** to ensure data stationarity.
    - **Normalize data** with Min-Max Scaling.

3. **Create LSTM Input**
    - Reshape data into sequences using **PAST_PRED_DAYS** for model input.

4. **Build and Train Model**
    - Build **LSTM model** with EarlyStopping to prevent overfitting.
    - Train using specified **epochs** and **batch size**.

5. **Make Predictions**
    - Use the trained model to **predict stock prices** for the test set.
    - **Inverse transformation** applied to restore original values.

6. **Real-Time Forecast**
    - Fetch latest stock data and **predict next day’s value**.

7. **Generate Results**
    - Output predictions and actual values as **JSON** for frontend integration.

---
## Data Preprocessing and Workflow Details

This project uses **`pykrx`**, a stock market data crawling library, to retrieve OHLCV (Open, High, Low, Close, Volume) data. The data is then preprocessed to fit the input format required by an **LSTM (Long Short-Term Memory) neural network**. Below is a detailed breakdown of the preprocessing steps, model training, and prediction logic.

---

### 1. Input Data Retrieval
The stock data is fetched using the **`pykrx`** library, with the input dates and stock ticker provided by the user. The data columns are renamed for consistency.

```python
original_data = stock.get_market_ohlcv_by_date(fromdate=start_date, todate=end_date, ticker=ticker)
df = original_data.copy()
df.rename(columns={'날짜': 'Date', '시가': 'Open', '고가': 'High', '저가': 'Low', '종가': 'Close', '거래량': 'Volumne'}, inplace=True)
df = df.sort_values(by='Date')
```

### 2. Data Splitting and Difference Transformation
The dataset is divided into training and testing sets based on the user-defined split ratio. A differencing operation is applied to ensure the data is stationary, improving the performance of time-series forecasting models.
```python
train = np.diff(df.loc[:split_index, pred_columns], axis=0)
test = np.diff(df.loc[split_index:, pred_columns], axis=0)
```

### 3. Data Normalization
   Min-Max Scaling is applied to normalize the data between 0 and 1. This ensures the data is suitable for the LSTM model. Separate scalers are used for the target column and other input columns.

```python
sc_X = MinMaxScaler()
sc_y = MinMaxScaler()

train_sc = sc_y.fit_transform(train[:, findIndex].reshape(-1, 1))
test_sc = sc_y.transform(test[:, findIndex].reshape(-1, 1))
```


### 4. Creating Sequences for LSTM Input
The data is reshaped into sequences to be used as input for the LSTM model. The number of past days used for prediction is controlled by the PAST_PRED_DAYS parameter.
```python
X_train, y_train = [], []
for i in range(len(train_sc_df) - PAST_PRED_DAYS):
    X_train.append(train_sc_df.iloc[i:i + PAST_PRED_DAYS, :])
    y_train.append(train_sc_df.iloc[i + PAST_PRED_DAYS, pred_columns.index(target_column)])

X_train = np.array(X_train)
y_train = np.array(y_train)
```
### 5. LSTM Model Architecture and Training
The model consists of an LSTM layer followed by a Dense output layer. EarlyStopping is employed to prevent overfitting, restoring the model's best weights if validation loss does not improve for 10 consecutive epochs.
```python
model = Sequential()
model.add(LSTM(20, input_shape=(PAST_PRED_DAYS, len(pred_columns))))
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer='adam')
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

model.fit(X_train, y_train, epochs=epoch, batch_size=batch_size, validation_data=(X_val, y_val), callbacks=[early_stop], verbose=0)
```

### 6. Prediction and Inverse Transformation
Once trained, the model predicts the stock prices for the test set. Inverse transformation is applied to convert the predictions back to their original scale. The cumulative sum is used to reconstruct the original time series from the differenced values.
```python
y_pred = model.predict(X_test, verbose=0)
y_pred_inversed = sc_y.inverse_transform(y_pred)
y_pred_original = np.cumsum(np.vstack((first_val, y_pred_inversed)), axis=0)
```
### 7. Real-Time Stock Prediction
The model can also predict future stock values based on the most recent data. This feature pulls real-time data, processes it, and generates a prediction for the next trading day.
```python
new_df = stock.get_market_ohlcv_by_date(fromdate=before_N_days, todate=today_str, ticker=ticker)
new_df_diff = np.diff(new_df[pred_columns], axis=0)

tomorrow_data = new_sc_df.tail(PAST_PRED_DAYS)
tomorrow_pred_raw = model.predict(tomorrow_reshape, verbose=0)
tomorrow_pred_raw_inv = sc_y.inverse_transform(tomorrow_pred_raw)
```

### 8. Output and Results
The predictions are formatted into JSON and include the predicted values, actual values, and the forecasted value for the next trading day. The results are printed as JSON output for easy integration with the frontend.
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
## Notes
- Payment services are not connected; this is intended only as a demonstration of the subscription feature.
- Make sure to use JDK 17 and Node.js 18+ for smooth operation.



