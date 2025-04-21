import React, {useEffect } from 'react'
import {useSelector} from 'react-redux';
import Logo2 from '../../assets/images/ten/logo2.png'

function BottomCreateAccountFloat({noThanks, onPressAction}) {

    //#region translation convertion
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
        }})
    },[auth_states])
    //#endregion

    return (
        <div className="fixed bottom-10 w-[75%] max-w-sm p-4 bg-white shadow-lg rounded-xl z-50">
            <div className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                    <img
                    className="w-[60px] md:w-[100px]"
                    alt="Tailwind CSS chat bubble component"
                    src={Logo2} />
                </div>
                {/* Text Content */}
                <div className="flex-1">
                    <p className="text-sm font-semibold earn_more_points_id">Earn more points</p>
                    <p className="text-xs text-gray-600 members_could_save_id">
                        Members could save time and money finding great deals.
                    </p>
                </div>
            </div>

            {/* Button */}
            <div className="mt-4">
                <button onClick={onPressAction} className="w-full py-2 text-sm font-semibold border rounded-lg bg-[#063970]">
                    <p className='text-white create_account'>Create account</p>
                </button>
                <button onClick={noThanks} className="w-full py-2 text-sm no_thanks">
                No, Thanks
                </button>
            </div>
        </div>
    )
}

export default BottomCreateAccountFloat