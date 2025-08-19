import React from 'react';

export interface DateFilter {
  period: 'year' | 'month';
  year: number;
  month?: number;
}

interface DashboardFilterProps {
  currentFilter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
  onRefresh: () => void;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({
  currentFilter,
  onFilterChange,
  onRefresh,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  const handlePeriodChange = (period: 'year' | 'month') => {
    if (period === 'year') {
      onFilterChange({
        period,
        year: currentFilter.year,
      });
    } else {
      onFilterChange({
        period,
        year: currentFilter.year,
        month: currentFilter.month || new Date().getMonth() + 1,
      });
    }
  };

  const handleYearChange = (year: number) => {
    onFilterChange({
      ...currentFilter,
      year,
    });
  };

  const handleMonthChange = (month: number) => {
    onFilterChange({
      ...currentFilter,
      month,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
          <h2 className="text-lg font-semibold text-gray-800">
            Bộ lọc thống kê
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm">Làm mới</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex items-end gap-6">
        {/* Period Type */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-2">
            Thống kê theo thời gian
          </label>
          <div className="relative">
            <select
              value={currentFilter.period}
              onChange={(e) =>
                handlePeriodChange(e.target.value as 'year' | 'month')
              }
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="year">Năm</option>
              <option value="month">Tháng</option>
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Year Selection */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-2">Chọn năm</label>
          <div className="relative">
            <select
              value={currentFilter.year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Month Selection - Only show when period is 'month' */}
        {currentFilter.period === 'month' && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Chọn tháng</label>
            <div className="relative">
              <select
                value={currentFilter.month || ''}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
              >
                <option value="">Tất cả</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFilter;
