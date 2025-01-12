import React from 'react'

function InlineContentSingleImage({image, title, subtext, textColor = 'white', }) {
  return (
    <div className="flex flex-col justify-center md:flex-row">
        <div className="flex-col items-center justify-center text-center place-content-center lg:w-1/2">
            <h1 className={`text-5xl font-bold text-[${textColor}] md:text-[100px] text-[40px] capitalize`}>
            {title}
            </h1>
            <p className={`text-[${textColor}] font-light md:text-[24px] text-[16px]`}>
            {subtext}
            </p>
        </div>

        {
            image &&
            <div className="flex justify-center lg:w-1/2">
              <img
                className="md:w-[384px] md:h-[545px]"
                src={image}
                alt="dashboard thumbnail"
                />
            </div>
        }
    </div>
  )
}

export default InlineContentSingleImage