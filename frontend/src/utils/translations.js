// Bilingual translations - Amharic & English

export const translations = {
  // Navigation
  nav: {
    users: 'ተጠቃሚዎች | Users',
    employees: 'ሰራተኞች | Employees',
    sales: 'ሽያጭ | Sales',
    payments: 'ክፍያዎች | Payments',
    purchases: 'ገዥ | Purchases',
    customers: 'ድበኞች | Customers',
    reports: 'ሪፖርቶች | Reports',
    admin: 'አስተዳደር | Admin',
    logout: 'ውጣ | Logout',
    backToHome: '← መጀመሪያ ገጽ | ← Back to Home'
  },

  // Employees Page
  employees: {
    title: 'ሰራተኞች ያስተዳድር | Employee Management',
    register: '+ ሰራተኛ ምዝገባ | + Register Employee',
    close: '✕ ዝጋ | ✕ Close',
    registerForm: 'ሰራተኛ ምዝገባ | Register Employee',
    list: 'ሰራተኞች ዝርዝር | Employees List',
    
    // Form Labels
    selectUser: 'ተጠቃሚ ምረጥ | Select User',
    jobPosition: 'የስራ ሁኔታ | Job Position',
    hireDate: 'የተቀጠረበት ቀን | Hire Date',
    salaryAmount: 'የደመወዝ መጠን | Salary Amount',
    paymentFrequency: 'የክፍያ ንግግር | Payment Frequency',
    
    // Payment Frequency Options
    daily: 'በቀን | Daily',
    weekly: 'በሳምንት | Weekly',
    monthly: 'በወር | Monthly',
    
    // Table Headers
    name: 'ስም | Name',
    position: 'ሥራ | Position',
    salary: 'ደመወዝ | Salary',
    frequency: 'ንግግር | Frequency',
    status: 'ሁኔታ | Status',
    lastPayment: 'ላስት ክፍያ | Last Payment',
    action: 'ተግባር | Action',
    
    // Payment Status
    paid: 'ተከፈለ | Paid',
    pending: 'በጥበት | Pending',
    overdue: 'ሮጅ | Overdue',
    
    // Buttons
    pay: '💰 ክፍያ | 💰 Pay',
    register: 'ሰራተኛ ምዝገባ | Register Employee',
    registering: 'በምዝገባ ላይ... | Registering...',
    
    // Messages
    loadingError: 'ሰራተኞች መጫን ተስኖ | Failed to load employees',
    usersLoadError: 'ተጠቃሚዎች መጫን ተስኖ | Failed to load users',
    requiredFields: 'እባክዎ ሁሉንም ግዳታ ሆኖ ያሉ ሜዳዎች ይሙሉ | Please fill all required fields',
    registerError: 'ሰራተኛ ምዝገባ ተስኖ | Failed to register employee',
    paymentError: 'ክፍያ ሂደት ተስኖ | Failed to process payment',
    payConfirm: 'ይህ ደመወዝ እንደተከፈለ ምልክት ይደረግ? | Mark this salary as paid?',
    noEmployees: 'ምንም ሰራተኞች አልተመዝገቡም | No employees registered',
    
    // Totals
    totalEmployees: 'ጠቅላላ ሰራተኞች | Total Employees',
    totalSalary: 'ጠቅላላ ደመወዝ | Total Salary',
    totalPending: 'በጥበት | Pending',
    totalPaid: 'ተከፈለ | Paid',
    
    // Placeholders
    selectEmployee: 'ሰራተኛ ምረጥ... | Choose employee...',
    jobExample: 'ለምሳሌ፣ ምግብ አዘጋጅ፣ ረዳት | e.g., Chef, Helper',
    enterSalary: 'ደመወዝ ያስገቡ | Enter salary'
  },

  // Sales Page
  sales: {
    title: 'ሽያጭ | Sales',
    recordSale: 'ሽያጭ ይመዝግቡ | Record Sale',
    salesList: 'ሽያጭ ዝርዝር | Sales List',
    filter: 'ማጣሪያ | Filter',
    filterByCustomer: 'ድበኛ ይምረጡ | Filter by Customer',
    allCustomers: 'ሁሉም ድበኞች | All Customers',
    
    saleDate: 'የሽያጭ ቀን | Sale Date',
    customer: 'ድበኛ | Customer',
    quantity: 'ብዛት | Quantity',
    unitPrice: 'አሃድ ዋጋ | Unit Price',
    total: 'ጠቅላላ | Total',
    
    addSale: 'ሽያጭ ያክሉ | Add Sale',
    adding: 'በመጨመር ላይ... | Adding...',
    delete: 'ሰርዝ | Delete',
    
    date: 'ቀን | Date',
    action: 'ተግባር | Action'
  },

  // Payments Page
  payments: {
    title: 'ክፍያዎች | Payments',
    recordPayment: 'ክፍያ ይመዝግቡ | Record Payment',
    paymentsList: 'ክፍያዎች ዝርዝር | Payments List',
    
    customer: 'ድበኛ | Customer',
    amount: 'መጠን | Amount',
    method: 'ዘዴ | Method',
    date: 'ቀን | Date',
    
    paymentDate: 'የክፍያ ቀን | Payment Date',
    paymentMethod: 'የክፍያ ዘዴ | Payment Method',
    cash: 'ገንዘብ | Cash',
    bank: 'ባንክ | Bank',
    check: 'ቼክ | Check',
    
    addPayment: 'ክፍያ ያክሉ | Add Payment',
    adding: 'በመጨመር ላይ... | Adding...',
    delete: 'ሰርዝ | Delete'
  },

  // Purchases Page
  purchases: {
    title: 'ገዥ (ወጪ ያስገቡ) | Purchases (Input Expenses)',
    recordPurchase: 'ገዥ ይመዝግቡ | Record Purchase',
    purchasesList: 'ገዥ ዝርዝር | Purchases List',
    
    category: 'ምድብ | Category',
    item: 'እቃ | Item',
    amount: 'መጠን | Amount',
    date: 'ቀን | Date',
    
    purchaseDate: 'የገዥ ቀን | Purchase Date',
    itemDescription: 'እቃ ግለጽ | Item Description',
    amountPaid: 'ክፍያ የተደረገ መጠን | Amount Paid',
    
    categoryTotals: 'በምድብ ጠቅላላ | Total by Category',
    addNewCategory: '+ አዲስ ምድብ ያክሉ | + Add New Category',
    addCategory: 'ምድብ ያክሉ | Add',
    
    addPurchase: 'ገዥ ያክሉ | Record Purchase',
    adding: 'በመጨመር ላይ... | Adding...',
    delete: 'ሰርዝ | Delete'
  },

  // Customers Page
  customers: {
    title: 'ድበኞች | Customers',
    addCustomer: 'ድበኛ ያክሉ | Add Customer',
    allCustomers: 'ሁሉም ድበኞች | All Customers',
    
    customerName: 'ድበኛ ስም | Customer Name',
    phone: 'ስልክ | Phone Number',
    
    totalInjera: 'ጠቅላላ እንጀራ ብዛት | Total Injera Taken',
    totalBilled: 'ጠቅላላ ገንዘብ | Total Billed',
    totalPaid: 'ጠቅላላ ክፍያ | Total Paid',
    balance: 'ቀሪ ብር | Outstanding Balance',
    
    salesHistory: 'የሽያጭ ታሪክ | Sales History',
    paymentHistory: 'የክፍያ ታሪክ | Payment History',
    
    qty: 'ብዛት | Qty',
    method: 'ዘዴ | Method',
    
    addBtn: 'ድበኛ ያክሉ | Add Customer',
    adding: 'በመጨመር ላይ... | Adding...'
  },

  // Reports Page
  reports: {
    title: 'ሪፖርቶች | Reports',
    
    // Metrics
    injseraSold: 'የተሸጠ እንጀራ ብዛት | Total Injera Sold Quantity',
    totalBirr: 'የሁሉም ብር | Total Birr',
    paidBirr: 'የተከፈለ ብር | Total Paid Birr',
    remainingBirr: 'ቀሪ ብር | Remaining Birr',
    customerCount: 'የድበኛ ብዛት | Customer Count',
    itemsPurchased: 'የተገዛ እቃ | Items Purchased',
    amountSpent: 'የፈጀው ብር | Amount Spent',
    
    expensesByCategory: 'ወጭ በምድብ | Expenses by Category',
    itemsPurchasedList: 'የተገዛ እቃዎች | Items Purchased',
    businessSummary: 'ቢሮ ማጠቃለያ | Business Summary',
    employees: 'ሰራተኞች | Employees',
    
    totalRecievables: 'ጠቅላላ ተቀብያ | Total Receivables',
    totalCollected: 'ጠቅላላ ተሰብሳቢ | Total Collected',
    totalSpent: 'ጠቅላላ ወጪ | Total Spent',
    netProfit: 'ንጽህ ትርፍ | Net Profit',
    
    allCustomersSummary: 'ሁሉም ድበኞች ማጠቃለያ | All Customers Summary',
    customerColumn: 'ድበኛ | Customer',
    phone: 'ስልክ | Phone',
    injseraTaken: 'እንጀራ ብዛት | Injera Taken',
    totalBilled: 'ጠቅላላ ገንዘብ | Total Billed',
    amountPaid: 'ክፍያ ያደረገ | Amount Paid',
    remainingBirr: 'ቀሪ ብር | Remaining Birr',
    
    allPurchases: 'ሁሉም ገዥዎች | All Purchases',
    date: 'ቀን | Date',
    category: 'ምድብ | Category',
    item: 'እቃ | Item',
    amount: 'መጠን | Amount',
    
    exportCsv: '📥 CSV ላ ውጹ | 📥 Export CSV'
  },

  // Users Page
  users: {
    title: 'ተጠቃሚዎች ያስተዳድር | User Management',
    allUsers: 'ሁሉም ተጠቃሚዎች | All Users',
    createUser: 'አዲስ ተጠቃሚ ስራ | Create New User',
    
    username: 'ተጠቃሚ ስም | Username',
    password: 'ይለፍ ቃል | Password',
    email: 'ኢሜይል | Email',
    role: 'ሚና | Role',
    status: 'ሁኔታ | Status',
    
    admin: 'አስተዳደር | Admin',
    user: 'ተጠቃሚ | User',
    active: 'ንቁ | Active',
    inactive: 'ተሰናክሏል | Inactive',
    
    createBtn: 'ተጠቃሚ ይፍጠሩ | Create User',
    creating: 'በመፍጠር ላይ... | Creating...',
    edit: 'ማስተካከል | Edit',
    deactivate: 'ተሰናክሉ | Deactivate',
    activate: 'ንቁ ያድርጉ | Activate',
    
    userExists: 'ተጠቃሚ ቀድሞ ነበር | User already exists',
    createSuccess: 'ተጠቃሚ በስኬት ተፈጠረ | User created successfully',
    updateSuccess: 'ተጠቃሚ በስኬት ተሻሻለ | User updated successfully',
    deleteSuccess: 'ተጠቃሚ በስኬት ተሰናክሏል | User deactivated successfully'
  },

  // Common
  common: {
    loading: 'በመጫን ላይ... | Loading...',
    error: 'ስህተት | Error',
    success: 'ስኬት | Success',
    close: 'ዝጋ | Close',
    save: 'ቀምጥ | Save',
    cancel: 'ይቅር | Cancel',
    delete: 'ሰርዝ | Delete',
    edit: 'ማስተካከል | Edit',
    add: 'ያክሉ | Add',
    back: '← ሂድ | ← Back',
    search: 'ፈልግ | Search',
    filter: 'ማጣሪያ | Filter',
    export: 'ወጹ | Export',
    import: 'ያስገቡ | Import',
    submit: 'ያስረክቡ | Submit',
    required: '* ግዳታ ነው | * Required',
    noData: 'ውሂብ የለም | No data',
    confirmDelete: 'ሰርዝ እርግጠኛ ነዎት? | Are you sure you want to delete?',
    selectField: 'ይምረጡ | Select...'
  }
};

// Helper function to get bilingual text
export function getBilingual(key, section = 'common') {
  try {
    const parts = key.split('.');
    let obj = translations;
    
    if (section !== 'common') {
      obj = translations[section] || translations.common;
    }
    
    for (let part of parts) {
      obj = obj[part];
    }
    
    return obj || key;
  } catch (error) {
    return key;
  }
}
