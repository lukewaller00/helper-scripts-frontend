import React from 'react';

type DayData = {
  date: string;
  am: string;
  pm: string;
};

type ResultsTableProps = {
  data: DayData[] | null;
};

const AttendanceResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const groupByWeeks = (days: DayData[]) => {
    const weeks: { weekStartDate: string; weekMarks: string[] }[] = [];
    let currentWeekMarks: string[] = [];
    let currentWeekStartDate: string | null = null;

    days.forEach((day) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || !currentWeekStartDate) {
        if (currentWeekStartDate) {
          weeks.push({ weekStartDate: currentWeekStartDate, weekMarks: currentWeekMarks });
        }
        currentWeekStartDate = day.date;
        currentWeekMarks = [];
      }

      currentWeekMarks.push(day.am || "", day.pm || "");
    });

    if (currentWeekStartDate) {
      weeks.push({ weekStartDate: currentWeekStartDate, weekMarks: currentWeekMarks });
    }

    return weeks;
  };

  if (!data) return null;

  const weekDays = [
    "Mon AM", "Mon PM", "Tue AM", "Tue PM", "Wed AM", "Wed PM", 
    "Thu AM", "Thu PM", "Fri AM", "Fri PM", "Sat AM", "Sat PM", 
    "Sun AM", "Sun PM"
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Attendance Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-50">Week Start</th>
              {weekDays.map((day, index) => (
                <th 
                  key={index} 
                  className="border border-gray-300 px-4 py-2 bg-gray-50"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupByWeeks(data).map((week, weekIndex) => (
              <tr key={weekIndex}>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium bg-gray-50">
                  {new Date(week.weekStartDate).toLocaleDateString()}
                </td>
                {week.weekMarks.map((mark, markIndex) => (
                  <td 
                    key={markIndex} 
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {mark}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceResultsTable;