
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

import { 
  Clock, 
  CheckCircle, 
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
const env = import.meta.env;

import * as api_subscription from '../../services/account/subscription.api.js'
import * as api_courses from '../../services/academy/academy.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

import CourseImage from '../../assets/images/ten/courses/Imagecourse.jpeg'

const MallAcademy = () =>{

    const auth_states = useSelector(state => state.AuthReducer);
    const modalRef = useRef(null);
    const navigate = useNavigate();
    

    const [loadingRequest, setLoadingRequest] = useState(true);
    const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("course"); // returns "1"

    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(
        {
            id: null,
            title: null,
            membership: false,
            videoUrl: null
        }
    );
    const [showNotes, setShowNotes] = useState(false);
    const [expandedModules, setExpandedModules] = useState([1]); // First module expanded by default
    const [activeTab, setActiveTab] = useState('overview');

    const handleLessonClick = (lesson) => {

        var is_paid_membership = AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account
        var membership = AccountSubscriptionDetails.details.subscription_category.membership_type.type_title.toString().toLowerCase()

        if(!is_paid_membership && !lesson.free_preview){
            setTimeout(() => {
                modalRef.current?.showModal();
            }, 0)
        }

        setCurrentLesson({
            id: lesson.id,
            title: lesson.title,
            membership: lesson.free_preview,
            videoUrl: lesson.media_url
        });
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => 
        prev.includes(moduleId) 
            ? prev.filter(id => id !== moduleId)
            : [...prev, moduleId]
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        // { id: 'notes', label: 'Notes' },
        // { id: 'announcements', label: 'Announcements' },
        // { id: 'reviews', label: 'Reviews' },
        // { id: 'qa', label: 'Q&A' }
    ];

    const GetUserAccountSubscriptionDetails = async () =>{
        setLoadingRequest(true)
        await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
            SetAccountSubscriptionDetails(result.data.data)
            setLoadingRequest(false)
        }).catch((err) =>{
            setLoadingRequest(false)
        })
    }

    const getCoursesContents = async () =>{
        setLoadingRequest(true)
        await api_courses.getCoursesContents(auth_states.StateToken, parseInt(courseId)).then((result) =>{
            setSelectedCourse(result.data.data)
            setLoadingRequest(false)
        }).catch((err) =>{
            setLoadingRequest(false)
        })
    }

    useEffect(()=>{
        GetUserAccountSubscriptionDetails()
        getCoursesContents()
    },[])

    const ModalForUpgradeSubscription = () =>{
        return(
            <div>
                <dialog ref={modalRef} id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <div className="flex-1 mt-5 space-y-1 md:space-y-8">
                            <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl">
                            available only for active VIP members.
                            </h2>

                            <div className="flex flex-col items-center space-y-3 ">
                                <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                                    <img
                                    className="w-[60px] md:w-[100px]"
                                    alt="Tailwind CSS chat bubble component"
                                    src={Logo2} />
                                </div>
                                {/* Text Content */}
                                <div className="flex-1 text-center">
                                    <p className="text-sm font-semibold earn_more_points_id">Earn more points</p>
                                    <p className="text-xs text-gray-600 members_could_save_id">
                                        Paid Memberships could save time and money finding great deals.
                                    </p>
                                </div>

                                <div className='flex justify-center'>
                                    <button onClick={() => navigate('/subscriptions')} className="px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
                                    Upgrade Membership
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        )
    }

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
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Explore more courses in the academy.</p>
                </div>
            </div>
        );
    };

      
    return (
        <div className='flex justify-center my-5 mb-[50px]'>
            <div className='md:w-[75%] w-[95%]'>
                <div className="text-gray-900 bg-white">
                    {/* Header */}
                    <header className="sticky top-0 z-50 bg-white border-b border-gray-900">
                        {/* <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-14 lg:h-16">
                                <div className="flex items-center space-x-2 lg:space-x-4">
                                    <Link to="/" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300">
                                        <ArrowLeft className="w-4 h-4 lg:h-5 lg:w-5" />
                                        <span className="hidden sm:inline">Back to Courses</span>
                                        <span className="sm:hidden">Back</span>
                                    </Link>
                                    <div className="hidden w-px h-6 bg-gray-600 sm:block"></div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-purple-500 lg:h-6 lg:w-6" />
                                        <span className="text-sm font-semibold lg:text-base">LearnHub</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 lg:space-x-4">
                                    <div className="hidden text-xs text-gray-400 lg:text-sm md:block">
                                        Progress: {completedLessons}/{totalLessons} lessons
                                    </div>
                                    <div className="w-20 h-2 bg-gray-700 rounded-full lg:w-32">
                                        <div 
                                        className="h-2 transition-all duration-300 bg-purple-500 rounded-full"
                                        style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </header>

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
                            : !selectedCourse
                                ?   
                                    <EmptyState/>
                                :    
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Video Player Section */}
                                        <div className="flex-1 lg:order-1">
                                            {/* Video Player */}
                                            <div className="relative bg-black aspect-video">
                                                {
                                                    (
                                                        // !loadingRequest &&
                                                        currentLesson.membership
                                                        // .includes(AccountSubscriptionDetails.details?.subscription_category?.membership_type.type_title.toString().toLowerCase())
                                                    ) 
                                                    ?
                                                        // <video
                                                        // className="w-full h-full"
                                                        // controls
                                                        // controlsList="nodownload"
                                                        // poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop"
                                                        // >
                                                        // <source src={currentLesson?.videoUrl} type="video/mp4" />
                                                        // Your browser does not support the video tag.
                                                        // </video>

                                                            <iframe
                                                                className='rounded-lg'
                                                                src={currentLesson.videoUrl}
                                                                // src={videoId}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                                title="YouTube Video"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                }}
                                                            />
                                                            
                                                        // <iframe
                                                        //     className='rounded-lg'
                                                        //     src={currentLesson.videoUrl}
                                                        //     // src={videoId}
                                                        //     frameBorder="0"
                                                        //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        //     allowFullScreen
                                                        //     title="YouTube Video"
                                                        //     style={{
                                                        //     width: '100%',
                                                        //     height: '200px',
                                                        //     }}
                                                        // />
                                                    :   
                                                        <img
                                                        src={selectedCourse?.thumbnail}
                                                        alt=""  
                                                        className="absolute inset-0 object-contain w-full h-full"
                                                        />
                                                }
                                                {/* Video Overlay Controls */}
                                                {/* <div className="absolute flex items-center justify-between p-2 bg-black bg-opacity-50 rounded-lg bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4 lg:p-3">
                                                    <div className="flex items-center space-x-2 lg:space-x-3">
                                                        <button
                                                        onClick={() => setIsPlaying(!isPlaying)}
                                                        className="p-1.5 lg:p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                                                        >
                                                        {isPlaying ? <Pause className="w-4 h-4 lg:h-5 lg:w-5" /> : <Play className="w-4 h-4 lg:h-5 lg:w-5" />}
                                                        </button>
                                                        <Volume2 className="w-4 h-4 text-gray-300 lg:h-5 lg:w-5" />
                                                        <div className="w-12 h-1 bg-gray-600 rounded-full lg:w-20">
                                                            <div className="w-10 h-1 bg-white rounded-full lg:w-16"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Settings className="w-4 h-4 text-gray-300 cursor-pointer lg:h-5 lg:w-5 hover:text-white" />
                                                        <Download className="w-4 h-4 text-gray-300 cursor-pointer lg:h-5 lg:w-5 hover:text-white" />
                                                    </div>
                                                </div> */}
                                            </div>

                                            {/* Course Info - Mobile/Tablet */}
                                            <div className="p-4 lg:p-6">
                                                <h1 className="mb-2 text-xl font-bold lg:text-3xl">{currentLesson?.title}</h1>
                                                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400 lg:gap-6 lg:mb-6 lg:text-base">
                                                    {/* <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span>{course.rating}</span>
                                                    </div> */}
                                                    {/* <div className="flex items-center space-x-1">
                                                        <Users className="w-4 h-4" />
                                                        <span className="hidden sm:inline">{course.students.toLocaleString()} students</span>
                                                        <span className="sm:hidden">{Math.floor(course.students/1000)}k students</span>
                                                    </div> */}
                                                    <span className="hidden sm:inline">by {selectedCourse.author}</span>
                                                </div>

                                                {/* Tabs */}
                                                <div className="mb-4 border-b border-gray-700 lg:mb-6">
                                                    <nav className="flex space-x-4 overflow-x-auto lg:space-x-8">
                                                        {tabs.map((tab) => (
                                                        <button
                                                            key={tab.id}
                                                            onClick={() => setActiveTab(tab.id)}
                                                            className={`py-2 text-sm lg:text-base whitespace-nowrap transition-colors ${
                                                            activeTab === tab.id
                                                                ? 'border-b-2 border-purple-500 text-gray-800 font-medium'
                                                                : 'text-gray-800 hover:text-white'
                                                            }`}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                        ))}
                                                    </nav>
                                                </div>

                                                {/* Tab Content */}
                                                {activeTab === 'notes' ? (
                                                    <div className="p-4 bg-white rounded-lg lg:p-6">
                                                        <h3 className="mb-4 text-lg font-semibold lg:text-xl">My Notes</h3>
                                                        <textarea
                                                        placeholder="Take notes while watching..."
                                                        className="w-full h-24 p-3 text-sm text-black bg-white rounded-lg resize-none lg:h-32 lg:p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 lg:text-base"
                                                        ></textarea>
                                                        <button className="px-4 py-2 mt-4 text-sm text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 lg:text-base">
                                                        Save Notes
                                                        </button>
                                                    </div>
                                                ) : activeTab === 'qa' ? (
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-white rounded-lg lg:p-6">
                                                            <h3 className="mb-4 text-lg font-semibold lg:text-xl">Ask a Question</h3>
                                                            <textarea
                                                                placeholder="Ask a question about this lesson..."
                                                                className="w-full h-20 p-3 text-sm text-white bg-gray-700 rounded-lg resize-none lg:h-24 lg:p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 lg:text-base"
                                                            ></textarea>
                                                            <button className="px-4 py-2 mt-4 text-sm text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 lg:text-base">
                                                                Post Question
                                                            </button>
                                                        </div>
                                                        <div className="p-4 bg-white rounded-lg lg:p-6">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold bg-purple-600 rounded-full">
                                                                JD
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center mb-2 space-x-2">
                                                                        <span className="text-sm font-medium lg:text-base">John Doe</span>
                                                                        <span className="text-xs text-gray-800 lg:text-sm">2 hours ago</span>
                                                                    </div>
                                                                    <p className="mb-2 text-sm text-gray-800 lg:text-base">How do I handle state management in larger React applications?</p>
                                                                    <div className="flex items-center space-x-4 text-sm text-gray-800">
                                                                        <button className="hover:text-white">Reply</button>
                                                                        <span>3 replies</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="prose prose-invert max-w-none ">
                                                            <p className="text-sm leading-relaxed text-gray-800 lg:text-lg ">
                                                                {selectedCourse.description}
                                                            </p>
                                                        </div>

                                                        {/* <div className="mt-6 lg:mt-8">
                                                            <h3 className="mb-4 text-lg font-semibold lg:text-xl">What you'll learn</h3>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {course.whatYouLearn.map((item, index) => (
                                                                <div key={index} className="flex items-start space-x-3">
                                                                    <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-sm text-gray-800 lg:text-base">{item}</span>
                                                                </div>
                                                                ))}
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Course Content Sidebar */}
                                        <div className="w-full bg-white border-t border-gray-700 lg:w-96 lg:border-t-0 lg:border-l lg:order-2 lg:overflow-y-auto">
                                            <div className="p-4 lg:p-6">
                                                <h2 className="mb-4 text-lg font-semibold lg:text-xl">Course Content</h2>
                                                <div className="mb-4 text-sm text-gray-400 lg:mb-6">
                                                {selectedCourse.sections.length} sections
                                                </div>

                                                <div className="space-y-2 lg:space-y-4">
                                                {selectedCourse.sections.map((module) => (
                                                    <div key={module.id} className="border border-gray-700 rounded-lg">
                                                        <div 
                                                            className="p-3 transition-colors cursor-pointer lg:p-4 bg-gray-750 hover:text-white hover:bg-gray-700"
                                                            onClick={() => toggleModule(module.id)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium lg:text-base hover:text-white">{module.title}</h3>
                                                                <div className="mt-1 text-xs text-gray-800 lg:text-sm hover:text-white">
                                                                {module.contents.length} lectures
                                                                </div>
                                                            </div>
                                                            {expandedModules.includes(module.id) ? (
                                                                <ChevronUp className="w-4 h-4 text-gray-800 lg:h-5 lg:w-5" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-gray-800 lg:h-5 lg:w-5" />
                                                            )}
                                                            </div>
                                                        </div>
                                                       
                                                        {expandedModules.includes(module.id) && (
                                                            <div className="divide-y divide-gray-700">
                                                            {module.contents.map((lesson) => (
                                                                <div
                                                                key={lesson.id}
                                                                onClick={() => handleLessonClick(lesson)}
                                                                className={`p-3 lg:p-4 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors ${
                                                                    currentLesson?.id === lesson.id ? 'bg-gray-900 bg-opacity-50' : ''
                                                                }`}
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        {/* {lesson.completed ? (
                                                                        <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500 lg:h-5 lg:w-5" />
                                                                        ) : (
                                                                        <PlayCircle className="flex-shrink-0 w-4 h-4 text-gray-400 lg:h-5 lg:w-5" />
                                                                        )} */}
                                                                        <PlayCircle className="flex-shrink-0 w-4 h-4 text-gray-400 lg:h-5 lg:w-5" />

                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-xs font-medium truncate lg:text-sm">
                                                                                {lesson.title}
                                                                            </div>
                                                                            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-400">
                                                                                <Clock className="w-3 h-3" />
                                                                                <span>{lesson.duration}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            </div>
                                                        )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    }
                </div>
            </div>

            <ModalForUpgradeSubscription/>
        </div>  
    ) 
}

export default MallAcademy
