import React from 'react'

import {
  iowobg,
  getstarted,
  redsigningoogle,
  roleselection,
  selectgoogleaccount,
  setup,
  successgooglesignin,
  accountsetting,

  reportdrawer,
  reportform,
  reportinglist,
  donemonthreports,
  activitiestop,
  activitiesbottom,
  totalreporttosend,
  doneqrreport,
  tofinalize,
  finalizealert,
  saveFilesalert,
  tofinish,
  alertcheckinternet,
  nogoogleaccount,
  allset,
  getstartednew
} from '../../assets/images/IOWOReport/index'

import {
  CardRightImage,
  Divider
} from '../../component/index'

const Content = () =>{
  return (
    <div>
      <div className='flex justify-center my-5'>
        <a href="/profile/iowo.apk" download>
          <button className="px-4 py-2 font-semibold text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600">
            Download Now
          </button>
        </a>
      </div>
      <Divider text='User Manual'/>
      <div className='my-5 text-center'>
        <h3 className={`font-semibold text-[black] text-[32px] capitalize`}>
        Setup guide
        </h3>
      </div>
      <div className='grid-cols-2 my-10 md:grid'>
          <CardRightImage step='Step 1.' subtext='click get started button to continue' title={'GET STARTED'} image={getstartednew}/>
          <CardRightImage step='Step 2.' subtext='click a role AS PASTOR to continue' title={'ROLE SELECTION'} image={roleselection}/>
          <CardRightImage step='Step 3.' subtext='Fill in the Name, Address, and Church fields completely, then click "Save" to continue or "Cancel" to exit without saving.' title={'SETUP INFO'} image={setup}/>
          <CardRightImage step='Step 4.' subtext='On the sidebar, select "Account Settings", then find and click on "Sign in with Google" to proceed.' title={'ACCOUNT SETTING'} image={accountsetting}/>
          <CardRightImage step='Step 5.' subtext='Select the Google account you want to associate with your report to proceed.' title={'Google Account Signup'} image={selectgoogleaccount}/>
          <CardRightImage step='Step 6.' subtext='A red "Sign in with Google" status indicates that you are not yet logged in with Google.' title={'GOOGLE LOGIN STATUS'} image={redsigningoogle}/>
          <CardRightImage step='DONE' subtext='A green "Switch Google Account" status indicates that you are already logged in to Google; select this option if you want to change the email address you are using.' title={'GOOGLE LOGIN STATUS'} image={successgooglesignin}/>
      </div>
      <Divider text='User Manual'/>
      <div className='my-5 text-center'>
        <h3 className={`font-semibold text-[black] text-[32px] capitalize`}>
        Report Guide
        </h3>
      </div>
      <div className='grid-cols-2 my-10 md:grid'>
          <CardRightImage step='Step 1.' subtext='Open the sidebar and select "New Report" to create a new report.' title={'Report Sidebar'} image={reportdrawer}/>
          <CardRightImage step='Step 2.' subtext='Listed dates are all Sundays of the current month. Red-colored dates mean no reports have been submitted yet. Select a date to create a report, and ensure all fields are filled to proceed with submission.' title={'WEEK REPORT LIST'} image={reportinglist}/>
          <CardRightImage step='Step 3.' subtext='Fill in attendance and collection details, review the total amount, then tap "Save Report" to submit or "Cancel" to exit.' title={'WEEK REPORT FORM'} image={reportform}/>
          <CardRightImage step='Step 4.' subtext='Complete reports for all Sundays of the month to enable "Other Activities".' title={'OTHER ACTIVITIES'} image={donemonthreports}/>
          <CardRightImage step='Step 5.1' subtext='Fill in all fields for the Whole Month Activities form, then tap "Save Report" to submit or "Cancel" to exit.' title={'OTHER ACTIVITIES FORM'} image={activitiestop}/>
          <CardRightImage step='Step 5.2' subtext='Fill in all fields for the Whole Month Activities form, then tap "Save Report" to submit or "Cancel" to exit.' title={'ACTIVITY FIELD'} image={activitiesbottom}/>
          <CardRightImage step='Step 6.' subtext='Review the total amount to send, then tap "Next" to proceed.' title={'TOTAL AMOUNT SCREEN'} image={totalreporttosend}/>
          <CardRightImage step='Step 7.' subtext='Scan or save the generated QR code for your monthly report by  clicking "Finalize"' title={'REPORT FINALIZATION'} image={tofinalize}/>
          <CardRightImage step='Step 8.' subtext='Select "Okay" to generate the PDF and QR code report.' title={'ALERT NOTICE FOR FINALIZATIONS'} image={finalizealert}/>
          <CardRightImage step='Step 9.' subtext='Share your report as a PDF or QR code via Messenger, then tap "Finish" to complete the process.' title={'REPORT RESULTS'} image={tofinish}/>
          <CardRightImage step='Step 10.' subtext='Ensure you have a stable internet connection before proceeding. Tap "OKAY" to continue or "CANCEL" to stop.' title={'ALERT NOTICE FOR FINISHING REPORT'} image={alertcheckinternet}/>
          <CardRightImage step='Step 11.' subtext='Your report has been successfully recorded. You may save or share the QR code for future reference.' title={'FINISHING STATUS'} image={doneqrreport}/>
          <CardRightImage step='DONE' subtext='All reports for this month are complete. No pending actions required.' title={'CURRRENT MONTH REPORT STATUS'} image={allset}/>
      </div>
    </div>
  )
}

export default Content