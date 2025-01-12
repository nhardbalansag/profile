import React from 'react'

function CardRightImage({image, rightImage = false, iscenter = false, title = "test", textColor = '#0C0C0C'}) {

  return (
    <div
     style={{
        backgroundImage: `url(${image})`, 
        backgroundRepeat:'no-repeat',
    }}
    className={`
        bg-[#FFFFFF] 
        ${iscenter ? 'hidden sm:block' : 'block'}
        lg:display
        drop-shadow-lg 
        bg-cover 
        lg:h-[599px]  
        w-[323px]
        h-[350px]
        ${iscenter 
            ? 'rounded-[50px] lg:w-[591px] mx-5' 
            : (rightImage ? 'rounded-ss-[50px] rounded-es-[50px] lg:w-[703px] flex justify-start' : 'rounded-se-[50px] rounded-ee-[50px] lg:w-[703px] flex justify-end')
        } 
    `}>
        <div className={`
            grid 
            place-content-center 
            p-5
            lg:h-[${iscenter ? '300px' : '599px'}] 
            lg:w-[${iscenter ? 'full' : '350px'}]`
        }>
            <div className='flex-col items-center justify-center px-2 text-center'>
                <h3 className={`text-5xl font-normal text-[${textColor}] lg:text-[64px] capitalize`}>
                {title}
                </h3>
                <p className={`text-[${textColor}] lg:text-[20px] font-thin`}>
                    afasdfasfasdf sdfd
                </p>
            </div>
        </div>
    </div>
  )
}

export default CardRightImage