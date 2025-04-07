
import {
    combineReducers,
} from 'redux';

import { configureStore } from '@reduxjs/toolkit'
  
import authReducer from './auth/authReducer';

const RootReducer = combineReducers({
    AuthReducer:  authReducer
})

export default configureStore({
    reducer: RootReducer
})