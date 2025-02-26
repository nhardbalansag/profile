import React from 'react'

import {
  ProjectWrapper
} from '../../component/index'

import {
    Outlet,
} from "react-router-dom";

import {
  iowobg,
  wall
} from '../../assets/images/IOWOReport/index'

const IOWOReportIndex = () =>{
  return (
    <ProjectWrapper frontImage={wall} bgImage={iowobg} title={"IOWO REPORTING TOOL"} subtitle={"version 2.2.1"}>
      <Outlet />
    </ProjectWrapper>
  )
}

export default IOWOReportIndex