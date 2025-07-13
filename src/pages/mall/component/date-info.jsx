
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const DateInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
        <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">Duration</p>
          <p className="text-xs text-gray-600">0 Days, 0 Nights</p>
          <p className="mt-1 text-xs text-gray-500">Jan 01, 1970 - Jan 01, 1970</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-3 border border-green-100 bg-green-50 rounded-xl">
        <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">Registration</p>
          <p className="text-xs text-gray-600">Ends midnight</p>
          <p className="mt-1 text-xs text-gray-500">Jun 21, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default DateInfo;
