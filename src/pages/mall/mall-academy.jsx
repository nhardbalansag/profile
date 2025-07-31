
import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
const env = import.meta.env;

import * as api_subscription from '../../services/account/subscription.api.js'
import Logo2 from '../../assets/images/ten/logo2.png'

import CourseImage from '../../assets/images/ten/courses/Imagecourse.jpeg'

const MallAcademy = () =>{

    const auth_states = useSelector(state => state.AuthReducer);
    const modalRef = useRef(null);
    const navigate = useNavigate();
    

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
                        { id: 1, title: "Why become a business owner and Investor? - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315" src="https://play.webvideocore.net/popplayer.php?it=80hvimf6emck&is_link=1&w=720&h=405&pause=1&title=dbwa_lesson001_whybecomeabusinessowner&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10472000%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_player=none" frameborder="0" allowfullscreen></iframe>`},
                        { id: 2, title: "Active VS Passive Income – PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=3nlvtkraiew4&is_link=1&w=720
                        &h=405&pause=1&title=dbwa_lesson002_activevspassiveincome&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        75692%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none 
                        " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 3, title: "Assets VS Liabilities - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=2m1oeag9mqm8&is_link=1&w
                        =720&h=405&pause=1&title=dbwa_lesson003_assetsvsliabilities&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        75731%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 4, title: "Financial Freedom VS Time Freedom - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9593czr6uc08&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson004_financialfreedomvstimefreedom&skin=3&repeat
                        =&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fulls
                        creen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHigh
                        light=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=botto
                        m&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=
                        %23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.st
                        reamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip
                        _id%3D10475688%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_b
                        utton=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_ty
                        pe=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 5, title: "The Million Dollar Formula - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=bv4w7advzlcs&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson005_milliondollarformula&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        75686%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 6, title: "The Perfect Business - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=buz6wa7ry9cs&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson006_theperfectbusiness&skin=3&repeat=&brandNW
                        =1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_
                        mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f
                        54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positi
                        onOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc
                        _bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvide
                        oprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1047
                        5705%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pla
                        y_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&
                        floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 7, title: "What is Affiliate Marketing? - PCA", duration: "10:00", membership: ['pca', 'vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=8vm7fi3c2igw&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson007_whatisaffiliatemarketing&skin=3&repeat=&bran
                        dNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=
                        1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=
                        %237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_
                        positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffff
                        ff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamin
                        gvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3
                        D10475706%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button
                        =1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=un
                        Mute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 8, title: "The Power of 100% Duplication - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=2t5553r45nok&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson008_powerof100duplication&skin=3&repeat=&brand
                        NW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1
                        &fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%
                        237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_p
                        ositionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff
                        &cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingv
                        ideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1
                        0475687%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1
                        &play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unM
                        ute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 9, title: "Personal Franchising - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=elp4a3xg6eos&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson009_personalfranchising&skin=3&repeat=&brandNW
                        =1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_
                        mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f
                        54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positi
                        onOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc
                        _bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvide
                        oprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1047
                        5721%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pla
                        y_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&
                        floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 10, title: "How to choose the right company? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9puxxhf5smww&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_lesson010_howtochoosetherightcompany&skin=3&repeat
                        =&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fulls
                        creen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHigh
                        light=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=botto
                        m&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=
                        %23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.st
                        reamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip
                        _id%3D10475735%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_b
                        utton=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_ty
                        pe=unMute&floating_player=none " frameborder="0"
                        allowfullscreen></iframe> 
                        ` }
                    ]
                },
                {
                    id: 2,
                    title: "How To Build Your Global Sales Team?",
                    lessons: [
                        { id: 1, title: "The 6 Skills To Master Success - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=etvod15l7dw0&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson_mod2_1_sixskillsforsuccess&skin=3&repeat=&brand
                        NW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1
                        &fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%
                        237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_p
                        ositionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff
                        &cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingv
                        ideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1
                        0477763%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1
                        &play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unM
                        ute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 2, title: "Skill Number 1 – Prospecting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=2s8q5wkfk5k4&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_lesson_mod2_2_skill1_prospecting&skin=3&repeat=&bran
                        dNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=
                        1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=
                        %237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_
                        positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffff
                        ff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamin
                        gvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3
                        D10477917%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button
                        =1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=un
                        Mute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 3, title: "Skill Number 2 – Inviting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=5wov7osnr68s&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod2_3_skill2_inviting&skin=3&repeat=&brandNW=1&st
                        art_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode
                        =2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&
                        direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffs
                        et=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgC
                        olor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovi
                        der.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10477924%
                        26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_butt
                        on_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floatin
                        g_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 4, title: "Skill Number 3 – Sharing - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=7xdt7ie0a4o4&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod2_skill3_sharing&skin=3&repeat=&brandNW=1&start_
                        volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&
                        skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&dire
                        ct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=
                        70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor
                        =%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovider.
                        com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10478092%26s
                        ize%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button
                        _style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_
                        player=none 
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 5, title: "Skill Number 4 – Enrolling - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9kgjextnh2os&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod2_skill4_enrolling&skin=3&repeat=&brandNW=1&start
                        _volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2
                        &skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&dir
                        ect=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset
                        =70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgCol
                        or=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovid
                        er.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10478110%2
                        6size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_butto
                        n_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating
                        _player=none " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 6, title: "Skill Number 5 – Educating - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9mzxe2eq5n48&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod2_skill5_educating&skin=3&repeat=&brandNW=1&st
                        art_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode
                        =2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&
                        direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffs
                        et=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgC
                        olor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovi
                        der.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10478097%
                        26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_butt
                        on_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floatin
                        g_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 7, title: "Skill Number 6 – Promoting - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9r5boh9rw7c4&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod2_skill5_promoting&skin=3&repeat=&brandNW=1&s
                        tart_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mod
                        e=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8
                        &direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOf
                        fset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkg
                        Color=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideopro
                        vider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10477878
                        %26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_bu
                        tton_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floati
                        ng_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 8, title: "How to Turn Every No To a YES - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=d844bdtpwrkk&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod2_skill3_1_howtoturnnotoYES&skin=3&repeat=&bran
                        dNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=
                        1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=
                        %237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_
                        positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffff
                        ff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamin
                        gvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3
                        D10477874%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button
                        =1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=un
                        Mute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 9, title: "The 6 Laws of Leadership - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=4jj3pgecznok&is_link=1&w=720
                        &h=405&pause=1&title=dbwa_mod2_sixlawsofleadership&skin=3&repeat=&brandNW=1&s
                        tart_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mod
                        e=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8
                        &direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOf
                        fset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkg
                        Color=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideopro
                        vider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10477927
                        %26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_bu
                        tton_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floati
                        ng_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 10, title: "The 5 Golden Rules - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=3pxic717a2sk&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod2_5goldenrules&skin=3&repeat=&brandNW=1&start_
                        volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&
                        skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&dire
                        ct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=
                        70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor
                        =%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovider.
                        com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10477926%26s
                        ize%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button
                        _style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_
                        player=none " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (1)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=8ad3k113fxc0&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_paths_to_freedom_path_1+%28360p%2
                        9&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10475960%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 11, title: "The 6 Paths to Freedom (2)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=alxg8sc3ck8c&is_link=1&w=720
                        &h=405&pause=1&title=dennis_bay_way%2C_six_path_to_freedom_path_2+%28360p%29
                        &skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10475956%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 11, title: "The 6 Paths to Freedom (3)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=4l3las4ehf6s&is_link=1&w=720
                        &h=405&pause=1&title=dennis_bay_way%2C_six_path_to_freedom_path_3+%28360p%29
                        &skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10475968%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 11, title: "The 6 Paths to Freedom (4)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=8rni5tpjfm04&is_link=1&w=720
                        &h=405&pause=1&title=dennis_bay_way%2C_six_path_to_freedom_path_4+%28360p%29
                        &skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10476044%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (5)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=ai3dtqca5kgs&is_link=1&w=720
                        &h=405&pause=1&title=dennis_bay_way%2C_six_path_to_freedom_path_5+%28360p%29
                        &skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10476050%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 11, title: "The 6 Paths to Freedom (6)- PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9iwb0qk85ios&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_path_to_freedom_path_6+%28360p%2
                        9&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10476081%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=au1yyd3hzdc8&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_1st_key+%28360p%
                        29&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2
                        =%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=
                        %23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0
                        &cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&c
                        c_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3
                        A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenera
                        teThumbnail%26clip_id%3D10475964%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ra
                        tio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_pl
                        ay=0&auto_play_type=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=efuc1wsy1ds0&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_2nd_key+%28360p
                        %29&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradien
                        t2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon
                        =%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=
                        0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&
                        cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3
                        A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenera
                        teThumbnail%26clip_id%3D10476094%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ra
                        tio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_pl
                        ay=0&auto_play_type=unMute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=1wgcubkl3iqs&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_3rd_key+%28360p
                        %29&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradien
                        t2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon
                        =%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=
                        0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&
                        cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3
                        A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenera
                        teThumbnail%26clip_id%3D10475991%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ra
                        tio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_pl
                        ay=0&auto_play_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=ddy0v8smxog0&is_link=1&w=7
                        20&h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_4th_key+%28360p
                        %29&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradien
                        t2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon
                        =%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=
                        0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&
                        cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3
                        A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenera
                        teThumbnail%26clip_id%3D10475966%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ra
                        tio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_pl
                        ay=0&auto_play_type=unMute&floating_player=none " frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=e3orjcr9c3k0&is_link=1&w=720
                        &h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_5th_key+%28360p%2
                        9&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=
                        %23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%
                        23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&c
                        c_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_t
                        extOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%
                        2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateT
                        humbnail%26clip_id%3D10476095%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio
                        =16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play
                        =0&auto_play_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 12, title: "The 6 Keys to Happiness - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=zuor9pe0edc4&is_link=1&w=72
                        0&h=405&pause=1&title=dennis_bay_way%2C_six_keys_to_happiness_6th_key+%28360p%
                        29&skin=3&repeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2
                        =%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=
                        %23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0
                        &cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&c
                        c_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3
                        A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenera
                        teThumbnail%26clip_id%3D10475965%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ra
                        tio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_pl
                        ay=0&auto_play_type=unMute&floating_player=none " frameborder="0"
                        allowfullscreen></iframe> ` },
                    ]
                },
                {
                    id: 3,
                    title: "Becoming a Multi-Asset Investor and Trader",
                    lessons: [
                        { id: 1, title: "How do you grow more money while you sleep? - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9dbmg2vyqrs4&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod3_1_howtogrowmoneywhileyousleep&skin=3&repeat
                        =&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fulls
                        creen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHigh
                        light=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=botto
                        m&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=
                        %23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.st
                        reamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip
                        _id%3D10477891%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_b
                        utton=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_ty
                        pe=unMute&floating_player=none 
                        " frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 2, title: "What is a Multi-Asset Investor and Trader? - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=dtdc6monqwgs&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_lesson_mod_3_2_whatisaMultiAssetTrader&skin=3&repe
                        at=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fu
                        llscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHi
                        ghlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bott
                        om&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor
                        =%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.s
                        treamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26cli
                        p_id%3D10477828%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_
                        button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_t
                        ype=unMute&floating_player=none 
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 3, title: "Money VS The Stock Market - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=9rfq1g22wu80&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod3_3_moneyvsstocks&skin=3&repeat=&brandNW=1&
                        start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mo
                        de=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f
                        8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_position
                        Offset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_b
                        kgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideop
                        rovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104779
                        07%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_
                        button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&flo
                        ating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 4, title: "Money VS Indices - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=3ctuhjrm7n6s&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_4_moneyvsindices&skin=3&repeat=&brandNW=1&s
                        tart_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mod
                        e=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8
                        &direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOf
                        fset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkg
                        Color=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideopro
                        vider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D10477770
                        %26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_bu
                        tton_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floati
                        ng_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 5, title: "Money VS Commodities - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=kgzwpr9bhe8c&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_5_moneyvscommodities&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        77901%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 6, title: "Money VS Currency Pairs - PCA", duration: "10:00", membership: ['vip', 'pca'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=8dzjkbiihfgg&is_link=1&w=720
                        &h=405&pause=1&title=dbwa_mod3_6_moneyvscurrencypairs&skin=3&repeat=&brandNW
                        =1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_
                        mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f
                        54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positi
                        onOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc
                        _bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvide
                        oprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1047
                        7902%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pla
                        y_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&
                        floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 7, title: "How do I buy stocks with just $100? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=cm2u7u0wleok&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod3_7_howtobuystockswith100&skin=3&repeat=&bran
                        dNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=
                        1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=
                        %237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_
                        positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffff
                        ff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamin
                        gvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3
                        D10477781%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button
                        =1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=un
                        Mute&floating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 8, title: "How to open an investing and trading account? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=8thqu9v3044c&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_8_howtoopenIBRKaccount&skin=3&repeat=&brand
                        NW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1
                        &fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%
                        237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_p
                        ositionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff
                        &cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingv
                        ideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1
                        0476071%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1
                        &play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unM
                        ute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 9, title: "How to deposit funds to your trading account? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=ad2uci5uqs8c&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_14_howtodeposittoIBKR&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        78942%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none" frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 10, title: "What are stock options? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=7xsidiarzl0k&is_link=1&w=720
                        &h=405&pause=1&title=dbwa_mod3_9_whatarestockoptions&skin=3&repeat=&brandNW=
                        1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_
                        mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f
                        54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positi
                        onOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc
                        _bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvide
                        oprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D1047
                        7925%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pla
                        y_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&
                        floating_player=none 
                        " frameborder="0"
                        allowfullscreen></iframe> ` },
                        { id: 11, title: "How to generate income from real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=3av1x12222sk&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_10_howtogenerateincomefromrealestate&skin=3&r
                        epeat=&brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9
                        &fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&col
                        orHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=
                        bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineC
                        olor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmemb
                        er.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%2
                        6clip_id%3D10477923%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&pl
                        ay_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_pla
                        y_type=unMute&floating_player=none
                        " frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 12, title: "How to leverage the banks to invest in real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=59vjwobbu18o&is_link=1&w=7
                        20&h=405&pause=1&title=dbwa_mod3_10_howtoleveragebanks&skin=3&repeat=&brandN
                        W=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&f
                        s_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%23
                        7f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_posi
                        tionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&c
                        c_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvid
                        eoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104
                        77918%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&pl
                        ay_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute
                        &floating_player=none" frameborder="0"
                        allowfullscreen></iframe>` },
                        { id: 13, title: "How To Use Airbnb to Generate More Passive Income? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=852ntff9p8w8&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_10_howtouseAirBNB&skin=3&repeat=&brandNW=1
                        &start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_m
                        ode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54
                        f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_position
                        Offset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_b
                        kgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideop
                        rovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D104778
                        48%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_
                        button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&flo
                        ating_player=none" frameborder="0"
                        allowfullscreen></iframe> 
                        ` },
                        { id: 14, title: "The power of teamwork in real estate? - VIP", duration: "10:00", membership: ['vip'], completed: false, videoUrl: `<iframe width="560" height="315"
                        src="https://play.streamingvideoprovider.com/popplayer.php?it=4qtyvz83x44k&is_link=1&w=72
                        0&h=405&pause=1&title=dbwa_mod3_13_powerofteamworkrealestate&skin=3&repeat=&
                        brandNW=1&start_volume=34&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscre
                        en=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlig
                        ht=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&
                        cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%2
                        3ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.strea
                        mingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id
                        %3D10478052%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_butt
                        on=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=
                        unMute&floating_player=none " frameborder="0"
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

        var is_paid_membership = AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account
        var membership = AccountSubscriptionDetails.details.subscription_category.membership_type.type_title.toString().toLowerCase()

        if(!is_paid_membership && !lesson.membership.includes(membership)){
            setTimeout(() => {
                modalRef.current?.showModal();
            }, 0)
        }

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
                        <div className="w-full bg-white border-t border-gray-700 lg:w-96 lg:border-t-0 lg:border-l lg:order-2 lg:overflow-y-auto">
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

            <ModalForUpgradeSubscription/>
        </div>  
    ) 
}

export default MallAcademy
