interface Transaction {
  action: 'B' | 'S';
  date: string;
  positionAveragePrice: number | null;
  price: number;
  quantity: number;
}

export const stockToTransactions = {
  'GOOGL': [
    {
      'action': 'B',
      'date': '2021-01-04',
      'positionAveragePrice': null,
      'price': 156.31,
      'quantity': 100,
    },
    {
      'action': 'B',
      'date': '2021-04-15',
      'positionAveragePrice': null,
      'price': 172.45,
      'quantity': 150,
    },
    {
      'action': 'B',
      'date': '2021-08-22',
      'positionAveragePrice': null,
      'price': 185.20,
      'quantity': 200,
    },
    {
      'action': 'S',
      'date': '2021-12-10',
      'positionAveragePrice': 173.15,
      'price': 194.40,
      'quantity': 100,
    },
    {
      'action': 'B',
      'date': '2022-03-05',
      'positionAveragePrice': null,
      'price': 206.75,
      'quantity': 250,
    },
    {
      'action': 'B',
      'date': '2022-06-18',
      'positionAveragePrice': null,
      'price': 223.50,
      'quantity': 300,
    },
    {
      'action': 'B',
      'date': '2022-09-03',
      'positionAveragePrice': null,
      'price': 245.30,
      'quantity': 200,
    },
    {
      'action': 'S',
      'date': '2022-12-15',
      'positionAveragePrice': 225.18,
      'price': 258.75,
      'quantity': 150,
    },
    {
      'action': 'B',
      'date': '2023-03-22',
      'positionAveragePrice': null,
      'price': 269.27,
      'quantity': 400,
    },
    {
      'action': 'B',
      'date': '2023-06-08',
      'positionAveragePrice': null,
      'price': 285.40,
      'quantity': 350,
    },
    {
      'action': 'B',
      'date': '2023-09-17',
      'positionAveragePrice': null,
      'price': 296.80,
      'quantity': 300,
    },
    {
      'action': 'B',
      'date': '2023-12-25',
      'positionAveragePrice': null,
      'price': 315.60,
      'quantity': 250,
    },
    {
      'action': 'B',
      'date': '2024-01-14',
      'positionAveragePrice': null,
      'price': 328.25,
      'quantity': 400,
    }
  ] as Transaction[],
};

