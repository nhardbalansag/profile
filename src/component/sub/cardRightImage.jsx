import React from 'react'

function CardRightImage({image, title = "test", step = 'step test', subtext = "sub", textColor = '#0C0C0C'}) {

  return (
    <div
    className={`
        bg-[#FFFFFF] 
        drop-shadow-lg 
        bg-cover 
        p-5
        rounded-[20px] 
        m-5
    `}>
        <div className='grid grid-cols-2 place-content-center'>
            <div className='px-2 text-center place-content-center'>
                <h3 className={`font-extrabold text-[#e11818e6] text-16 lg:text-[64px] capitalize`}>
                {step}
                </h3>
                <h4 className={`font-medium text-[${textColor}] text-16 lg:text-[64px] capitalize`}>
                {title}
                </h4>
                <p className={`text-[${textColor}] md:text-[30px] font-thin`}>
                    {subtext}
                </p>
            </div>
            <div className=' place-content-center'>
                <img src={image} alt="Reporting Tool" className="w-64 h-auto" />
            </div>
        </div>
    </div>
  )
}

export default CardRightImage