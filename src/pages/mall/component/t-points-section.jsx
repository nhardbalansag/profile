
import React from 'react';
import { Plus, Minus, Wallet, Info, CreditCard } from 'lucide-react';
import { InlineButton } from '../ui/inline-button';
import { InlineSwitch } from '../ui/inline-switch';

interface TPointsSectionProps {
  availableTPoints: number;
  walletTPoints: number;
  redeemFullPoints: boolean;
  tPointsAmount: number;
  onRedeemFullToggle: (checked: boolean) => void;
  onIncrementTPoints: () => void;
  onDecrementTPoints: () => void;
  onTPointsAmountChange: (value: number) => void;
}

const TPointsSection: React.FC<TPointsSectionProps> = ({
  availableTPoints,
  walletTPoints,
  redeemFullPoints,
  tPointsAmount,
  onRedeemFullToggle,
  onIncrementTPoints,
  onDecrementTPoints,
  onTPointsAmountChange
}) => {
  return (
    <>
      {/* T-Points Section */}
      <div className="p-5 space-y-4 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Wallet className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-orange-900">Redeem T-Points</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-orange-600">{availableTPoints}</span>
              <span className="text-xs text-orange-700">available</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 border border-orange-200 rounded-lg bg-white/50">
          <Info className="flex-shrink-0 w-4 h-4 text-orange-600" />
          <div className="text-sm">
            <span className="font-medium text-orange-800">1 T-Point = $1 USD</span>
            <span className="ml-2 text-orange-600">(${availableTPoints} USD total)</span>
          </div>
        </div>
        
        <p className="p-2 text-xs italic font-medium text-orange-700 rounded-lg bg-white/30">
          💡 Tip: Redeem your T-Points for instant discounts!
        </p>
      </div>

      {/* T-Points Wallet */}
      <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">My T-Points Wallet</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{walletTPoints}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Redeem Full T-Points Amount</span>
          <InlineSwitch
            checked={redeemFullPoints}
            onCheckedChange={(checked) => {
              onRedeemFullToggle(checked);
              if (checked) onTPointsAmountChange(0);
            }}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>

        {!redeemFullPoints && (
          <div className="space-y-4">
            <span className="text-sm font-semibold text-gray-900">T-Points Amount</span>
            <div className="flex items-center justify-between gap-4">
              <InlineButton
                variant="outline"
                size="sm"
                onClick={onDecrementTPoints}
                disabled={tPointsAmount <= 0}
                className="w-10 h-10 p-0 text-orange-600 transition-all duration-200 border-2 border-orange-200 rounded-full hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </InlineButton>
              <div className="flex-1">
                <input
                  type="number"
                  value={tPointsAmount}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(availableTPoints, parseInt(e.target.value) || 0));
                    onTPointsAmountChange(value);
                  }}
                  className="w-full px-4 py-3 text-lg font-bold text-center transition-all duration-200 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  max={availableTPoints}
                  min={0}
                />
              </div>
              <InlineButton
                variant="outline"
                size="sm"
                onClick={onIncrementTPoints}
                disabled={tPointsAmount >= availableTPoints}
                className="w-10 h-10 p-0 text-orange-600 transition-all duration-200 border-2 border-orange-200 rounded-full hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </InlineButton>
            </div>
            <div className="p-3 text-center bg-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">${tPointsAmount}</div>
              <div className="text-xs text-orange-600">USD equivalent</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TPointsSection;