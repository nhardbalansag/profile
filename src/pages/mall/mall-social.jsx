import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { Mail, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

const MallSocial = () => {

  const auth_states = useSelector(state => state.AuthReducer);

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
  },[auth_states])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 rounded-full sm:w-20 sm:h-20 bg-primary-500 blur-xl"></div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground">
            <span className="text-transparent bg-gradient-to-r from-primary via-primary to-accent bg-clip-text coming_label_id">
              Coming
            </span>
            <br />
            <span className="text-foreground soon_label_id">Soon</span>
            <br />
            {/* <span className="text-transparent bg-gradient-to-r from-accent via-primary to-primary bg-clip-text">
              is Coming
            </span> */}
          </h1>
        </div>

        {/* Footer */}
        <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
          <p className="text-sm text-center text-muted-foreground coming_soon_all_rights_reserved">
            © 2024 Coming Soon. All rights reserved.
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 rounded-full top-1/4 left-1/4 bg-primary/30 animate-bounce delay-0"></div>
        <div className="absolute w-1 h-1 delay-1000 rounded-full top-1/3 right-1/3 bg-primary/40 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute w-1 h-1 rounded-full top-1/2 right-1/4 bg-primary/30 animate-bounce delay-3000"></div>
      </div>
    </div>
  );
};

export default MallSocial;