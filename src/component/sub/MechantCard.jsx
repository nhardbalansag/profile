import React from 'react'

function MechantCard({classes, width = "300px", image}) {
  return (
    <div className={`lg:flex lg:justify-center lg:items-center w-[${width}] p-2 m-3 rounded-lg shadow-lg ${classes} bg-white`}>
        <div>
            <div className=" bg-base-100">
                <figure>
                    <img
                    className={`w-[${width}] rounded-lg`}
                    alt="Tailwind CSS chat bubble component"
                    src={image} />
                </figure>
                <div className="p-2">
                    <p className="font-bold text-[15px]">Merchant Title</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MechantCard