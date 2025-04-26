
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart,
  ChartCanvas,
  CandlestickSeries,
  LineSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  discontinuousTimeScaleProviderBuilder,
  lastVisibleItemBasedZoomAnchor,
  SingleValueTooltip
} from 'react-financial-charts';

function StockDetail() {
  const { ticker } = useParams();
  const [recommendation, setRecommendation] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showCandlestick, setShowCandlestick] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, chartRes] = await Promise.all([
          fetch(`http://localhost:5050/api/recommend/${ticker}`),
          fetch(`http://localhost:5050/api/chart/${ticker}`),
        ]);

        const recData = await recRes.json();
        const chartRaw = await chartRes.json();

        setRecommendation(recData.recommendation || '');
        setExplanation(recData.explanation || 'No explanation provided.');
        const formatted = chartRaw.map((d) => ({
          date: new Date(d.date),
          open: +d.open,
          high: +d.high,
          low: +d.low,
          close: +d.close,
        }));
        setChartData(formatted);
      } catch (err) {
        setError('Failed to load stock data.');
      }
    };

    fetchData();
  }, [ticker]);

  const getRecommendationColor = (rec) => {
    if (rec === 'Buy') return 'text-green-400';
    if (rec === 'Sell') return 'text-red-400';
    return 'text-yellow-400';
  };

  const margin = { left: 50, right: 50, top: 10, bottom: 30 };
  const height = 400;
  const width = 800;

  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(d => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(chartData);
  const start = xAccessor(data[Math.max(0, data.length - 80)]);
  const end = xAccessor(data[data.length - 1]);
  const xExtents = [start, end];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1a2b] to-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-5xl border-2 border-gold-gradient p-10 mt-8 shadow-lg">
        <h1 className="text-5xl font-bold text-gold-gradient text-center mb-4">{ticker.toUpperCase()}</h1>
        <h2 className="text-xl text-gold-gradient text-center mb-2">AI Recommendation</h2>
        {error && <p className="text-red-400 text-center mb-6">{error}</p>}
        {!error && recommendation && (
          <p className={`text-4xl font-bold text-center mb-4 ${getRecommendationColor(recommendation)}`}>
            {recommendation}
          </p>
        )}
        {!error && explanation && (
          <p className="text-center text-gray-400 italic mb-10">{explanation}</p>
        )}

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowCandlestick(false)}
            className={`px-6 py-2 border-2 font-semibold ${
              !showCandlestick ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400'
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setShowCandlestick(true)}
            className={`px-6 py-2 border-2 font-semibold ${
              showCandlestick ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400'
            }`}
          >
            Candlestick
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          {data.length > 0 && showCandlestick && (
            <ChartCanvas
              height={height}
              width={width}
              ratio={1}
              margin={margin}
              seriesName={ticker}
              data={data}
              xScale={xScale}
              xAccessor={xAccessor}
              displayXAccessor={displayXAccessor}
              xExtents={xExtents}
              zoomAnchor={lastVisibleItemBasedZoomAnchor}
            >
              <Chart id={1} yExtents={d => [d.high, d.low]}>
                <XAxis />
                <YAxis />
                <CandlestickSeries />
                <MouseCoordinateX displayFormat={d => d.toLocaleDateString()} />
                <MouseCoordinateY displayFormat={v => v.toFixed(2)} />
              </Chart>
              <CrossHairCursor />
            </ChartCanvas>
          )}

          {!showCandlestick && (
            <ChartCanvas
              height={height}
              width={width}
              ratio={1}
              margin={margin}
              seriesName={ticker}
              data={data}
              xScale={xScale}
              xAccessor={xAccessor}
              displayXAccessor={displayXAccessor}
              xExtents={xExtents}
              zoomAnchor={lastVisibleItemBasedZoomAnchor}
            >
              <Chart id={1} yExtents={d => d.close}>
                <XAxis />
                <YAxis />
                <LineSeries yAccessor={d => d.close} stroke="url(#goldGradient)" strokeWidth={2} />
                <MouseCoordinateX displayFormat={d => d.toLocaleDateString()} />
                <MouseCoordinateY displayFormat={v => v.toFixed(2)} />
                <SingleValueTooltip yAccessor={d => d.close} yLabel="Close" labelFill="#facc15" />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
              </Chart>
              <CrossHairCursor />
            </ChartCanvas>
          )}
        </div>

        <p className="mt-10 text-xs text-yellow-400 text-center">
          ⚠️ This is an educational tool. Predictions are AI-generated and not financial advice.
        </p>
      </div>
    </div>
  );
}

export default StockDetail;
