import React from 'react'

import {
    InlineContentSingleImage,
} from '../index'

import {
    exquizbg1,
    exquizseat1
} from '../../assets/images/Exquizseat/index'

function ProjectWrapper({
    children,
    title = "title",
    subtitle = "sub",
    bgImage = exquizbg1,
    frontImage = exquizseat1
}) {
  return (
    <div
    className='bg-[#F9F7F8]'
    style={{
        background: `
        linear-gradient(rgba(255,255,255, .9), 
        rgba(255,255,255, .9)), 
        url(${bgImage})`,
        
        backgroundRepeat:"repeat",
        position: 'absolute',
        backgroundSize:'50%',
        width:'100%',
    }}>
        <div className="py-8 mx-auto">
            <InlineContentSingleImage 
            image={frontImage} 
            title={title} 
            subtext={subtitle}
            textColor={'#0C0C0C'}
            />
            {children}
        </div>
    </div>
  )
}

export default ProjectWrapper