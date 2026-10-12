import React, { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  ethiopianToGregorianISO,
  getTodayEthiopian,
  isValidEthiopianDate
} from '../utils/ethiopianCalendar';

export default function EthiopianDatePicker({ value, onChange, label }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value) {
      const ethDate = gregorianToEthiopian(value);
      setYear(ethDate.year.toString());
      setMonth(ethDate.month.toString());
      setDay(ethDate.day.toString());
      setError('');
    } else {
      // Don't auto-fill with today's date
      setYear('');
      setMonth('');
      setDay('');
      setError('');
    }
  }, [value]);

  const handleChange = () => {
    if (year && month && day) {
      const y = parseInt(year);
      const m = parseInt(month);
      const d = parseInt(day);

      if (y < 2019) {
        setError('Year must be 2019 or later');
        return;
      }

      if (isValidEthiopianDate(y, m, d)) {
        // Convert Ethiopian to Gregorian ISO format
        const isoDate = ethiopianToGregorianISO(y, m, d);
        onChange(isoDate);
        setError('');
      } else {
        setError('Invalid date');
      }
    }
  };

  const handleDayChange = (e) => {
    const newD = e.target.value;
    setDay(newD);
    
    // Check if all fields will be filled after this update
    const m = parseInt(month);
    const y = parseInt(year);
    const d = parseInt(newD);
    
    if (y && m && d) {
      // Trigger conversion after state updates
      setTimeout(() => {
        if (isValidEthiopianDate(y, m, d)) {
          const isoDate = ethiopianToGregorianISO(y, m, d);
          onChange(isoDate);
          setError('');
        } else {
          setError('Invalid date');
        }
      }, 0);
    }
  };

  const handleMonthChange = (e) => {
    const newM = e.target.value;
    setMonth(newM);
    
    // Check if all fields will be filled after this update
    const m = parseInt(newM);
    const y = parseInt(year);
    const d = parseInt(day);
    
    if (y && m && d) {
      // Trigger conversion after state updates
      setTimeout(() => {
        if (isValidEthiopianDate(y, m, d)) {
          const isoDate = ethiopianToGregorianISO(y, m, d);
          onChange(isoDate);
          setError('');
        } else {
          setError('Invalid date');
        }
      }, 0);
    }
  };

  const handleYearChange = (e) => {
    const newY = e.target.value;
    setYear(newY);
    
    // Check if all fields will be filled after this update
    const y = parseInt(newY);
    const m = parseInt(month);
    const d = parseInt(day);
    
    if (y && m && d) {
      if (y < 2019) {
        setError('Year must be 2019 or later');
        return;
      }
      
      // Trigger conversion after state updates
      setTimeout(() => {
        if (isValidEthiopianDate(y, m, d)) {
          const isoDate = ethiopianToGregorianISO(y, m, d);
          onChange(isoDate);
          setError('');
        } else {
          setError('Invalid date');
        }
      }, 0);
    }
  };

  const getDaysInMonth = () => {
    const m = parseInt(month);
    if (m >= 1 && m <= 12) return 30;
    if (m === 13) return 5; // Simplified, should check leap year
    return 30;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || 'Date (Ethiopian Calendar)'}
      </label>
      <div className="flex gap-2">
        {/* Day Selector */}
        <select
          value={day}
          onChange={handleDayChange}
          className="border border-gray-300 rounded px-3 py-2 w-20"
        >
          <option value="">DD</option>
          {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
          ))}
        </select>

        {/* Month Selector - Numbers 01-13 */}
        <select
          value={month}
          onChange={handleMonthChange}
          className="border border-gray-300 rounded px-3 py-2 w-20"
        >
          <option value="">MM</option>
          {Array.from({ length: 13 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>

        {/* Year Input */}
        <input
          type="number"
          value={year}
          onChange={handleYearChange}
          className="border border-gray-300 rounded px-3 py-2 w-24"
          placeholder="YYYY"
          min="2019"
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 font-semibold">
          {error}
        </div>
      )}
    </div>
  );
}
