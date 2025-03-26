import React from 'react'

import {
    Search,
    Calendar,
} from '../../assets/icons/index'

function SearchFilterBar() {
  return (
    <div className='flex justify-center my-5 '>
        <div className='lg:flex lg:justify-center lg:items-center w-[75%] p-2 rounded-lg shadow-lg bg-white'>
            <div  className="flex items-center mx-2 my-1">
                <Search classes={'text-black mr-3'}/>
                <input type="text" placeholder="Where to?"  className='placeholder-black border-gray-400 input w-full lg:w-[150px]'/>
            </div>
            <div className="mx-2 lg:w-[240px]  my-1">
                <div className='flex items-center justify-between lg:justify-start'>
                    <div className='flex items-start lg:justify-end '>
                        <Calendar classes={'text-black mr-3'}/>
                        <p className='mr-2 text-black'>From</p>
                    </div>
                    <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="mx-2 lg:w-[240px]  my-1">
                <div className='flex items-center justify-between lg:justify-start'>
                    <div className='flex items-start lg:justify-end'>
                        <Calendar classes={'text-black mr-3'}/>
                        <p className='mr-2 text-black'>To</p>
                    </div>
                    <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="mx-2 my-3">
                <button className='rounded bg-[#2596be] w-full text-white py-3 px-5 font-bold'>
                Search
                </button>
            </div>
        </div>
    </div>
  )
}

export default SearchFilterBar