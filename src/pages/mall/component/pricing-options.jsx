import React, { useState } from 'react';
import PricingModal from './pricing/PricingModal';

const PricingOptions = () => {
  const [guests, setGuests] = useState(2);
  const [redeemFullPoints, setRedeemFullPoints] = useState(false);
  const [tPointsAmount, setTPointsAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const maxGuests = 4;
  const basePrice = 2000;
  const roomPrice = 1000;
  const availableTPoints = 50;
  const walletTPoints = 0;
  
  const appliedTPoints = redeemFullPoints ? Math.min(availableTPoints, basePrice) : tPointsAmount;
  const totalPrice = basePrice - appliedTPoints;

  const incrementGuests = () => {
    if (guests < maxGuests) setGuests(guests + 1);
  };

  const decrementGuests = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  const incrementTPoints = () => {
    if (tPointsAmount < availableTPoints && tPointsAmount < basePrice) {
      setTPointsAmount(tPointsAmount + 1);
    }
  };

  const decrementTPoints = () => {
    if (tPointsAmount > 0) setTPointsAmount(tPointsAmount - 1);
  };

  return (
    <PricingModal
      isVisible={isVisible}
      guests={guests}
      maxGuests={maxGuests}
      roomPrice={roomPrice}
      basePrice={basePrice}
      availableTPoints={availableTPoints}
      walletTPoints={walletTPoints}
      redeemFullPoints={redeemFullPoints}
      tPointsAmount={tPointsAmount}
      appliedTPoints={appliedTPoints}
      totalPrice={totalPrice}
      onClose={() => setIsVisible(false)}
      onIncrementGuests={incrementGuests}
      onDecrementGuests={decrementGuests}
      onRedeemFullToggle={setRedeemFullPoints}
      onIncrementTPoints={incrementTPoints}
      onDecrementTPoints={decrementTPoints}
      onTPointsAmountChange={setTPointsAmount}
    />
  );
};

export default PricingOptions;
