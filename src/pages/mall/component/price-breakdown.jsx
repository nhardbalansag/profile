import React from 'react';
import { InlineSeparator } from '../ui/inline-separator';

interface PriceBreakdownProps {
  basePrice: number;
  appliedTPoints: number;
  totalPrice: number;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  appliedTPoints,
  totalPrice
}) => {
  return (
    <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
      <div className="flex justify-between text-base">
        <span className="text-gray-700">Base Price</span>
        <span className="font-semibold text-gray-900">${basePrice}</span>
      </div>
      <div className="flex justify-between text-base text-red-600">
        <span>Applied T-Points</span>
        <span className="font-semibold">-${appliedTPoints}</span>
      </div>
      <InlineSeparator />
      <div className="flex justify-between text-xl font-bold">
        <span className="text-gray-900">Total Price</span>
        <span className="text-green-600">${totalPrice}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
