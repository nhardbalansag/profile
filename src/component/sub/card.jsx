import React from 'react'

const Card = ({cardTitle = "test", sub = "test", icon}) => {
  return (
    <div className="p-8 space-y-3 border-2 border-indigo-400 rounded-xl">
        <span className="inline-block text-indigo-500">
            {icon}
        </span>

        <h1 className="text-2xl font-semibold text-gray-700 capitalize">{cardTitle}</h1>

        <p className="text-gray-500">
        {sub}
        </p>
    </div>
  )
}

export default Card