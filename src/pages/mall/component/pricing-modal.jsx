import React from 'react';
import { X, Star, CheckCircle, MapPin, CreditCard } from 'lucide-react';
import { InlineCard, InlineCardHeader, InlineCardTitle, InlineCardContent } from '../ui/inline-card';
import { InlineBadge } from '../ui/inline-badge';
import { InlineButton } from '../ui/inline-button';
import { InlineSeparator } from '../ui/inline-separator';
import DateInfo from './DateInfo';
import GuestSelector from './GuestSelector';
import RoomDetails from './RoomDetails';
import TPointsSection from './TPointsSection';
import PriceBreakdown from './PriceBreakdown';

interface PricingModalProps {
  isVisible: boolean;
  guests: number;
  maxGuests: number;
  roomPrice: number;
  basePrice: number;
  availableTPoints: number;
  walletTPoints: number;
  redeemFullPoints: boolean;
  tPointsAmount: number;
  appliedTPoints: number;
  totalPrice: number;
  onClose: () => void;
  onIncrementGuests: () => void;
  onDecrementGuests: () => void;
  onRedeemFullToggle: (checked: boolean) => void;
  onIncrementTPoints: () => void;
  onDecrementTPoints: () => void;
  onTPointsAmountChange: (value: number) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isVisible,
  guests,
  maxGuests,
  roomPrice,
  basePrice,
  availableTPoints,
  walletTPoints,
  redeemFullPoints,
  tPointsAmount,
  appliedTPoints,
  totalPrice,
  onClose,
  onIncrementGuests,
  onDecrementGuests,
  onRedeemFullToggle,
  onIncrementTPoints,
  onDecrementTPoints,
  onTPointsAmountChange
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <InlineCard className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl animate-scale-in max-h-[95vh] overflow-y-auto rounded-2xl border-0">
        <InlineCardHeader className="relative pb-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <InlineCardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Star className="w-6 h-6 text-orange-500" />
              Pricing Options
            </InlineCardTitle>
            <InlineButton 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="w-8 h-8 p-0 transition-all duration-200 rounded-full hover:bg-white/50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </InlineButton>
          </div>
          
          <div className="mt-4 space-y-2">
            <InlineBadge className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              <CheckCircle className="w-4 h-4 mr-2" />
              EARLY BIRD VIP
            </InlineBadge>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>(Twin Sharing Room)</span>
            </div>
          </div>
        </InlineCardHeader>

        <InlineCardContent className="p-6 space-y-6">
          <DateInfo />

          <div className="space-y-4">
            <GuestSelector
              guests={guests}
              maxGuests={maxGuests}
              onIncrement={onIncrementGuests}
              onDecrement={onDecrementGuests}
            />
          </div>

          <RoomDetails guests={guests} roomPrice={roomPrice} />

          <TPointsSection
            availableTPoints={availableTPoints}
            walletTPoints={walletTPoints}
            redeemFullPoints={redeemFullPoints}
            tPointsAmount={tPointsAmount}
            onRedeemFullToggle={onRedeemFullToggle}
            onIncrementTPoints={onIncrementTPoints}
            onDecrementTPoints={onDecrementTPoints}
            onTPointsAmountChange={onTPointsAmountChange}
          />

          <InlineSeparator className="my-6" />

          <PriceBreakdown
            basePrice={basePrice}
            appliedTPoints={appliedTPoints}
            totalPrice={totalPrice}
          />

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <InlineButton 
              variant="outline" 
              className="flex-1 h-12 font-semibold transition-all duration-200 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              onClick={onClose}
            >
              Cancel
            </InlineButton>
            <InlineButton 
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Checkout
            </InlineButton>
          </div>
        </InlineCardContent>
      </InlineCard>
    </div>
  );
};

export default PricingModal;