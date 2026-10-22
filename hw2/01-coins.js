/** Exercise 01 - Coins **/

const coins = [
  { name: 'dollar', plural: 'dollars', cents: 100 },
  { name: 'quarter', plural: 'quarters', cents: 25 },
  { name: 'dime', plural: 'dimes', cents: 10 },
  { name: 'nickel', plural: 'nickels', cents: 5 },
  { name: 'penny', plural: 'pennies', cents: 1 },
];

const calculateChange = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Error: the input is not a number';
  }
  if (amount < 0) {
    return 'Error: the number is negative';
  }
  if (amount > 100) {
    return `$${amount.toFixed(2)} ==> Error: the number is too large`;
  }

  // Work in whole cents so floating point math (e.g. 0.1 + 0.2) does not cause off by one errors
  let remaining = Math.round(amount * 100);
  const parts = [];

  coins.forEach((coin) => {
    const count = Math.floor(remaining / coin.cents);
    if (count > 0) {
      parts.push(`${count} ${count === 1 ? coin.name : coin.plural}`);
      remaining -= count * coin.cents;
    }
  });

  const result = parts.length > 0 ? parts.join(', ') : 'no coins needed';
  return `$${amount.toFixed(2)} ==> ${result}`;
};

// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large

// Add additional test cases here
console.log(calculateChange(100));
// $100.00 ==> 100 dollars
console.log(calculateChange(100.01));
// $100.01 ==> Error: the number is too large
console.log(calculateChange(0));
// $0.00 ==> no coins needed
console.log(calculateChange(0.01));
// $0.01 ==> 1 penny
console.log(calculateChange(0.99));
// $0.99 ==> 3 quarters, 2 dimes, 4 pennies
console.log(calculateChange(1.41));
// $1.41 ==> 1 dollar, 1 quarter, 1 dime, 1 nickel, 1 penny
console.log(calculateChange(0.1 + 0.2));
// $0.30 ==> 1 quarter, 1 nickel (floating point check)
console.log(calculateChange(-5));
// Error: the number is negative
console.log(calculateChange('5'));
// Error: the input is not a number
