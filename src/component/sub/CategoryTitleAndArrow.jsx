import React from 'react'

import {
  CircledArrowRight
} from '../../assets/icons/index'

import { Link } from "react-router-dom";

const test= "fontWeight:\"bold\""

function CategoryTitleAndArrow({title, path, redirect_title = "explore", has_path = false, title_style, redirect_style}) {
  return (
    <Link to={path}>
      <div className='flex items-center justify-between px-5'>
          <p style={ title_style && JSON.parse( `{${title_style}}`)}>{title}</p>
          {
            has_path &&
            <button className='flex items-center justify-center'>
              <p style={redirect_style && JSON.parse(`{${redirect_style}}`)}>{redirect_title}</p>
            </button>
          }
      </div>
    </Link>
  )
}

export default CategoryTitleAndArrow


