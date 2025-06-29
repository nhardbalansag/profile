
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Play, Star, Clock, Users, BookOpen, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All", "Development", "Design", "Marketing", "Data Science", "Business"];

import CourseImage from '../../assets/images/ten/courses/Imagecourse.jpeg'

import * as api_subscription from '../../services/account/subscription.api.js'

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

    const [loadingRequest, setLoadingRequest] = useState(true);
    const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const GetUserAccountSubscriptionDetails = async () =>{
        setLoadingRequest(true)
        await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
            SetAccountSubscriptionDetails(result.data.data)
            setLoadingRequest(false)
        }).catch((err) =>{
            setLoadingRequest(false)
        })
    }

    useEffect(()=>{
        GetUserAccountSubscriptionDetails()
    },[])

    return (
        <div className='flex justify-center my-5 mb-[150px]'>
            <div className='md:w-[75%] w-[95%]'>
                <div className="min-h-screen text-gray-700 bg-white">
                    {/* Categories Filter */}
                    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold">Featured Courses</h2>
                        </div>

                        {/* Course Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCourses.map((course) => (
                                <Link key={course.id} to={`/academy`}>
                                    <div className="overflow-hidden transition-all duration-300 scale-105 bg-white border shadow-2xl rounded-xl bg-gray-750 hover:bg-gray-750 hover:scale-105 hover:shadow-2xl group">
                                        <div className="relative">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="object-cover w-full h-48"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black opacity-0 bg-opacity-40 group-hover:opacity-100">
                                                <Play className="w-12 h-12 text-white" />
                                            </div>
                                            <div className="absolute px-2 py-1 text-sm font-medium text-white bg-purple-600 rounded top-3 left-3">
                                                {course.category}
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-semibold line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="mb-3 text-gray-400">by {course.instructor}</p>
                                            
                                            <div className="flex items-center mb-4 space-x-4 text-sm text-gray-400">
                                                {/* <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span>{course.rating}</span>
                                                </div> */}
                                                {/* <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{course.students.toLocaleString()}</span>
                                                </div> */}
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{course.duration}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold text-purple-400">
                                                        {course.price}
                                                    </span>
                                                    <span className="text-gray-500 line-through">
                                                        {course.originalPrice}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-400">
                                                {course.lessons} lessons
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AcademyIndex;
