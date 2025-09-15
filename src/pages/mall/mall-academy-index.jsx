
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Play, Star, Clock, Users, BookOpen, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All", "Development", "Design", "Marketing", "Data Science", "Business"];

import CourseImage from '../../assets/images/ten/courses/Imagecourse.jpeg'

import * as api_subscription from '../../services/account/subscription.api.js'
import * as api_courses from '../../services/academy/academy.api.js'

const courses = [
  {
    id: 1,
    title: "Dennis Bay Way “Passive Income Mastery” Course",
    instructor: "Dennis Bay",
    rating: 4.8,
    students: 15420,
    duration: "10 hours",
    price: "VIP",
    originalPrice: "PCA",
    image: CourseImage,
    category: "Development",
    level: "Beginner to Advanced",
    lessons: 14
  },
];

const AcademyIndex = () => {

    const auth_states = useSelector(state => state.AuthReducer);

    const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used
    
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [allCourses, setAllCourses] = useState("");

    const GetUserAccountSubscriptionDetails = async () =>{
        setLoadingRequest(true)
        await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
            SetAccountSubscriptionDetails(result.data.data)
            setLoadingRequest(false)
        }).catch((err) =>{
            setLoadingRequest(false)
        })
    }

    const getAllCoursesContents = async () =>{
        setLoadingRequest(true)
        await api_courses.getAllCoursesContents(auth_states.StateToken).then((result) =>{
            setAllCourses(result.data.data)
            setLoadingRequest(false)
        }).catch((err) =>{
            setLoadingRequest(false)
        })
    }

    useEffect(()=>{
        GetUserAccountSubscriptionDetails()
        getAllCoursesContents()
    },[])

    useEffect(() =>{
        if(auth_states.SelectedLanguage){
            selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
            GetUserAccountSubscriptionDetails()
        }
    },[auth_states])

    useEffect(() =>{
        auth_states.PageLanguages.map((item, key) =>{
            const translation = item.translation
            
            if(translation.length > 0 && auth_states.SelectedLanguage){
                const filteredTranslation = translation.find(translation_item => translation_item.language_id == auth_states.SelectedLanguage.id)
                const targetElement = document.getElementsByClassName(item.page_config_id)
                if (targetElement) {
                    if (targetElement.length > 0 && filteredTranslation) {
                        Array.from(targetElement).forEach((el) => {
                            el.textContent = filteredTranslation.page_config_title;
                        });
                    } else if (targetElement.length > 0) {
                        Array.from(targetElement).forEach((el) => {
                            el.textContent = item.page_config_title;
                        });
                    }
                }
            }
        })
    },[auth_states, loadingRequest, allCourses])

    const EmptyState = () => {
        return (
            <div className='flex justify-center'>
                <div className="py-12 text-center ">
                    <svg
                        className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white no_course_found_label_id">No courses found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 explore_more_courses_label_id">Explore more courses in the academy.</p>
                </div>
            </div>
        );
    };

    return (
        <div className='flex justify-center my-5 mb-[150px]'>
            <div className='md:w-[75%] w-[95%]'>
                <div className="min-h-screen text-gray-700 bg-white">
                    {/* Categories Filter */}
                    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold featured_courses_label_id">Featured Courses</h2>
                        </div>

                        {
                            loadingRequest 
                            ? 
                                (
                                    <div className="p-6 animate-pulse">
                                        <div className="h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                                        <div className="h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                                        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                                    </div>
                                ) 
                            : allCourses.length === 0 
                                ?   
                                    EmptyState()
                                :   
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                        {
                                        allCourses.length > 0 &&
                                                allCourses.map((course) => (
                                                    <Link key={course.id} to={`/academy?course=${course.id}`}>
                                                        <div className="overflow-hidden transition-all duration-300 scale-105 bg-white border shadow-2xl rounded-xl bg-gray-750 hover:bg-gray-750 hover:scale-105 hover:shadow-2xl group">
                                                            <div className="relative">
                                                                <img
                                                                    src={course.thumbnail}
                                                                    alt={course.title}
                                                                    className="object-cover w-full h-48"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black opacity-0 bg-opacity-40 group-hover:opacity-100">
                                                                    <Play className="w-12 h-12 text-white" />
                                                                </div>
                                                                {/* <div className="absolute px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded top-3 left-3">
                                                                    {course.category}
                                                                </div> */}
                                                            </div>
                                                            
                                                            <div className="p-6">
                                                                <h3 className="mb-2 text-xl font-semibold line-clamp-2">
                                                                    {course.title}
                                                                </h3>
                                                                <p className="mb-3 space-x-1 text-gray-400">
                                                                    <span className='by_label_id'>by</span> 
                                                                    <span>{course.author}</span>
                                                                </p>
                                                                
                                                                <div className="flex items-center mb-4 space-x-4 text-sm text-gray-400">
                                                                    {/* <div className="flex items-center space-x-1">
                                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                                        <span>{course.rating}</span>
                                                                    </div> */}
                                                                    {/* <div className="flex items-center space-x-1">
                                                                        <Users className="w-4 h-4" />
                                                                        <span>{course.students.toLocaleString()}</span>
                                                                    </div> */}
                                                                    {/* <div className="flex items-center space-x-1">
                                                                        <Clock className="w-4 h-4" />
                                                                        <span>{course.duration}</span>
                                                                    </div> */}
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    {/* <div className="flex items-center space-x-2">
                                                                        <span className="text-2xl font-bold text-purple-400">
                                                                            {course.price}
                                                                        </span>
                                                                        <span className="text-gray-500 line-through">
                                                                            {course.originalPrice}
                                                                        </span>
                                                                    </div> */}
                                                                    <p className="flex items-center space-x-1">
                                                                        <span className="text-sm text-gray-400">
                                                                        {course.sections.length} 
                                                                        </span>
                                                                        <span className='lesson_label_id'>Section</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                        }
                                    </div>
                        }
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AcademyIndex;
