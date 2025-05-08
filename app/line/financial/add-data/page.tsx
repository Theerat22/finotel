"use client";
import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import Papa from 'papaparse';

interface FinanceItem {
  id: string;
  name: string;
  amount: number;
}

interface FinanceData {
  month: string;
  year: string;
  income: FinanceItem[];
  expenses: FinanceItem[];
}

const getDefaultFinanceData = (): FinanceData => ({
  month: new Date().toLocaleString('th-TH', { month: 'long' }),
  year: new Date().getFullYear().toString(),
  income: [
    { id: crypto.randomUUID(), name: 'การขายห้องพัก', amount: 0 },
    { id: crypto.randomUUID(), name: 'ขายอาหาร', amount: 0 }
  ],
  expenses: [
    { id: crypto.randomUUID(), name: 'ค่าพนักงาน', amount: 0 },
    { id: crypto.randomUUID(), name: 'ค่าไฟ', amount: 0 },
    { id: crypto.randomUUID(), name: 'ค่าน้ำ', amount: 0 },
    { id: crypto.randomUUID(), name: 'ค่าวัตถุดิบ', amount: 0 }
  ]
});

const monthNames = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 2
});

const HotelFinanceForm = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(getDefaultFinanceData());
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate totals
  const totalIncome = financeData.income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalExpenses = financeData.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinanceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (category: 'income' | 'expenses', id: string, field: 'name' | 'amount', value: string) => {
    setFinanceData(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    }));
  };

  const addNewItem = (category: 'income' | 'expenses') => {
    setFinanceData(prev => ({
      ...prev,
      [category]: [...prev[category], { id: crypto.randomUUID(), name: '', amount: 0 }]
    }));
  };

  const removeItem = (category: 'income' | 'expenses', id: string) => {
    setFinanceData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          try {
            // Define a more specific type for CSV rows
            interface CsvRow {
              type?: string;
              category?: string;
              name?: string;
              description?: string;
              amount?: number | string;
              [key: string]: unknown; // For any other fields that might be present
            }
            
            const csvData = results.data as CsvRow[];
            const newFinanceData = {
              month: financeData.month,
              year: financeData.year,
              income: [] as FinanceItem[],
              expenses: [] as FinanceItem[]
            };

            // Process income items
            const incomeItems = csvData.filter(row => row.type === 'income' || row.category === 'income');
            if (incomeItems.length > 0) {
              newFinanceData.income = incomeItems.map(item => ({
                id: crypto.randomUUID(),
                name: (item.name as string) || (item.description as string) || '',
                amount: Number(item.amount) || 0
              }));
            }

            // Process expense items
            const expenseItems = csvData.filter(row => row.type === 'expense' || row.category === 'expenses');
            if (expenseItems.length > 0) {
              newFinanceData.expenses = expenseItems.map(item => ({
                id: crypto.randomUUID(),
                name: (item.name as string) || (item.description as string) || '',
                amount: Number(item.amount) || 0
              }));
            }

            // If we have valid data, update the state
            if (newFinanceData.income.length > 0 || newFinanceData.expenses.length > 0) {
              setFinanceData(prev => ({
                ...prev,
                income: newFinanceData.income.length > 0 ? newFinanceData.income : prev.income,
                expenses: newFinanceData.expenses.length > 0 ? newFinanceData.expenses : prev.expenses
              }));
              setFormError('');
            } else {
              setFormError('ไม่พบข้อมูลที่ถูกต้องในไฟล์ CSV โปรดตรวจสอบรูปแบบไฟล์');
            }
          } catch (error) {
            console.error('Error processing CSV:', error);
            setFormError('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV');
          }
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setFormError('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV');
      }
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const incomeWithoutNames = financeData.income.some(item => !item.name.trim());
    const expensesWithoutNames = financeData.expenses.some(item => !item.name.trim());
    
    if (incomeWithoutNames || expensesWithoutNames) {
      setFormError('กรุณากรอกชื่อรายการให้ครบทุกรายการ');
      return;
    }
    
    // Submit form
    console.log('Submitting financial data:', financeData);
  };

  const handleCsvTemplateDownload = () => {
    const headers = 'type,name,amount\n';
    const rows = [
      'income,การขายห้องพัก,50000',
      'income,ขายอาหาร,15000',
      'expense,ค่าพนักงาน,20000',
      'expense,ค่าไฟ,5000',
      'expense,ค่าน้ำ,2000',
      'expense,ค่าวัตถุดิบ,8000'
    ].join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hotel_finance_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-8 bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-blue-600 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-xl font-bold text-white mb-2">ข้อมูลการเงินโรงแรม</h1>
            <p className="text-blue-100 mb-3 text-sm">กรอกข้อมูลรายรับ-รายจ่ายประจำเดือน</p>
            <div className="mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Month/Year Selection */}
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-5/12">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">เดือน</label>
                    <select
                      id="month"
                      name="month"
                      value={financeData.month}
                      onChange={handleMonthYearChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {monthNames.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-5/12">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">ปี</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={financeData.year}
                      onChange={handleMonthYearChange}
                      min="2000"
                      max="2100"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* CSV Upload Section */}
                <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">นำเข้าข้อมูลจากไฟล์ CSV</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="file"
                        id="csvFile"
                        name="csvFile"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCsvTemplateDownload}
                      className="text-xs px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      ดาวน์โหลดเทมเพลต
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">รองรับไฟล์ CSV ที่มีคอลัมน์ type, name, amount</p>
                </div>

                {/* Income Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">รายรับ</h3>
                    <button
                      type="button"
                      onClick={() => addNewItem('income')}
                      className="flex items-center text-xs space-x-1 px-2 py-1 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200"
                    >
                      <FaPlus className="h-3 w-3" />
                      <span>เพิ่มรายการ</span>
                    </button>
                  </div>
                  
                  {financeData.income.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="ชื่อรายการ"
                          value={item.name}
                          onChange={(e) => handleItemChange('income', item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="จำนวนเงิน"
                          value={item.amount}
                          onChange={(e) => handleItemChange('income', item.id, 'amount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem('income', item.id)}
                        disabled={financeData.income.length <= 1}
                        className={`p-2 rounded-md ${
                          financeData.income.length <= 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right text-sm font-medium mt-2">
                    รวมรายรับ: <span className="text-green-600">{currencyFormatter.format(totalIncome)}</span>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">รายจ่าย</h3>
                    <button
                      type="button"
                      onClick={() => addNewItem('expenses')}
                      className="flex items-center text-xs space-x-1 px-2 py-1 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200"
                    >
                      <FaPlus className="h-3 w-3" />
                      <span>เพิ่มรายการ</span>
                    </button>
                  </div>
                  
                  {financeData.expenses.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="ชื่อรายการ"
                          value={item.name}
                          onChange={(e) => handleItemChange('expenses', item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="จำนวนเงิน"
                          value={item.amount}
                          onChange={(e) => handleItemChange('expenses', item.id, 'amount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem('expenses', item.id)}
                        disabled={financeData.expenses.length <= 1}
                        className={`p-2 rounded-md ${
                          financeData.expenses.length <= 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right text-sm font-medium mt-2">
                    รวมรายจ่าย: <span className="text-red-600">{currencyFormatter.format(totalExpenses)}</span>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-700">กำไร/ขาดทุนสุทธิ</h3>
                    <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currencyFormatter.format(netProfit)}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="text-red-500 text-sm">{formError}</div>
                )}

                {/* Form Actions */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    // onClick={() => setActivePage('login')}
                    className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200"
                  >
                    <FaArrowLeft className="h-3 w-3" />
                    <span>ย้อนกลับ</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition duration-200"
                  >
                    <span>บันทึกข้อมูล</span>
                    <FaArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-1/3 bg-blue-600 flex-col items-center justify-center p-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">ข้อมูลการเงินโรงแรม</h1>
              <p className="text-blue-100 mb-6">กรอกข้อมูลรายรับ-รายจ่ายของโรงแรมในแต่ละเดือนเพื่อติดตามสถานะทางการเงิน</p>
              <div className="mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelFinanceForm;