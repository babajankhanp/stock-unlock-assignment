import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, DotProps } from 'recharts';
import Title from './Title';
import { stockToTransactions } from './utils/stocksTrans';

interface Transaction {
  action: 'B' | 'S';
  date: string;
  positionAveragePrice: number | null;
  price: number;
  quantity: number;
}

// Helper function to format dates consistently
const formatDate = (dateStr: string | number) => {
  try {
    let date: Date;
    if (typeof dateStr === 'number') {
      date = new Date(dateStr * 1000);
    } else {
      // Handle string dates in YYYY-MM-DD format
      const [year, month, day] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, day);
    }

    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date formatting error:', dateStr, error);
    return '';
  }
};

function transformStockData(transactions: Transaction[]) {
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let netSharesOwned = 0;  // Track net shares owned
  let totalInvestment = 0; // Track total investment amount

  // Create array of dates between first and last transaction
  const startDate = new Date(sortedTransactions[0].date);
  const endDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);
  const dailyData = [];

  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // Find if there's a transaction on this date
    const transaction = sortedTransactions.find(t => t.date === currentDateStr);

    try {
      // Update portfolio based on transaction
      if (transaction) {
        if (transaction.action === 'B') {
          netSharesOwned += transaction.quantity;
          totalInvestment += transaction.quantity * transaction.price;
        } else if (transaction.action === 'S') {
          netSharesOwned -= transaction.quantity;
          // Calculate realized gain/loss
          totalInvestment = (netSharesOwned > 0)
            ? (totalInvestment * (netSharesOwned / (netSharesOwned + transaction.quantity)))
            : 0;
        }
      }

      // Use transaction price or previous day's price
      const currentPrice: number = transaction ? transaction.price :
        (dailyData.length > 0 ? dailyData[dailyData.length - 1].price : sortedTransactions[0].price);

      // Calculate current market value of remaining shares
      const portfolioValue = netSharesOwned * currentPrice;

      // Calculate unrealized gain/loss
      const unrealizedGainLoss = portfolioValue - totalInvestment;

      const displayDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      dailyData.push({
        date: displayDate,
        price: currentPrice,
        portfolioValue: portfolioValue,
        sharesOwned: netSharesOwned,
        unrealizedGainLoss: unrealizedGainLoss,
        totalInvestment: totalInvestment,
        transaction: transaction ? {
          action: transaction.action,
          price: transaction.price,
          quantity: transaction.quantity
        } : null
      });

    } catch (error) {
      console.error('Error processing data point:', {
        date: currentDateStr,
        transaction,
        error
      });
    }
  }

  return dailyData;
}

// Add this type near the top of the file
type TimeRange = '1D' | '1M' | '1Y' | 'MAX';

export default function Chart() {
  const [stockData, setStockData] = React.useState<Array<{
    date: string;
    price: number;
    portfolioValue: number;
    sharesOwned: number;
    unrealizedGainLoss: number;
    totalInvestment: number;
    transaction: { action: string; price: number; quantity: number } | null;
  }>>([]);
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>('MAX');
  const theme = useTheme();

  // Function to filter data based on time range
  const getFilteredData = React.useCallback((data: typeof stockData, range: TimeRange) => {
    if (range === 'MAX' || data.length === 0) return data;

    const lastDate = new Date(data[data.length - 1].date);
    const startDate = new Date(lastDate);

    switch (range) {
      case '1D':
        startDate.setDate(lastDate.getDate() - 1);
        break;
      case '1M':
        startDate.setMonth(lastDate.getMonth() - 1);
        break;
      case '1Y':
        startDate.setFullYear(lastDate.getFullYear() - 1);
        break;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  }, []);

  React.useEffect(() => {
    try {
      const transformedData = transformStockData(stockToTransactions.GOOGL);
      console.log('Transformed Data:', transformedData); // For debugging
      setStockData(transformedData);
    } catch (error) {
      console.error('Error transforming stock data:', error);
    }
  }, []);

  // Add the TimeRangeSelector component
  const TimeRangeSelector = () => {
    const ranges: TimeRange[] = ['1D', '1M', '1Y', 'MAX'];

    return (
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        marginBottom: '16px'
      }}>
        {ranges.map(range => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            style={{
              padding: '4px 12px',
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '4px',
              background: selectedRange === range
                ? theme.palette.primary.main
                : 'transparent',
              color: selectedRange === range
                ? 'white'
                : theme.palette.primary.main,
              cursor: 'pointer'
            }}
          >
            {range}
          </button>
        ))}
      </div>
    );
  };

  // Filter data based on selected range
  const filteredData = React.useMemo(() =>
    getFilteredData(stockData, selectedRange),
    [stockData, selectedRange, getFilteredData]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc'
        }}>
          <p>Date: {label}</p>
          <p>Portfolio Value: ${data.portfolioValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
          <p>Shares Owned: {data.sharesOwned}</p>
          <p>Share Price: ${data.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
          {data.transaction && (
            <p style={{
              color: data.transaction.action === 'B' ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {data.transaction.action === 'B' ? 'Buy' : 'Sell'}: {data.transaction.quantity} shares
              @ ${data.transaction.price.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Add this to calculate current portfolio value
  const currentPortfolioValue = React.useMemo(() => {
    if (stockData.length === 0) return 0;
    return stockData[stockData.length - 1].portfolioValue;
  }, [stockData]);

  return (
    <React.Fragment>
      {/* Header section with title and current value */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div>
          <Title>Google Stock Portfolio Analysis</Title>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '8px'
          }}>
            <div style={{
              fontSize: '18px',
              color: theme.palette.text.secondary,
            }}>
              Current Value: ${currentPortfolioValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            {stockData.length > 0 && (
              <>
                <div style={{
                  fontSize: '18px',
                  color: theme.palette.text.secondary,
                }}>
                  Total Invested: ${stockData[stockData.length - 1].totalInvestment.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: stockData[stockData.length - 1].unrealizedGainLoss >= 0 ? 'green' : 'red',
                }}>
                  {stockData[stockData.length - 1].unrealizedGainLoss >= 0 ? 'Profit' : 'Loss'}: $
                  {Math.abs(stockData[stockData.length - 1].unrealizedGainLoss).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  ({((stockData[stockData.length - 1].unrealizedGainLoss /
                     stockData[stockData.length - 1].totalInvestment) * 100).toFixed(2)}%)
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}>
          <TimeRangeSelector />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'green'
              }} />
              <span>Bought Shares</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'red'
              }} />
              <span>Sold Shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart container with increased height */}
      <div style={{ height: '600px', width: '100%' }}>
        <ResponsiveContainer>
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              bottom: 60,
              left: 60,
            }}
          >
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              height={60}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
              angle={-45}
              textAnchor="end"
              interval={'preserveStartEnd'}
              dy={20}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: 'middle',
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                Price ($)
              </Label>
            </YAxis>
            <Tooltip content={<CustomTooltip />} />


<Line
  type="monotone"
  dataKey="portfolioValue"
  stroke={theme.palette.primary.main}
  dot={(props: DotProps) => {
    // Ensure props are checked correctly
    if (!props.cx || !props.cy || !props.payload || !props.payload.transaction) {
      return null;
    }

    // Return a custom dot element
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={4}
        fill={props.payload.transaction.action === 'B' ? 'green' : 'red'}
        stroke="none"
      />
    );
  }}
/>

          </LineChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}
