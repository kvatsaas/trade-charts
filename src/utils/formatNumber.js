// Format number to remove unnecessary decimals
// 3.0 -> "3", 3.5 -> "3.5", 3.14 -> "3.1"
export function formatNumber(num) {
  if (typeof num !== 'number') return num;
  
  // Check if it's a whole number
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Otherwise show one decimal place
  return num.toFixed(1);
}