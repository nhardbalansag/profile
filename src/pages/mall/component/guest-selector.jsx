
import React from 'react';
import { Plus, Minus, Users } from 'lucide-react';
import { InlineButton } from '../ui/inline-button';

interface GuestSelectorProps {
  guests: number;
  maxGuests: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  maxGuests,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Users className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <span className="font-semibold text-gray-900">Guests</span>
          <p className="text-xs text-gray-500">Max {maxGuests} guests</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <InlineButton
          variant="outline"
          size="sm"
          onClick={onDecrement}
          disabled={guests <= 1}
          className="w-10 h-10 p-0 transition-all duration-200 border-2 border-orange-200 rounded-full hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 text-orange-600" />
        </InlineButton>
        <div className="w-12 text-center">
          <span className="text-xl font-bold text-gray-900">{guests}</span>
        </div>
        <InlineButton
          variant="outline"
          size="sm"
          onClick={onIncrement}
          disabled={guests >= maxGuests}
          className="w-10 h-10 p-0 transition-all duration-200 border-2 border-orange-200 rounded-full hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 text-orange-600" />
        </InlineButton>
      </div>
    </div>
  );
};

export default GuestSelector;