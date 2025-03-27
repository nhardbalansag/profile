import React from 'react'

function PricingCard({
    accommodationType = "twin sharing",
    offerTitle = "early bird",
    membershipType = "regular",
    guestCount = 2,
    currencySymbol = "$",
    amount = 1088,
    hasTP = false,
    pointsAmount = 100,
}) {
    return (
        <div className="p-6 my-2 text-center bg-white border rounded-lg shadow-lg">
            <h3 className="gap-2 text-xl font-bold capitalize">
            {offerTitle}
            </h3>
            <p className='font-thin text-[16px] capitalize'>{accommodationType}</p>
            <p className="text-gray-500">{guestCount} Guests Per Room</p>
            <p className="my-3 text-3xl font-bold text-blue-600">{currencySymbol}{amount}</p>
            <p className="text-sm text-gray-400">{ hasTP ? "Redeem " + pointsAmount : "TP not applicable"}</p>
        </div>
    )
}

export default PricingCard