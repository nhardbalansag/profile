import React from 'react'

import {
    Card,
    ProjectCardShort,
    ProjectCardLong,
    Phone,
    Divider,
    InlineContentSingleImage,
    CardRightImage
} from '../component/index'

import {
    Header,
    Footer
  } from "../component/index"

import {
    exquizseat1,
    exquizseat2,
    exquizseat3,
    exquizseat4,
    exquizseat5,
    exquizseat6,
    exquizseat7,
    exquizseat8,
    exquizseat9,
    exquizseat10,
    exquizbg1,
    exquizbody1,
    exquizbody2,
    exquizbody3
} from '../assets/images/Exquizseat/index'

import exQuizseat from '../assets/images/Exquizseat.png'

const ProjectHighlight = () => {

    return (
        <div
        className='bg-[#F9F7F8]'
        style={{
            background: `
            linear-gradient(rgba(255,255,255, .9), 
            rgba(255,255,255, .9)), 
            url(${exquizbg1})`,
            
            backgroundRepeat:"repeat",
            position: 'absolute',
            backgroundSize:'50%',
            width:'100%',
        }}>
            <div className="py-8 mx-auto">
                <InlineContentSingleImage 
                image={exquizseat1} 
                title={"title"} 
                subtext={"this is a subtext"}
                textColor={'#0C0C0C'}
                />
                <div>
                    <div className='flex justify-end my-10 md:flex-row'>
                        <CardRightImage image={exquizbody3} iscenter={true}/>
                        <CardRightImage image={exquizbody1} rightImage={true}/>
                    </div>
                    <div className='flex justify-start my-10 md:flex-row'>
                        <CardRightImage image={exquizbody2} />
                        <CardRightImage image={exquizbody3} iscenter={true}/>
                    </div>
                    <div className='flex justify-end my-10 md:flex-row'>
                        <CardRightImage image={exquizbody3} iscenter={true}/>
                        <CardRightImage image={exquizbody1} rightImage={true}/>
                    </div>
                </div>
            </div>
            <div>
                <div
                className="bg-cover h-[180px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full"
                style={{
                    backgroundImage: `url(${exQuizseat})`,
                    backgroundRepeat:'no-repeat',
                }}>
                <div className="hero-overlay bg-opacity-60"></div>
               
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ProjectHighlight