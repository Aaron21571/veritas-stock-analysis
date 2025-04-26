from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
import os

app = Flask(__name__)
CORS(app)

# --- Database Config ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# --- User Model ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

# --- Create Database ---
with app.app_context():
    db.create_all()

# --- Load trained LSTM model ---
model = tf.keras.models.load_model("lstm_stock_model.h5")

# Add technical indicators
def add_indicators(df):
    df['SMA_14'] = df['Close'].rolling(window=14).mean()
    df['EMA_14'] = df['Close'].ewm(span=14, adjust=False).mean()

    delta = df['Close'].diff()
    gain = delta.clip(lower=0).rolling(window=14).mean()
    loss = -delta.clip(upper=0).rolling(window=14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))

    ema_12 = df['Close'].ewm(span=12, adjust=False).mean()
    ema_26 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = ema_12 - ema_26
    df['MACD_signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    df['MACD_hist'] = df['MACD'] - df['MACD_signal']

    roll_mean = df['Close'].rolling(window=20).mean()
    roll_std = df['Close'].rolling(window=20).std()
    df['BB_upper'] = roll_mean + (2 * roll_std)
    df['BB_lower'] = roll_mean - (2 * roll_std)

    return df

# Prepare sequence for LSTM
def create_sequences(data, window=30):
    return np.array([data[i-window:i] for i in range(window, len(data))])

@app.route('/api/recommend/<ticker>', methods=['GET'])
def recommend_stock(ticker):
    try:
        df = yf.download(ticker, period="3mo", interval="1d", auto_adjust=True)

        if df.empty:
            return jsonify({'recommendation': 'Invalid ticker or no data'}), 400

        df = df[['Close']].copy()
        df = add_indicators(df)
        df.dropna(inplace=True)

        features = ['Close', 'SMA_14', 'EMA_14', 'RSI_14',
                    'MACD', 'MACD_signal', 'MACD_hist',
                    'BB_upper', 'BB_lower']

        if df.shape[0] < 30:
            return jsonify({'recommendation': 'Not enough data'}), 400

        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(df[features])
        sequences = create_sequences(scaled)
        latest_seq = sequences[-1:]
        prediction = model.predict(latest_seq)
        pred_class = np.argmax(prediction, axis=1)[0]

        label_map = {0: "Sell", 1: "Hold", 2: "Buy"}
        recommendation = label_map.get(pred_class, "Unknown")

        # Explanation logic
        rsi = df['RSI_14'].iloc[-1]
        macd = df['MACD'].iloc[-1]
        if recommendation == "Buy":
            explanation = f"The AI suggests buying as the RSI ({rsi:.1f}) is rising and MACD ({macd:.2f}) is positive, indicating upward momentum."
        elif recommendation == "Sell":
            explanation = f"The AI suggests selling as the RSI ({rsi:.1f}) is falling and MACD ({macd:.2f}) is negative, indicating downward pressure."
        else:
            explanation = f"The AI suggests holding as the RSI ({rsi:.1f}) and MACD ({macd:.2f}) appear stable with no strong signal."

        return jsonify({
            'ticker': ticker.upper(),
            'recommendation': recommendation,
            'explanation': explanation
        })

    except Exception as e:
        return jsonify({'recommendation': 'Error', 'details': str(e)}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401



@app.route('/api/chart/<ticker>', methods=['GET'])
def get_chart_data(ticker):
    try:
        df = yf.download(ticker, period="6mo", interval="1d", auto_adjust=True)

        if df.empty:
            return jsonify({'error': 'No data available for this ticker'}), 404

        df.reset_index(inplace=True)
        df['Date'] = df['Date'].astype(str)

        chart_data = df[['Date', 'Open', 'High', 'Low', 'Close']].copy()
        chart_data.columns = ['date', 'open', 'high', 'low', 'close']

        return jsonify(chart_data.to_dict(orient='records'))

    except Exception as e:
        print("🔥 Chart API error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/ticker-prices')
def get_ticker_prices():
    symbols = {
        'AAPL': 'apple.com',
        'MSFT': 'microsoft.com',
        'TSLA': 'tesla.com',
        'GOOG': 'google.com',
        'AMZN': 'amazon.com',
        'META': 'facebook.com',
        'NFLX': 'netflix.com',
        'NVDA': 'nvidia.com',
        'INTC': 'intel.com',
        'AMD': 'amd.com',
        'BA': 'boeing.com',
        'CRM': 'salesforce.com',
        'PYPL': 'paypal.com',
        'ORCL': 'oracle.com',
        'SPY': 'spy.com',
        'QQQ': 'qqq.com',
        'SOFI': 'sofi.com',
        'ROKU': 'roku.com',
        'LYFT': 'lyft.com',
        'UBER': 'uber.com',
        'WMT': 'walmart.com',
        'T': 'att.com',
        'PEP': 'pepsico.com',
        'KO': 'coca-cola.com'
    }

    result = []
    try:
        for symbol, domain in symbols.items():
            stock = yf.Ticker(symbol)
            hist = stock.history(period="2d")
            if hist.shape[0] < 2:
                continue
            price = hist.iloc[-1]['Close']
            prev = hist.iloc[-2]['Close']
            change = price - prev
            percent = change / prev
            result.append({
                'symbol': symbol,
                'price': price,
                'change': change,
                'percent': percent,
                'domain': domain
            })
    except Exception as e:
        print('Error fetching ticker prices:', str(e))
    return jsonify(result)

@app.route('/api/featured-stocks', methods=['GET'])
def get_featured_stocks():
    tickers = ['AAPL', 'TSLA', 'GOOG', 'AMZN', 'NVDA', 'META']
    try:
        data = yf.download(tickers, period="1d", interval="1m", group_by='ticker', progress=False)
        featured_data = []
        for symbol in tickers:
            df = data[symbol]
            last_price = df['Close'].dropna().iloc[-1]
            prev_price = df['Close'].dropna().iloc[-2] if len(df['Close'].dropna()) > 1 else last_price
            change = last_price - prev_price
            featured_data.append({
                'symbol': symbol,
                'price': round(float(last_price), 2),
                'change': round(float(change), 2)
            })
        return jsonify(featured_data)
    except Exception as e:
        print("🔥 Error in featured-stocks API:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5050)
