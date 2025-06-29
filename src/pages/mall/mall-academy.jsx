
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  PlayCircle,
  ArrowLeft,
  Download,
  Settings,
  Volume2,
  ChevronDown,
  ChevronUp,
  Lock,
  FileText,
  Code,
  HelpCircle
} from 'lucide-react';
const env = import.meta.env;

import * as api_subscription from '../../services/account/subscription.api.js'

import CourseImage from '../../assets/images/ten/courses/Imagecourse.jpeg'

const MallAcademy = () =>{

    const auth_states = useSelector(state => state.AuthReducer);

    const [loadingRequest, setLoadingRequest] = useState(true);
    const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

    const courseData = {
        1: {
            title: "Dennis Bay Way “Passive Income Mastery” Course",
            instructor: "Dennis Bay",
            rating: 4.8,
            students: 15420,
            duration: "10 hours",
            price: "VIP",
            originalPrice: "PCA",
            description: "Educating, Empowering, Enriching Lives Globally",
            whatYouLearn: [
                "Build powerful, fast, user-friendly and reactive web apps",
                "Provide amazing user experiences by leveraging the power of JavaScript",
                "Apply for high-paid jobs or work as a freelancer",
                "Learn all about React Hooks and React Components"
            ],
            modules: [
                {
                    id: 1,
                    title: "Concepts and Mindset for Success",
                    lessons: [
                        { id: 1, title: "Why become a business owner and Investor? - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315" src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwa-course&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=f2c1b66ac1504ea7831b67c08c6ce76a&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0" allowfullscreen></iframe>`},
                        { id: 2, title: "Active VS Passive Income – PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=f245a3aaabe647a0a719
c118977539b7&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 3, title: "Assets VS Liabilities - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=c6c74004701748d5a8de
01bc92b28364&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 4, title: "Financial Freedom VS Time Freedom - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=f366596fab69405cb2b5
ddc9e6b76c5e&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 5, title: "The Million Dollar Formula - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=1fdb78de775f4829b32a
1af8393427af&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 6, title: "The Perfect Business - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=347c4c06a82446e8b0b0
de4ed512f8c9&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 7, title: "What is Affiliate Marketing? - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=91bf260e396a4b89bfa0f
d4951265561&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 8, title: "The Power of 100% Duplication - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=9ac29fa83d40495ca136
90465e91710c&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 9, title: "Personal Franchising - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=95df1c5867504cb18b58
a6bc71045704&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 10, title: "How to choose the right company? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=86b0c21f320f4f96ba378d20dd01c6e6&videoId=d03630dcadb74e61bec5
4794b1277f99&compId=comp-mceu4oyq&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` }
                    ]
                },
                {
                    id: 2,
                    title: "How To Build Your Global Sales Team?",
                    lessons: [
                        { id: 1, title: "The 6 Skills To Master Success - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=16f73bb522534f2bb85b
e01afb973697&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 2, title: "Skill Number 1 – Prospecting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=31a7690f1e084ceaac98
a03a54a2750f&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 3, title: "Skill Number 2 – Inviting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=e4bbda99e5ca4f249af6
0809dbf4a692&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 4, title: "Skill Number 3 – Sharing - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=eb8aa0febb2847fa8155
d0a64e3c57d7&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 5, title: "Skill Number 4 – Enrolling - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=dfec5d1577c34637a499
c604ceaf5d6d&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 6, title: "Skill Number 5 – Educating - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=fa6dfc1754424fb89475c
d55081710a5&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 7, title: "Skill Number 6 – Promoting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=b4c24349a28d4c97bdbf
9f8361bb872a&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 8, title: "How to Turn Every No To a YES - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=6b96da49a84d43468a3
6a55a6cdeb81f&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 9, title: "The 6 Laws of Leadership - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=b5757c112d684105807
02fadf6f57f8a&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 10, title: "The 5 Golden Rules - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=4ad18f20ddf548aab750
ac2c2681f330&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (1)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=425d0811dad84a13902
1083198f11561&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 11, title: "The 6 Paths to Freedom (2)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=2c03d8f798cf4bed94fd5
33e0242cb70&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 11, title: "The 6 Paths to Freedom (3)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=b22610679a0141c5a001
af869a10bf2f&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 11, title: "The 6 Paths to Freedom (4)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=518466522a6144fd9889
364342a6ccf5&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (5)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=24035bd16c844288b7e
40c9ad0a4e0a3&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (6)- PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=b8ad2309fffe489e9478
384573967d84&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=e89eeabbdf714f5aa854
e7d0e1cbe353&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=e9949155e62743e9adf7
80671c4d28a9&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=4268e1b33edf45fe9665
e5f910aae97f&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=defc137fe5fb4f8fa9454c
b217e93585&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=defc137fe5fb4f8fa9454c
b217e93585&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=a6fe469cb9cc4503b365b6577255a6c5&videoId=5ed89ef019fa48a9a71fc
5063ece3170&compId=comp-mceu51lv&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                    ]
                },
                {
                    id: 3,
                    title: "Becoming a Multi-Asset Investor and Trader",
                    lessons: [
                        { id: 1, title: "How do you grow more money while you sleep? - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=8e5a2596d98943b4861
c46aa737aa76c&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 2, title: "What is a Multi-Asset Investor and Trader? - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=6cd5e4d408f44ff4ac110
2dc72fe493a&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 3, title: "Money VS The Stock Market - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=a434fe6a611547dfb940
c851c1360207&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 4, title: "Money VS Indices - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=e19488eb7ab8450bb87
da5af4b87748c&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 5, title: "Money VS Commodities - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=1c04cb97b91349c59d6
5540f83a82177&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 6, title: "Money VS Currency Pairs - PCA", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=ceb33fe31f45449db9e7
0e5a2b0a1d46&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 7, title: "How do I buy stocks with just $100? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=5fb28bd6c43444aa8826
baf0920265c0&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 8, title: "How to open an investing and trading account? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=ba97078333634be8a41
a37f7c4878622&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 9, title: "How to deposit funds to your trading account? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=891b5f19a40a412685dc
a378bd35455a&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 10, title: "What are stock options? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=ba9b75ebe5af45cab02c
1f97fb2ad3f1&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> ` },
                        { id: 11, title: "How to generate income from real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=7ba6b50cd7964d19a5c
3f57f5bfd698d&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 12, title: "How to leverage the banks to invest in real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=6fdee9df6c3c4a8eb5c2
173db8b2da9b&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe>` },
                        { id: 13, title: "How To Use Airbnb to Generate More Passive Income? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=75d23faa45f7453794e1
536e456f7cc7&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` },
                        { id: 14, title: "The power of teamwork in real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
src="https://embed.wix.com/video?instanceId=2623bb45-d55d-4819-b948-
bf46f0f92395&biToken=31e12868-a8e4-02d3-1fbb-b9462cd879f3&pathToPage=%2Fdbwacourse&channelId=83b25e4f97f54543802c36151b6e2916&videoId=cd91c710dc6e4e948c39
8098ab83c14c&compId=comp-mcevurpn&sitePageId=za57d" frameborder="0"
allowfullscreen></iframe> 
` }
                    ]
                }
            ],
        }
    };

    const { id } = useParams();
    const course = courseData[parseInt(id || '1')];
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(
        {
            id: null,
            title: null,
            membership: [],
            videoUrl: null
        }
    );
    const [showNotes, setShowNotes] = useState(false);
    const [expandedModules, setExpandedModules] = useState([1]); // First module expanded by default
    const [activeTab, setActiveTab] = useState('overview');

    if (!course) {
        return (
        <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
            <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Course not found</h1>
            <Link to="/" className="text-purple-400 hover:text-purple-300">Return to courses</Link>
            </div>
        </div>
        );
    }

    const handleLessonClick = (lesson) => {
        setCurrentLesson({
            id: lesson.id,
            title: lesson.title,
            membership: lesson.membership,
            videoUrl: lesson.videoUrl
        });
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => 
        prev.includes(moduleId) 
            ? prev.filter(id => id !== moduleId)
            : [...prev, moduleId]
        );
    };

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => lesson.completed).length, 0
    );

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

    useEffect(()=>{
        GetUserAccountSubscriptionDetails()
    },[])
    
    return (
        <div className='flex justify-center my-5 mb-[150px]'>
            <div className='md:w-[75%] w-[95%]'>
                <div className="min-h-screen text-gray-900 bg-white">
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

                    <div className="flex flex-col lg:flex-row">
                        {/* Video Player Section */}
                        <div className="flex-1 lg:order-1">
                        {/* Video Player */}
                        <div className="relative bg-black aspect-video">
                            {
                                (
                                    !loadingRequest &&
                                    currentLesson.membership.includes(AccountSubscriptionDetails.details.subscription_category.membership_type.type_title.toString().toLowerCase())
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
                                            src={currentLesson.videoUrl.match(/src="([^"]+)"/)[1]}
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
                                    src={CourseImage}
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
                                <span className="hidden sm:inline">by {course.instructor}</span>
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
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-sm leading-relaxed text-gray-800 lg:text-lg">
                                            {course.description}
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
                        <div className="w-full max-h-screen bg-white border-t border-gray-700 lg:w-96 lg:border-t-0 lg:border-l lg:order-2 lg:overflow-y-auto">
                            <div className="p-4 lg:p-6">
                                <h2 className="mb-4 text-lg font-semibold lg:text-xl">Course Content</h2>
                                <div className="mb-4 text-sm text-gray-400 lg:mb-6">
                                {course.modules.length} sections • {totalLessons} lectures • {course.duration}
                                </div>

                                <div className="space-y-2 lg:space-y-4">
                                {course.modules.map((module) => (
                                    <div key={module.id} className="border border-gray-700 rounded-lg">
                                        <div 
                                            className="p-3 transition-colors cursor-pointer lg:p-4 bg-gray-750 hover:text-white hover:bg-gray-700"
                                            onClick={() => toggleModule(module.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium lg:text-base hover:text-white">{module.title}</h3>
                                                <div className="mt-1 text-xs text-gray-800 lg:text-sm hover:text-white">
                                                {module.lessons.length} lectures
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
                                            {module.lessons.map((lesson) => (
                                                <div
                                                key={lesson.id}
                                                onClick={() => handleLessonClick(lesson)}
                                                className={`p-3 lg:p-4 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors ${
                                                    currentLesson?.id === lesson.id ? 'bg-gray-900 bg-opacity-50' : ''
                                                }`}
                                                >
                                                <div className="flex items-center space-x-3">
                                                    {lesson.completed ? (
                                                    <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500 lg:h-5 lg:w-5" />
                                                    ) : (
                                                    <PlayCircle className="flex-shrink-0 w-4 h-4 text-gray-400 lg:h-5 lg:w-5" />
                                                    )}
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
                </div>
            </div>
        </div>  
    ) 
}

export default MallAcademy
