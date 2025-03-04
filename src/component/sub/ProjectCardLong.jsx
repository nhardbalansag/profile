import React from 'react'

function ProjectCardLong({imageSrc = "", link = '#project'}) {
  return (
    <a href={link} className="transition-all duration-500 lg:col-span-2 hover:scale-105">
        <img
        className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
        src={imageSrc}
        alt="project"
        />
    </a>
  )
}

export default ProjectCardLong