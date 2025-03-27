import React from 'react'

import Logo2 from '../../assets/images/ten/logo2.png'

function BottomCreateAccountFloat({noThanks}) {
  return (
    <div className="fixed bottom-10 w-[75%] max-w-sm p-4 bg-white shadow-lg rounded-xl z-50">
        <div className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                <img
                className="w-[60px] md:w-[100px]"
                alt="Tailwind CSS chat bubble component"
                src={Logo2} />
            </div>
            {/* Text Content */}
            <div className="flex-1">
                <p className="text-sm font-semibold">Earn more points</p>
                <p className="text-xs text-gray-600">
                    Members could save time and money finding great deals.
                </p>
            </div>
        </div>

        {/* Button */}
        <div className="mt-4">
            <button className="w-full py-2 text-sm font-semibold border rounded-lg bg-[#063970]">
                <p className='text-white'>Create account</p>
            </button>
            <button onClick={noThanks} className="w-full py-2 text-sm ">
            No, Thanks
            </button>
        </div>
    </div>
  )
}

export default BottomCreateAccountFloat