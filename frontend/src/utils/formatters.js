// Format number with commas as thousand separators
export const formatBirr = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount);
  }
  if (isNaN(amount)) return '0';
  
  // Format with 2 decimal places and add commas
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format number as whole number with commas (for display only, no decimals)
export const formatWholeNumber = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount);
  }
  if (isNaN(amount)) return '0';
  
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Format currency with birr symbol
export const formatCurrency = (amount) => {
  return `${formatBirr(amount)} ብር`;
};
