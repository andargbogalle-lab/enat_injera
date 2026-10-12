import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmployeePayment from '../models/EmployeePayment.js';

dotenv.config();

// Helper function to convert Gregorian date to Ethiopian date
function gregorianToEthiopian(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Ethiopian year is 8 years before Gregorian (before September 11)
  // and 7 years before (after September 11)
  let ethYear = year - 8;
  
  // Determine Ethiopian month and adjust year if needed
  let ethMonth = month - 8;
  
  if (ethMonth <= 0) {
    ethMonth += 12;
    ethYear -= 1;
  }
  
  // Ensure Ethiopian year is at least 2019
  if (ethYear < 2019) {
    ethYear = 2019;
  }
  
  return { 
    year: ethYear, 
    month: ethMonth, 
    day: day 
  };
}

async function fixEthiopianYears() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all payment records with Ethiopian year < 2019
    const oldRecords = await EmployeePayment.find({
      'ethiopianDate.year': { $lt: 2019 }
    });

    console.log(`Found ${oldRecords.length} records with Ethiopian year < 2019`);

    if (oldRecords.length > 0) {
      let updated = 0;

      for (const record of oldRecords) {
        // Recalculate Ethiopian date from payment date
        const correctedDate = gregorianToEthiopian(record.paymentDate);
        
        record.ethiopianDate = correctedDate;
        await record.save();
        updated++;

        console.log(`✓ Updated record for ${record.employeeName} - New Ethiopian date: ${correctedDate.day}/${correctedDate.month}/${correctedDate.year}`);
      }

      console.log(`\n✅ Successfully updated ${updated} records`);
    } else {
      console.log('✅ No records need fixing - all Ethiopian years are 2019 or later');
    }

    await mongoose.connection.close();
    console.log('\n✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

fixEthiopianYears();
