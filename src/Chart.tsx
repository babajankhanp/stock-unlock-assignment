import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title';
import GoogleStocksData from "./utils/stocksTransactions.json";

interface Transaction {
  action: 'B' | 'S';
  date: string;
  positionAveragePrice: number | null;
  price: number;
  quantity: number;
}

const stockToTransactions = {
  'GOOGL': [
    {
      'action': 'B',
      'date': '2021-01-04',
      'positionAveragePrice': null,
      'price': 86.31,
      'quantity': 5,
    },
    {
      'action': 'B',
      'date': '2022-01-04',
      'positionAveragePrice': null,
      'price': 144.4,
      'quantity': 5,
    },
    {
      'action': 'S',
      'date': '2023-07-26',
      'positionAveragePrice': 115.355,
      'price': 129.27,
      'quantity': 5,
    },
  ] as Transaction[],
};

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

function transformStockData(
  data: Record<string, { close: number; timestamp: number }>,
  transactions: Transaction[]
) {
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let netSharesOwned = 0;  // Track net shares owned
  let totalInvestment = 0; // Track total investment amount

  // Convert data entries to array and sort by timestamp
  const sortedData = Object.entries(data)
    .map(([timestamp, values]) => ({
      timestamp: parseInt(timestamp),
      ...values
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return sortedData
    .map((values) => {
      const currentDate = formatDate(values.timestamp);
      const currentPrice = values.close;

      // Find if there's a transaction on this date
      const transaction = sortedTransactions.find(t => {
        const transactionDate = formatDate(t.date);
        return transactionDate === currentDate;
      });

      try {
        // Update portfolio based on transaction
        if (transaction) {
          if (transaction.action === 'B') {
            netSharesOwned += transaction.quantity;
            totalInvestment += transaction.quantity * transaction.price;
          } else if (transaction.action === 'S') {
            netSharesOwned -= transaction.quantity;
            // Calculate realized gain/loss
            const saleProceeds = transaction.quantity * transaction.price;
            totalInvestment = (netSharesOwned > 0)
              ? (totalInvestment * (netSharesOwned / (netSharesOwned + transaction.quantity)))
              : 0;
          }
        }

        // Calculate current market value of remaining shares
        const portfolioValue = netSharesOwned * currentPrice;

        // Calculate unrealized gain/loss
        const unrealizedGainLoss = portfolioValue - totalInvestment;

        const displayDate = new Date(values.timestamp * 1000)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

        return {
          date: displayDate,
          price: currentPrice,
          portfolioValue: portfolioValue,
          sharesOwned: netSharesOwned,
          unrealizedGainLoss: unrealizedGainLoss,
          transaction: transaction ? {
            action: transaction.action,
            price: transaction.price,
            quantity: transaction.quantity
          } : null
        };
      } catch (error) {
        console.error('Error processing data point:', {
          date: currentDate,
          currentPrice,
          transaction,
          error
        });
        return {
          date: new Date(values.timestamp * 1000).toLocaleDateString(),
          price: currentPrice,
          portfolioValue: netSharesOwned * currentPrice,
          sharesOwned: netSharesOwned,
          unrealizedGainLoss: 0,
          transaction: null
        };
      }
    })
    .filter(item => {
      try {
        const firstTransactionDate = formatDate(sortedTransactions[0].date);
        const itemDate = formatDate(new Date(item.date).getTime() / 1000);
        return itemDate >= firstTransactionDate;
      } catch (error) {
        console.error('Date filtering error:', error);
        return false;
      }
    });
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
    const transformedData = transformStockData(GoogleStocksData, stockToTransactions.GOOGL);
    setStockData(transformedData);
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
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <Title>Google Stock Portfolio  Analysis</Title>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            marginTop: '8px'
          }}>
            Current Portfolio Value: ${currentPortfolioValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>
        <TimeRangeSelector />
      </div>

      {/* Chart container with increased height */}
      <div style={{ height: '600px', width: '100%' }}>
        <ResponsiveContainer>
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 24,
            }}
          >
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
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
              dot={(props) => {
                const { payload } = props;
                if (payload.transaction) {
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={payload.transaction.action === 'B' ? 'green' : 'red'}
                      stroke="none"
                    />
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}
