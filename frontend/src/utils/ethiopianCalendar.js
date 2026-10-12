// Ethiopian Calendar Converter

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tekemi', 'Hedar', 'Tahsas', 'Ter', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

/**
 * Convert Ethiopian date to ISO Gregorian date for storage
 * Ethiopian calendar runs 7-8 years behind Gregorian calendar
 * Ethiopian year 1 = Gregorian year 8/9 AD
 * Ethiopian Meskerem (month 1) = Gregorian September (month 9)
 */
export function ethiopianToGregorianISO(year, month, day) {
  // Ethiopian is 8 years behind Gregorian
  // Ethiopian 2019 = Gregorian 2027 is WRONG
  // Ethiopian year + 8 = Gregorian year ONLY for conversion formula purposes
  // But for practical purposes: Ethiopian 2019 = Gregorian 2011
  // The formula is actually: Ethiopian_year - 8 = actual_gregorian_equivalent
  // HOWEVER, the standard conversion formula used globally is:
  // Gregorian_year = Ethiopian_year + 8 (because Ethiopian epoch is 8 years earlier)
  
  // Using the standard formula: Gregorian = Ethiopian + 8
  let gregorianYear = year + 8;
  
  // Ethiopian months directly correspond to shifted Gregorian months:
  // Ethiopian month 1 (Meskerem) = September = month 9
  // Ethiopian month 2 (Tekemi) = October = month 10
  // Formula: Gregorian_month = Ethiopian_month + 8
  
  let gregorianMonth = month + 8;
  let gregorianDay = day;
  
  // Handle month overflow (when month > 12)
  if (gregorianMonth > 12) {
    gregorianMonth -= 12;
    gregorianYear += 1;
  }
  
  // Validate the date before formatting
  const testDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
  
  // Make sure the date didn't shift due to invalid day for month
  if (testDate.getMonth() !== gregorianMonth - 1) {
    // Day was invalid for this month, use last day of previous month
    const lastDayOfPrevMonth = new Date(gregorianYear, gregorianMonth - 1, 0);
    gregorianDay = lastDayOfPrevMonth.getDate();
  }
  
  // Format as ISO string YYYY-MM-DD (using local date, not UTC)
  const monthStr = String(gregorianMonth).padStart(2, '0');
  const dayStr = String(gregorianDay).padStart(2, '0');
  
  // Return as ISO date string for storage
  return `${gregorianYear}-${monthStr}-${dayStr}`;
}

/**
 * Convert Gregorian date to Ethiopian date for display
 */
export function gregorianToEthiopian(date) {
  let year, month, day;
  
  if (typeof date === 'string') {
    // Parse ISO date string directly without using Date object
    // This avoids timezone conversion issues
    const parts = date.split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    } else {
      // Fallback to Date object
      const d = new Date(date);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    }
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }
  
  // Ethiopian year is 8 years before Gregorian
  let ethYear = year - 8;
  
  // Determine Ethiopian month and adjust year if needed
  let ethMonth = month - 8;
  
  if (ethMonth <= 0) {
    ethMonth += 12;
    ethYear -= 1;
  }
  
  return { 
    year: ethYear, 
    month: ethMonth, 
    day: day 
  };
}

/**
 * Get today's date in Ethiopian calendar
 */
export function getTodayEthiopian() {
  return gregorianToEthiopian(new Date());
}

/**
 * Format Ethiopian date to table display format: DD/MM/YYYY
 */
export function formatEthiopianDateTable(year, month, day) {
  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  return `${dayStr}/${monthStr}/${year}`;
}

/**
 * Check if Ethiopian date is valid and year is 2019 or later
 */
export function isValidEthiopianDate(year, month, day) {
  // Only allow year 2019 and above
  if (year < 2019) {
    return false;
  }
  
  if (month < 1 || month > 13) return false;
  if (day < 1) return false;
  
  if (month <= 12) {
    return day <= 30;
  } else {
    // Pagume month (13th)
    return isEthiopianLeapYear(year) ? day <= 6 : day <= 5;
  }
}


/**
 * Check if Ethiopian year is a leap year
 * Every 4 years is a leap year, except years divisible by 100 (unless also divisible by 400)
 */
function isEthiopianLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}
