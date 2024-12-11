interface Transaction {
  action: 'B' | 'S';
  date: string;
  positionAveragePrice: number | null;
  price: number;
  quantity: number;
}

export const stockToTransactions = {
  'GOOGL': [
    // January
    { 'action': 'B', 'date': '2023-01-03', 'positionAveragePrice': null, 'price': 85.31, 'quantity': 3 },
    { 'action': 'B', 'date': '2023-01-17', 'positionAveragePrice': null, 'price': 92.4, 'quantity': 3 },
    { 'action': 'S', 'date': '2023-01-25', 'positionAveragePrice': 88.85, 'price': 110.25, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-01-30', 'positionAveragePrice': null, 'price': 95.75, 'quantity': 2 },

    // February
    { 'action': 'B', 'date': '2023-02-03', 'positionAveragePrice': null, 'price': 105.6, 'quantity': 3 },
    { 'action': 'B', 'date': '2023-02-10', 'positionAveragePrice': null, 'price': 115.8, 'quantity': 3 },
    { 'action': 'B', 'date': '2023-02-18', 'positionAveragePrice': null, 'price': 120.2, 'quantity': 4 },
    { 'action': 'S', 'date': '2023-02-22', 'positionAveragePrice': 107.2, 'price': 125.3, 'quantity': 3 },

    // March
    { 'action': 'B', 'date': '2023-03-05', 'positionAveragePrice': null, 'price': 130.9, 'quantity': 3 },
    { 'action': 'B', 'date': '2023-03-12', 'positionAveragePrice': null, 'price': 135.0, 'quantity': 3 },
    { 'action': 'S', 'date': '2023-03-20', 'positionAveragePrice': 120.0, 'price': 145.5, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-03-27', 'positionAveragePrice': null, 'price': 140.0, 'quantity': 2 },

    // April
    { 'action': 'B', 'date': '2023-04-02', 'positionAveragePrice': null, 'price': 155.75, 'quantity': 3 },
    { 'action': 'B', 'date': '2023-04-08', 'positionAveragePrice': null, 'price': 160.2, 'quantity': 3 },
    { 'action': 'S', 'date': '2023-04-14', 'positionAveragePrice': 158.0, 'price': 170.8, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-04-22', 'positionAveragePrice': null, 'price': 165.5, 'quantity': 2 },

    // May
    { 'action': 'B', 'date': '2023-05-04', 'positionAveragePrice': null, 'price': 180.0, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-05-12', 'positionAveragePrice': null, 'price': 190.3, 'quantity': 3 },
    { 'action': 'S', 'date': '2023-05-18', 'positionAveragePrice': 185.0, 'price': 210.0, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-05-28', 'positionAveragePrice': null, 'price': 205.0, 'quantity': 2 },

    // June
    { 'action': 'B', 'date': '2023-06-02', 'positionAveragePrice': null, 'price': 220.5, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-06-08', 'positionAveragePrice': null, 'price': 230.0, 'quantity': 2 },
    { 'action': 'S', 'date': '2023-06-14', 'positionAveragePrice': 215.0, 'price': 240.0, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-06-23', 'positionAveragePrice': null, 'price': 245.5, 'quantity': 2 },

    // July
    { 'action': 'B', 'date': '2023-07-05', 'positionAveragePrice': null, 'price': 265.75, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-07-11', 'positionAveragePrice': null, 'price': 275.5, 'quantity': 2 },
    { 'action': 'S', 'date': '2023-07-20', 'positionAveragePrice': 260.0, 'price': 285.5, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-07-28', 'positionAveragePrice': null, 'price': 295.0, 'quantity': 2 },

    // August
    { 'action': 'B', 'date': '2023-08-02', 'positionAveragePrice': null, 'price': 320.5, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-08-10', 'positionAveragePrice': null, 'price': 330.0, 'quantity': 2 },
    { 'action': 'S', 'date': '2023-08-15', 'positionAveragePrice': 320.0, 'price': 340.0, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-08-25', 'positionAveragePrice': null, 'price': 355.5, 'quantity': 1 },

    // September
    { 'action': 'B', 'date': '2023-09-03', 'positionAveragePrice': null, 'price': 375.0, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-09-12', 'positionAveragePrice': null, 'price': 390.25, 'quantity': 1 },
    { 'action': 'S', 'date': '2023-09-18', 'positionAveragePrice': 385.0, 'price': 400.5, 'quantity': 2 },
    { 'action': 'B', 'date': '2023-09-28', 'positionAveragePrice': null, 'price': 410.0, 'quantity': 1 },

    // October
    { 'action': 'B', 'date': '2023-10-02', 'positionAveragePrice': null, 'price': 425.5, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-10-08', 'positionAveragePrice': null, 'price': 440.0, 'quantity': 1 },
    { 'action': 'S', 'date': '2023-10-15', 'positionAveragePrice': 420.0, 'price': 455.5, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-10-22', 'positionAveragePrice': null, 'price': 470.0, 'quantity': 1 },

    // November
    { 'action': 'B', 'date': '2023-11-03', 'positionAveragePrice': null, 'price': 485.25, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-11-09', 'positionAveragePrice': null, 'price': 495.75, 'quantity': 1 },
    { 'action': 'S', 'date': '2023-11-15', 'positionAveragePrice': 475.0, 'price': 505.5, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-11-24', 'positionAveragePrice': null, 'price': 515.5, 'quantity': 1 },

    // December
    { 'action': 'B', 'date': '2023-12-03', 'positionAveragePrice': null, 'price': 525.75, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-12-10', 'positionAveragePrice': null, 'price': 535.0, 'quantity': 1 },
    { 'action': 'S', 'date': '2023-12-15', 'positionAveragePrice': 520.0, 'price': 545.5, 'quantity': 1 },
    { 'action': 'B', 'date': '2023-12-22', 'positionAveragePrice': null, 'price': 555.5, 'quantity': 1 },
  ] as Transaction[],
};


