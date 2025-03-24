import React, { useState } from 'react';

import {
  Card,
  ProjectCardShort,
  ProjectCardLong,
  Phone,
  Divider
} from '../component/index'

import {
  Tool1,
  Checked,
  Phone as PhoneIcon
} from '../assets/icons/index'

import EmptyImage  from  '../assets/images/glorijan/empty.jpg'
import Logo5  from  '../assets/images/glorijan/logo5.jpg'

import glorijan1 from '../assets/images/glorijan/products/glorijan1.jpg'
import glorijan2 from '../assets/images/glorijan/products/glorijan2.jpg'
import glorijan3 from '../assets/images/glorijan/products/glorijan3.jpg'
import glorijan4 from '../assets/images/glorijan/products/glorijan4.jpg'
import glorijan5 from '../assets/images/glorijan/products/glorijan5.jpg'
import glorijan6 from '../assets/images/glorijan/products/glorijan6.jpg'
import glorijan7 from '../assets/images/glorijan/products/glorijan7.jpg'
import glorijan8 from '../assets/images/glorijan/products/glorijan8.jpg'
import glorijan9 from '../assets/images/glorijan/products/glorijan9.jpg'
import glorijan10 from '../assets/images/glorijan/products/glorijan10.jpg'
import glorijan11 from '../assets/images/glorijan/products/glorijan11.jpg'
import glorijan12 from '../assets/images/glorijan/products/glorijan12.jpg'
import glorijan13 from '../assets/images/glorijan/products/glorijan13.jpg'
import glorijan14 from '../assets/images/glorijan/products/glorijan14.jpg'

const ClientData = [
  {
    "companyName": "A.M Oreta & Co., Inc.",
    "address": "No. 397 M. H Del Pilar St., Brgy Maysilo, Malabon City Extension Office: 8th Floor, 88 Corporate Center, 141 Valero St., Salcedo Village, Makati City",
    "contactPerson": "Ms. Maria Lina Reyes",
    "contactNo": "0917-831-1523"
  },
  {
    "companyName": "Asiawide Land Specialist Development Corp. / Asiawide Land Master Inc. / Asiana Homes",
    "address": "San Pedro Hermosa Bataan",
    "contactPerson": "Jackielyn Deleon, Rachelle Quevedo",
    "contactNo": "0928-976-8350, 0931-897-8268"
  },
  {
    "companyName": "Centrifugal Machinery & Services, Inc.",
    "address": "U911 Civic Place 2301 Civic Drive Filinvest Corporate City Alabang, Muntinlupa City 1781",
    "contactPerson": "Mr. Aries Rodriguez",
    "contactNo": "02-8877-6328, 0945-7523-085"
  },
  {
    "companyName": "CG Integra Corp.",
    "address": "Unit 705 Page 1 Building Acasia Ave, Madrigal Business Park, Ayala Alabang, Muntinlupa, 1799 Metro Manila",
    "contactPerson": "Mr. Bernard Garcia",
    "contactNo": "0917-532-4474"
  },
  {
    "companyName": "Coolaire Consolidated, Inc.",
    "address": "10 Basa, Quezon City 1105 Metro Manila",
    "contactPerson": "Gemma, Cora Bello, Jessica",
    "contactNo": "09179908151, 02-8372-8879"
  },
  {
    "companyName": "Greserr Const. and Builders Inc.",
    "address": "2/F Security Bank Building, Commonwealth Avenue, Quezon City",
    "contactPerson": "Ms. Je-ann, Ms. Desiree",
    "contactNo": "0949-884-5309, 0942-027-3987"
  },
  {
    "companyName": "Lasaya RCA Builders Inc.",
    "address": "Amparo Subd., Caloocan City",
    "contactPerson": "Ms. Donah Avila",
    "contactNo": "0905-208-0682"
  },
  {
    "companyName": "Mc Bride Corporation",
    "address": "#40 Circumferential road Araneta Village, Potrero, Malabon, 1475",
    "contactPerson": "Ms. Angelica Castro",
    "contactNo": "0922-857-0491"
  },
  {
    "companyName": "Metriccon Co. Inc.",
    "address": "2D 2/F Enriqueta Bldg, 422 NS Amoranto Cor. Tuazon Street, Quezon City",
    "contactPerson": "Ms. Khem Tanglao",
    "contactNo": "0907-260-1363"
  },
  {
    "companyName": "Mig System, Inc.",
    "address": "316 MC Arthur highway, Valenzuela City",
    "contactPerson": "Ms. Joy Calaro",
    "contactNo": "0918-539-8526"
  },
  {
    "companyName": "Mie Oro Plast Corp.",
    "address": "MC Arthur highway, Valenzuela City",
    "contactPerson": "Ms. Annie Besmonte",
    "contactNo": "0921-682-3654"
  },
  {
    "companyName": "Makati Foundry, Inc.",
    "address": "Sultana St., Corner Constancia St., Makati City",
    "contactPerson": "Ms. Merriam / Jennifer",
    "contactNo": "0995-580-6012"
  },
  {
    "companyName": "Northern Builders",
    "address": "KM 131, Carlos P. Romulo Highway Baras-Baras Tarlac City",
    "contactPerson": "Mark Tolentino",
    "contactNo": "0995-156-0447"
  },
  {
    "companyName": "Paravisible Builders Inc.",
    "address": "32 Bergen St. North Fairview Park Subdivision Quezon City",
    "contactPerson": "Ms. Lyn / Mr. Ryan",
    "contactNo": "0919-005-7652, 0961-839-4657"
  },
  {
    "companyName": "South Constructech, Inc.",
    "address": "#9085 Pulong Gubat, Balagtas, Bulacan",
    "contactPerson": "Mr. Daniel Natividad",
    "contactNo": "0951-824-8061"
  },
  {
    "companyName": "WRLD Capital Holdings, Inc.",
    "address": "Hermosa Bataan",
    "contactPerson": "Rachelle Quevedo",
    "contactNo": "0931-897-8268"
  },
  {
    "companyName": "Zian Enterprises",
    "address": "San Roque Virac Catanduanes",
    "contactPerson": "Ms. Shana Rose R. Razon",
    "contactNo": "0963-446-0683"
  }
]


const HomeContent = () =>{

  return (
    <div>
      <main>
        <section>
          <div className="relative grid w-full bg-[#FF4E03] h-96 lg:h-[32rem] place-items-center">
            <div className="flex flex-col items-center mx-auto text-center">
              <p className="mt-6 text-lg leading-5 text-[white]">See more details</p>
              <a href="#about" className="mt-8 cursor-pointer animate-bounce">
                <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="27" cy="26" r="18" stroke="white" strokeWidth="2" />
                  <path d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z" fill="white" />
                </svg>
              </a>
              <Phone/>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto pt-[400px] sm:pt-[400px] lg:pt-[250px] md:pt-[400px] lg:py-16" id="about">
          <Divider text='ABOUT US'/>
          <div className="lg:flex lg:items-center sm:flex sm:items-center lg:-mx-4 ">
            <div className="text-center lg:w-1/2 lg:px-4 sm:w-1/2">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
              BUSINESS OVERVIEW
              </h3>

              <p className="mt-6 text-gray-500 md:text-[20px] text-[18px]">
              Glorijan Construction and Supply (GCS) began its journey as a single proprietorship on October 29, 2015, officially establishing its operations on January 18, 2018. Initially operating as a traditional hardware store, GCS catered primarily to walk-in customers, offering a wide array of construction materials and supplies. Over time, the company demonstrated adaptability and foresight, evolving to meet the growing demands of its clients.
              </p>
            </div>
            <div className="w-full px-4 mt-8 sm:w-1/2 lg:w-1/2 lg:px-4 lg:mt-0">
              <img
                className="object-cover w-full rounded-xl h-100 lg:h-100"
                src={EmptyImage}
                alt="dashboard thumbnail"
              />
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <div className="text-center">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
              Expansion and Growth
              </h3>

              <p className="mt-6 text-gray-500 md:text-[20px] text-[18px]">
              Just a year after its establishment, GCS expanded its operations into trading, showcasing its commitment to addressing its customers’ diverse needs. Recognizing the rising demand for specialized materials and client-specific requirements, the company is also actively planning to venture into importing goods, aiming to provide even greater value to its clients.
              </p>
            </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <div className="lg:flex lg:items-center sm:flex sm:items-center lg:-mx-4 ">
            <div className="text-center lg:w-1/2 lg:px-4 sm:w-1/2">
              <p className="text-xl font-medium text-gray-800 md:text-2xl lg:text-[30px]">
              Core Values and Services
              </p>

              <p className="mt-6 text-gray-500 md:text-[25px] text-[18px]">
              At GCS, customer satisfaction is a cornerstone of its operations. The company prides itself on going beyond expectations by delivering:
              </p>
            </div>
            <div className="grid w-full grid-cols-1 px-4 mt-8 place-content-center sm:w-1/2 md:w-1/2 lg:w-1/2 lg:px-4 lg:mt-0">
              <div className="m-5 indicator">
                <span className="py-5 bg-[#00ff00] indicator-item badge">
                  <Checked/>
                </span>
                <div className="grid bg-[#001d3d] place-items-center py-10 px-5 rounded-xl  w-[300px]">
                  <p className='font-semibold text-white text-[25px] text-center'>Fast and reliable services</p>
                </div>
              </div>

              <div className="m-5 indicator">
                <span className="py-5 bg-[#00ff00] indicator-item badge">
                  <Checked/>
                </span>
                <div className="grid bg-[#001d3d] place-items-center py-10 px-5 rounded-xl w-[300px]">
                  <p className='font-semibold text-white text-[25px] text-center'>Cost-efficient solutions</p>
                </div>
              </div>

              <div className="m-5 indicator">
                <span className="py-5 bg-[#00ff00] indicator-item badge">
                  <Checked/>
                </span>
                <div className="grid bg-[#001d3d] place-items-center py-10 px-5 rounded-xl w-[300px]">
                  <p className='font-semibold text-white text-[25px] text-center'>A wide variety of high-quality materials tailored to project requirements</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <div className="text-center">
            <p className=" text-gray-500 md:text-[20px] text-[18px]">
            GCS positions itself not just as a supplier but as a reliable partner, ensuring every project receives the best possible resources to succeed.
            </p>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
            Commitment to Clients
            </h3>

            <p className="mt-6 text-gray-500 md:text-[20px] text-[18px]">
            Glorijan Construction and Supply warmly welcomes potential customers and partners to reach out for inquiries or consultations. With a strong foundation of <strong>technical knowledge</strong> and <strong>professional experience</strong>, GCS strives to become a trusted partner in achieving your business goals. The company remains committed to fostering long-term relationships built on reliability, quality, and customer-centric solutions.
            </p>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-8">
          <Divider  text='What We Do?'/>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
            <Card icon={<Tool1/>} cardTitle='TITLE 1' sub='descriptions here'/>
            <Card icon={<Tool1/>} cardTitle='TITLE 2' sub='descriptions here'/>
            <Card icon={<Tool1/>} carddescriptions='TITLE 3' sub='descriptions here'/>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <Divider text='OUR MISSION & VISION'/>
          <div className="lg:flex lg:items-center sm:flex sm:items-center lg:-mx-4 ">
            <div className="text-center lg:w-1/2 lg:px-4 sm:w-1/2">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
              Mission
              </h3>

              <p className="mt-6 text-gray-500 md:text-[20px] text-[18px]">
              At <strong>Glorijan Construction and Supply (GCS)</strong>, our mission is to provide high-quality, cost-efficient, and reliable construction materials and services that exceed customer expectations. We are committed to delivering fast, innovative, and customer-focused solutions that empower our clients to successfully complete their projects. Through integrity, dedication, and professionalism, we aim to be a trusted partner in the construction and supply industry.
              </p>
            </div>

            <div className="w-full px-4 mt-8 text-center sm:w-1/2 lg:w-1/2 lg:px-4 lg:mt-0">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
              Vision
              </h3>

              <p className="mt-6 text-gray-500 md:text-[20px] text-[18px]">
              Our vision is to become a leading and trusted name in the construction and supply sector, known for delivering excellence in products and services. We aspire to expand our reach through strategic growth, including trading and importing high-quality goods, to better serve our customers’ evolving needs. By fostering strong partnerships and leveraging technical expertise, we aim to contribute to the success of our clients and establish ourselves as a benchmark for quality and reliability in the industry.
              </p>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-8">
          <Divider  text='ORGANIZATION'/>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
            <div className='text-center'>
              <p className='font-semibold text-[#001d3d] text-[25px]'>Engr. Johnas J. Lungay</p>
              <p className='font-semibold text-[#FF4E03]'>President/Owner</p>
            </div>
            <div className='text-center'>
              <p className='font-semibold text-[#001d3d] text-[25px]'>Engr. Johnas J. Lungay</p>
              <p className='font-semibold text-[#FF4E03]'>Operation, Sales & Marketing</p>
            </div>
            <div className='text-center '>
              <p className='font-semibold text-[#001d3d] text-[25px]'>Janice R. Lungay</p>
              <p className='font-semibold text-[#FF4E03]'>Finance & Treasurer</p>
            </div>
            <div className='text-center '>
              <p className='font-semibold text-[#001d3d] text-[25px]'>Donamae G. Lungay</p>
              <p className='font-semibold text-[#FF4E03]'>Warehouse & Distribution</p>
            </div>
            <div className='text-center '>
              <p className='font-semibold text-[#001d3d] text-[25px]'>Ernesto C. Regalado</p>
              <p className='font-semibold text-[#FF4E03]'>Warehouse & Distribution</p>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-8">
        <Divider/>
          <h2 className="text-2xl font-bold text-center text-gray-800">Permits and Licenses</h2>
          <h3 className="mt-2 text-lg font-semibold text-center text-gray-600">Single Proprietorship Details</h3>

          <div className="mt-4">
              <table className="w-full border border-collapse border-gray-300">
                  <tbody>
                      <tr className="bg-gray-200">
                          <th className="p-3 font-semibold text-left">Department of Trade and Industry</th>
                          <td className="p-3"></td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Certificate Number</td>
                          <td className="p-3 font-medium border-b">05109665</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Validity</td>
                          <td className="p-3 font-medium border-b">August 29, 2023 to 2028</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Date Issued</td>
                          <td className="p-3 font-medium border-b">July 17, 2023</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">DTI Business Scope</td>
                          <td className="p-3 font-medium border-b">National</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="mt-4">
              <table className="w-full border border-collapse border-gray-300">
                  <tbody>
                  <tr className="bg-gray-200">
                          <th className="p-3 font-semibold text-left">Business Permits and Licensing Office</th>
                          <td className="p-3"></td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Business Identification Number</td>
                          <td className="p-3 font-medium border-b">15-N-0710-01139</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Expiration Date</td>
                          <td className="p-3 font-medium border-b">December 31, 2024</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Place of Issue</td>
                          <td className="p-3 font-medium border-b">Caloocan City</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Issuance Date</td>
                          <td className="p-3 font-medium border-b">January 7, 2024</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="mt-4">
              <table className="w-full border border-collapse border-gray-300">
                  <tbody>
                      <tr className="bg-gray-200">
                          <th className="p-3 font-semibold text-left">Certificate of Registration</th>
                          <td className="p-3"></td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Registration Date</td>
                          <td className="p-3 font-medium border-b">October 29, 2015</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">TIN Issuance Date</td>
                          <td className="p-3 font-medium border-b">November 4, 1998</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">TIN & Branch Code</td>
                          <td className="p-3 font-medium border-b">201-300-329-00000</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">OCN</td>
                          <td className="p-3 font-medium border-b">027RC20230000000851</td>
                      </tr>
                      <tr>
                          <td className="p-3 border-b">Date OCN Generated</td>
                          <td className="p-3 font-medium border-b">February 3, 2023</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-8">
          <Divider text='LOCATION'/>
          <div className='w-full text-center'>
            <h2 className="text-lg font-semibold text-[#0b0c0c] mb-2">Glorijan Construction & Supply</h2>
            <iframe
                className="w-full h-full rounded-md"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.8058816312672!2d121.0763147!3d14.7515487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b008076261b7%3A0x9736eccce44da5d1!2sGlorijan%20Construction%20%26%20Supply!5e0!3m2!1sen!2sph!4v1710888888888!5m2!1sen!2sph"
                loading="lazy"
            ></iframe>
          </div>
        </section>
     
        <section className="container px-6 py-8 mx-auto lg:py-16" id="projects">
          <Divider text='CLIENTS & PROJECTS'/>
         
          <div className="w-full carousel">
          {
            ClientData.map((item, id) =>
              <div key={id} id={id} className="relative w-full carousel-item">
                <div className='flex justify-center w-full'>
                  <div className="p-5 m-3 bg-white shadow-lg rounded-xl w-[65%] grid grid-cols-1 place-content-center">
                    <h2 className="text-lg font-bold text-gray-900">{item.companyName}</h2>
                    
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.address}</p>

                    <p className="mt-4 font-semibold text-gray-900">
                      Contact: 
                    </p>
                    <p className="font-bold text-black ">
                      {item.contactPerson}
                    </p>
                    <div className='grid grid-cols-1'>
                    {
                      item.contactNo.split(',').map((contactItem, contactIndex) =>
                        <button  key={contactIndex} className="w-[200px] py-2 text-sm font-semibold text-[#FF4E03] transition-all duration-200 bg-transparent ">
                          <div className='flex'>
                            <PhoneIcon size={5} classes={"mr-3"}/>
                            <a href={`tel:${contactItem}`}>
                            {contactItem}
                            </a>
                          </div>
                        </button>
                      )
                    }
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-0 right-0 flex justify-between transform -translate-y-1/2 top-1/2">
                  <a href={`#${id - 1}`} className="btn btn-circle bg-[#FF4E03] text-white">❮</a>
                  <a href={`#${id + 1}`} className="btn btn-circle bg-[#FF4E03] text-white">❯</a>
                </div>
              </div>
            )
          }
          </div>

          <Divider text='PRODUCTS'/>
          <div className=''>
            <div className="collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title">
                <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">DI Pipes and Fittings</h2>
                  <h3 className="mt-2 text-lg font-semibold text-center text-black">Water & Sewer Lines</h3>
                </div>
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan1}/>
                  <ProjectCardLong imageSrc={glorijan2}/>
                </div>
              </div>
            </div>
            <div className=" collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title ">
              <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">UPVC Pipes and Fittings </h2>
                  <h3 className="mt-2 text-lg font-semibold text-center text-black">Water & Sewer Lines</h3>
                </div>  
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan3}/>
                  <ProjectCardLong imageSrc={glorijan4}/>
                </div>
              </div>
            </div>
            <div className=" collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title ">
                <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">HDPE Pipes and Fittings </h2>
                  <h3 className="mt-2 text-lg font-semibold text-center text-black">Water & Sewer Lines</h3>
                </div>  
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan5}/>
                  <ProjectCardLong imageSrc={glorijan6}/>
                </div>
              </div>
            </div>
            <div className=" collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title ">
                <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">Galvanized & Black Iron Pipes and fittings</h2>
                </div>  
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan7}/>
                  <ProjectCardLong imageSrc={glorijan8}/>
                </div>
              </div>
            </div>
            <div className=" collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title ">
                <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">Spiral Steel Pipes and Fittings</h2>
                </div>  
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan9}/>
                  <ProjectCardLong imageSrc={glorijan10}/>
                </div>
              </div>
            </div>
            <div className=" collapse">
              <input type="checkbox" className="peer" />
              <div className="flex justify-center collapse-title ">
                <div className='py-5 px-3 bg-white shadow-lg rounded-xl w-[300px] md:w-[60%]'>
                  <h2 className="text-2xl font-bold text-center text-[#FF4E03] uppercase">Valves </h2>
                  <h3 className="mt-2 text-lg font-semibold text-center text-black">PRV, SAV, Gate, Butterfly, Ball, Globe, Float, Foot, & Knife</h3>
                </div>  
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCardShort imageSrc={glorijan11}/>
                  <ProjectCardLong imageSrc={glorijan12}/>
                  <ProjectCardShort imageSrc={glorijan13}/>
                  <ProjectCardLong imageSrc={glorijan14}/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div>
        <button
          className="fixed px-4 py-2 font-bold text-white rounded-full bottom-5 right-5 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          onClick={() => window.open('https://m.me/100381302855923', '_blank')}>
          <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full shadow-lg">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={Logo5} />
                    </div>
                </div>
              <div className="text-white bg-blue-700 shadow-lg chat-bubble">Chat Us On Messenger</div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default HomeContent