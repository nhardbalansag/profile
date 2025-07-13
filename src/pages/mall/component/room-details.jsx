import React from 'react';
import { MapPin } from 'lucide-react';
import { InlineCard, InlineCardContent } from '../ui/inline-card';

interface RoomDetailsProps {
  guests: number;
  roomPrice: number;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ guests, roomPrice }) => {
  return (
    <InlineCard className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
      <InlineCardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Twin Sharing Room</h3>
              <p className="text-sm text-gray-600">{guests} guest{guests > 1 ? 's' : ''} per room</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${roomPrice}</p>
            <p className="text-xs text-gray-500">per room</p>
          </div>
        </div>
      </InlineCardContent>
    </InlineCard>
  );
};

export default RoomDetails;
