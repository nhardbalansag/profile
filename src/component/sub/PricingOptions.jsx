
import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Minus, 
  Calendar, 
  Users, 
  Clock, 
  Wallet, 
  Info, 
  X,
  MapPin,
  Star,
  CreditCard,
  CheckCircle
} from 'lucide-react';

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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl animate-scale-in max-h-[95vh] overflow-y-auto rounded-2xl border-0">
        <div className="relative pb-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Star className="w-6 h-6 text-orange-500" />
              Pricing Options
            </div>
            <btn 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 p-0 transition-all duration-200 rounded-full hover:bg-white/50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </btn>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              <CheckCircle className="w-4 h-4 mr-2" />
              EARLY BIRD VIP
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>(Twin Sharing Room)</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date and Registration Info */}
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

          {/* Guest Selection */}
          <div className="space-y-4">
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
                <btn
                  variant="outline"
                  size="sm"
                  onClick={decrementGuests}
                  disabled={guests <= 1}
                  className="w-10 h-10 p-0 transition-all duration-200 border-2 border-orange-200 rounded-full hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4 text-orange-600" />
                </btn>
                <div className="w-12 text-center">
                  <span className="text-xl font-bold text-gray-900">{guests}</span>
                </div>
                <btn
                  variant="outline"
                  size="sm"
                  onClick={incrementGuests}
                  disabled={guests >= maxGuests}
                  className="w-10 h-10 p-0 transition-all duration-200 border-2 border-orange-200 rounded-full hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-orange-600" />
                </btn>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-4">
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
            </div>
          </div>

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

          <div className="my-6" />

          {/* Price Breakdown */}
          <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
            <div className="flex justify-between text-base">
              <span className="text-gray-700">Base Price</span>
              <span className="font-semibold text-gray-900">${basePrice}</span>
            </div>
            <div className="flex justify-between text-base text-red-600">
              <span>Applied T-Points</span>
              <span className="font-semibold">-${appliedTPoints}</span>
            </div>
            <div />
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-900">Total Price</span>
              <span className="text-green-600">${totalPrice}</span>
            </div>
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
              {/* <Switch
                checked={redeemFullPoints}
                onCheckedChange={(checked) => {
                  setRedeemFullPoints(checked);
                  if (checked) setTPointsAmount(0);
                }}
                className="data-[state=checked]:bg-orange-500"
              /> */}
                <input 
                    type="checkbox"
                    checked={redeemFullPoints}
                    onChange={(checked) => {
                    setRedeemFullPoints(checked);
                    if (checked) setTPointsAmount(0);
                    }}
                    className="data-[state=checked]:bg-orange-500 toggle toggle-md"
                 /> 
                    {/* <input 
                    type="checkbox" 
                    // checked={isRedeemFull} 
                    // onChange={handleRedeemFullTPoints} 
                    className="toggle toggle-sm" />  */}

            </div>

            {!redeemFullPoints && (
              <div className="space-y-4">
                <span className="text-sm font-semibold text-gray-900">T-Points Amount</span>
                <div className="flex items-center justify-between gap-4">
                  <btn
                    variant="outline"
                    size="sm"
                    onClick={decrementTPoints}
                    disabled={tPointsAmount <= 0}
                    className="w-10 h-10 p-0 text-orange-600 transition-all duration-200 border-2 border-orange-200 rounded-full hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </btn>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={tPointsAmount}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(availableTPoints, parseInt(e.target.value) || 0));
                        setTPointsAmount(value);
                      }}
                      className="w-full px-4 py-3 text-lg font-bold text-center transition-all duration-200 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      max={availableTPoints}
                      min={0}
                    />
                  </div>
                  <btn
                    variant="outline"
                    size="sm"
                    onClick={incrementTPoints}
                    disabled={tPointsAmount >= availableTPoints || tPointsAmount >= basePrice}
                    className="w-10 h-10 p-0 text-orange-600 transition-all duration-200 border-2 border-orange-200 rounded-full hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </btn>
                </div>
                <div className="p-3 text-center bg-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">${tPointsAmount}</div>
                  <div className="text-xs text-orange-600">USD equivalent</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <btn 
              variant="outline" 
              className="flex-1 h-12 font-semibold transition-all duration-200 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </btn>
            <btn 
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Checkout
            </btn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingOptions;
