import react from 'react';
const ReportCard = ({ item, reporter, reason, status, date }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{item}</h3>
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">{status}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>Reporter: {reporter}</div>
        <div>Reason: <span className="text-yellow-600">{reason}</span></div>
        <div>Date: {date}</div>
        <div className="flex space-x-2">
          <button className="text-blue-500 hover:text-blue-700">👁️</button>
          <button className="text-blue-500 hover:text-blue-700">📝</button>
          <button className="text-blue-500 hover:text-blue-700">...</button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;