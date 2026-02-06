import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";

import { 
  QrCode, 
  Shield, 
  Clock, 
  Copy, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Key,
  ChevronRight,
  X,
  RefreshCw,
  Download,
  Printer,
  Save,
  AlertTriangle,
  Lock,
  ShieldCheck,
  FileText,
  Check,
  Clipboard,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Edit2,
  Settings,
  User,
  HelpCircle,
  ArrowRight,
  ShieldOff,
  XCircle,
  UserCircle,
  Fingerprint,
  KeyRound,
  ShieldQuestion
} from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';

import * as api_account from '../../services/account/account.api.js'
import * as api_2factor from '../../services/two-factor/two-factor.api.js'

import * as AuthAction from '../../store/auth/authAction'

const env = import.meta.env;

// Helper functions defined at module level for reuse
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AccountCredentials = () =>{

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  const [twoFactorRequestLoading, setTwoFactorRequestLoading] = useState(false);
  const [getTwoFactor, setTwoFactor] = useState({
    two_factor_enabled_at: auth_states.TwoFactor?.two_factor_enabled_at ?? null,
    two_factor_confirmed_at: auth_states.TwoFactor?.two_factor_confirmed_at ?? null,
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    middle_name: "",
    nick_names: "",
    mobile_number: "",
    date_of_birth: "",
    gender: "",
    civil_status: "",
    nationality: "",
    current_address: "",
    city: "",
    postal_code: "",
    country_id: null,
    email: "",
    email_verified_at: null,
    users_is_deleted: false,
    users_is_active: true,
    pin: "",
    password: "",
    created_at: null,
    updated_at: null,
    user_profile:{
      upload_url:null
    }
  })

  const [getRetypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  useEffect(() => {
    GetUserDetails()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
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
  },[auth_states, isEditing, requestLoading, showPassword])

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const GetUserDetails = async() =>{
    setRequestLoading(true)
    setTwoFactorRequestLoading(true)

    try {
      const result = await api_account.GetUserDetails(auth_states.StateToken);
      if(result.status){
        Object.keys(result.data.data).map((item, key) =>{
          setUserData((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })

        if(result.data.data.params){
          Object.keys(result.data.data.params).map((item, key) =>{
            setUserData((prev) => ({
              ...prev,
              [item]: result.data.data.params[item]
            }));
          })
        }
        
        if(result.data.data.user_profile){
          // Assuming setCurrentPhoto is defined elsewhere
          // setCurrentPhoto(env.VITE_APP_BACKEND_STORAGE_URL + result.data.data.user_profile.upload_url);
        }

        const data = result.data.data;

        const twoFactor = {
          two_factor_enabled_at: data.two_factor_enabled_at,
          two_factor_confirmed_at: data.two_factor_confirmed_at,
        }

        dispatch(AuthAction.GetTwoFactorAuthentication(twoFactor))
     
        setTwoFactor((prev) => ({
          ...prev,
          two_factor_enabled_at: data.two_factor_enabled_at,
          two_factor_confirmed_at: data.two_factor_confirmed_at
        }));
      }
    } catch (err) {
      toast.error("Failed to load user details");
    } finally {
      setRequestLoading(false);
      setTwoFactorRequestLoading(false);
    }
  }

  const UpdateUserInformation = async () => {
    const reqBody = {
      pin: userData.pin || undefined,
    };

    setRequestLoading(true);

    try {
      const result = await api_account.UpdateUserInformation(auth_states.StateToken, reqBody);
      if (result.status) {
        toast.success("User information updated!");
        GetUserDetails(); // Refresh after update
        setIsEditing(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  }

  const UpdatePassword = async () => {
    if(getRetypePassword !== userData.password){
      toast.warning("Password Not Match");
      return;
    }

    const reqBody = {
      password: userData.password || undefined,
    };

    setRequestLoading(true);

    try {
      const result = await api_account.UpdateUserInformation(auth_states.StateToken, reqBody);
      if (result.status) {
        toast.success("User information updated!");
        GetUserDetails(); // Refresh after update
        setIsEditing(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  }

  const ProfileInfo = () =>{ 
    return(
      <div className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 pin_uppercase_label_id">PIN Settings</h3>
              <p className="text-sm text-gray-500">Manage your account PIN for secure access</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 pin_uppercase_label_id">PIN Code</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={userData.pin}
                      onChange={(e) => handleInputChange("pin", e.target.value)}
                      className="w-full px-4 py-3 pl-12 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter 4-6 digit PIN"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Fingerprint className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Use 4-6 digits for your PIN</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => UpdateUserInformation()}
                  disabled={requestLoading}
                  className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {requestLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span className='update_pin_label_id'>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className='update_pin_label_id'>Update</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current PIN</p>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1,2,3,4].map((dot, index) => (
                      <div key={index} className="w-3 h-3 mx-1 bg-gray-400 rounded-full"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">••••</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
              >
                <Edit2 className="w-4 h-4" />
                <span className='edit_label_id'>Change PIN</span>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const PasswordComponent = () =>{ 
    return(
      <div className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 password_label_id">Password Security</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-5">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 password_label_id">New Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center space-x-1 text-sm text-blue-600 transition-colors hover:text-blue-800"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPassword ? <span className='hide_label_id'>Hide</span> : <span className='show_label_id'>Show</span>}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full px-4 py-3 pl-12 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 confirm_password_label_id">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={getRetypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      className="w-full px-4 py-3 pl-12 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Re-enter password"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyRound className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => UpdatePassword()}
                  disabled={requestLoading}
                  className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {requestLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span className='update_password_label_id'>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className='update_password_label_id'>Update</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Password last updated</p>
                <p className="text-sm text-gray-600">A few moments ago</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
              >
                <Edit2 className="w-4 h-4" />
                <span className='edit_label_id'>Change</span>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between mb-6 md:items-center md:flex-row">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl setup_credentials_label_id">Account Security</h1>
                <p className="mt-1 text-gray-600 manage_your_wallet_label_id">Manage your credentials and security settings</p>
              </div>
              
              <div className="flex items-center mt-4 space-x-3 md:mt-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-lg transition-all ${
                    isEditing
                      ? 'text-green-700 bg-green-50 border border-green-200 hover:bg-green-100'
                      : 'text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="done_label_id">Done Editing</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className='edit_label_id'>Edit Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
              <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 bg-purple-100 rounded-lg">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">Recently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {ProfileInfo()}
              
              {/* Security Tips Card */}
              <div className="p-5 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center mb-4 space-x-3">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Tips</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500" />
                    <span className="text-sm text-gray-700">Use a strong, unique password</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500" />
                    <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500" />
                    <span className="text-sm text-gray-700">Never share your PIN or password</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500" />
                    <span className="text-sm text-gray-700">Regularly update your credentials</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {PasswordComponent()}
              
              {/* Two-Factor Status Card */}
              <div className={`rounded-xl border p-5 ${getTwoFactor.two_factor_confirmed_at ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTwoFactor.two_factor_confirmed_at ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {getTwoFactor.two_factor_confirmed_at ? (
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <ShieldQuestion className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        {getTwoFactor.two_factor_confirmed_at ? "Enabled - High Security" : "Not Enabled - Recommended"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTwoFactor.two_factor_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {getTwoFactor.two_factor_confirmed_at ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="mb-4 text-sm text-gray-700">
                  {getTwoFactor.two_factor_confirmed_at 
                    ? "Your account is protected with an extra layer of security. 2FA is currently active."
                    : "Add an extra layer of security to your account. Enable 2FA to protect your account from unauthorized access."
                  }
                </p>
                
                <button
                  onClick={() => {
                    const twoFactorSection = document.querySelector('[data-2fa-section]');
                    twoFactorSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-2.5 font-medium rounded-lg transition-all ${
                    getTwoFactor.two_factor_confirmed_at
                      ? 'text-green-700 bg-white border border-green-200 hover:bg-green-50'
                      : 'text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                  }`}
                >
                  {getTwoFactor.two_factor_confirmed_at ? "Manage 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-8">
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center mb-4 space-x-3">
                <UserCircle className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${userData.users_is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-900">
                      {userData.users_is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const TwoFactorSetup = () => {
    const recoveryCodesRef = useRef(null);

    // Initial state structure
    const [enableTwoFactor, setEnableTwoFactor] = useState({
      isSetup: false,
      data: null,
      isLoading: false,
      error: null,
      verificationCode: '',
      isVerifying: false,
      isCancelling: false,
      success: false,
      showSecret: false,
      countdown: 1800,
      showMobileInstructions: false,
      recoveryCodes: null,
      showAllRecoveryCodes: false,
      showAllBackupCodes: false,
      codesCopied: false,
      codesDownloaded: false,
      hideCodes: false,
      message: "",
      actions: "",
    });

    // requests
    const requestEnable2FA = async () =>{
      setEnableTwoFactor(prev => ({
        ...prev,
        isSetup: true,
        isLoading: true,
        success: true,
      }));

      try {
        const result = await api_2factor.Enable(auth_states.StateToken);
        if(result.status){
          if (!enableTwoFactor.isSetup && !enableTwoFactor.data) {
            setEnableTwoFactor(prev => ({
              ...prev,
              data: result.data.data,
              isLoading: false,
              message: result.data.message,
              actions: result.data.actions,
              countdown: result.data.data.expires_in
            }));
          }
        }
      } catch (err) {
        toast.error("Something went wrong");
        setEnableTwoFactor(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    }

    // Countdown timer for setup expiration
    useEffect(() => {
      if (!enableTwoFactor.isSetup || enableTwoFactor.countdown <= 0) return;

      const timer = setInterval(() => {
        setEnableTwoFactor(prev => ({
          ...prev,
          countdown: prev.countdown > 0 ? prev.countdown - 1 : 0
        }));
      }, 1000);

      return () => clearInterval(timer);
    }, [enableTwoFactor.isSetup]);

    // Update verification code
    const handleCodeChange = (code) => {
      setEnableTwoFactor(prev => ({
        ...prev,
        verificationCode: code.replace(/\D/g, '').slice(0, 6)
      }));
    };

    // Toggle secret visibility
    const toggleSecretVisibility = () => {
      setEnableTwoFactor(prev => ({
        ...prev,
        showSecret: !prev.showSecret
      }));
    };

    // Toggle mobile instructions
    const toggleMobileInstructions = () => {
      setEnableTwoFactor(prev => ({
        ...prev,
        showMobileInstructions: !prev.showMobileInstructions
      }));
    };

    // Handle verification submission
    const handleVerify = async (e) => {
      e.preventDefault();
      
      if (!enableTwoFactor.verificationCode.trim() || enableTwoFactor.verificationCode.length !== 6) {
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Please enter a valid 6-digit verification code'
        }));
        return;
      }

      setEnableTwoFactor(prev => ({
        ...prev,
        isVerifying: true,
        error: null
      }));

      const requestBody = {
        code: enableTwoFactor.verificationCode,
      }

      try {
        const result = await api_2factor.EnableConfirmation(requestBody, auth_states.StateToken);
        if(result.status){
          GetUserDetails()

          setEnableTwoFactor(prev => ({
            ...prev,
            success: true,
            isVerifying: false,
            isSetup: false,
            recoveryCodes: result.data.data,
            hideCodes: true
          }));  

          setTimeout(() => {
            recoveryCodesRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (err) {
        toast.error("Something went wrong");
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Verification failed. Please try again.',
          isVerifying: false
        }));
      }
    }

    // Handle cancellation
    const handleCancel = async () => {
      if (!window.confirm('Are you sure you want to cancel 2FA setup?')) return;

      setEnableTwoFactor(prev => ({
        ...prev,
        isCancelling: true,
        error: null
      }));

      try {
        const result = await api_2factor.Cancel2FactorSetup(auth_states.StateToken);
        if(result.status){
          setEnableTwoFactor(prev => ({
            ...prev,
            isSetup: false,
            data: null,
            isCancelling: false,
            success: false
          }));
        }
      } catch (err) {
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Failed to cancel setup. Please try again.',
          isCancelling: false
        }));
      }
    };

    // Copy to clipboard function
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        const originalError = enableTwoFactor.error;
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Copied to clipboard!'
        }));
        
        setTimeout(() => {
          setEnableTwoFactor(prev => ({
            ...prev,
            error: originalError
          }));
        }, 2000);
      }).catch(err => {
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Failed to copy to clipboard'
        }));
      });
    };
    
    // Reset 2FA setup
    const resetSetup = () => {
      setEnableTwoFactor({
        isSetup: false,
        data: null,
        isLoading: false,
        error: null,
        verificationCode: '',
        isVerifying: false,
        isCancelling: false,
        success: false,
        showSecret: false,
        countdown: 1800,
        showMobileInstructions: false,
        recoveryCodes: null,
        showAllRecoveryCodes: false,
        showAllBackupCodes: false,
        codesCopied: false,
        codesDownloaded: false,
        hideCodes: false
      });
    };

    // Copy all recovery codes to clipboard
    const copyAllRecoveryCodes = () => {
      if (!enableTwoFactor.recoveryCodes) return;
      
      const allCodes = [
        '=== RECOVERY CODES ===',
        ...enableTwoFactor.recoveryCodes.recovery_codes,
        '',
        '=== BACKUP CODES ===',
        ...enableTwoFactor.recoveryCodes.backup_codes,
        '',
        `Generated: ${new Date().toLocaleString()}`,
        'Keep these codes secure!'
      ].join('\n');

      navigator.clipboard.writeText(allCodes).then(() => {
        setEnableTwoFactor(prev => ({
          ...prev,
          codesCopied: true
        }));
        
        setTimeout(() => {
          setEnableTwoFactor(prev => ({
            ...prev,
            codesCopied: false
          }));
        }, 3000);
      }).catch(err => {
        setEnableTwoFactor(prev => ({
          ...prev,
          error: 'Failed to copy codes to clipboard'
        }));
      });
    };

    // Download recovery codes as text file
    const downloadRecoveryCodes = () => {
      if (!enableTwoFactor.recoveryCodes) return;
      
      const content = [
        '========================================',
        '      2FA RECOVERY CODES',
        '========================================',
        '',
        'IMPORTANT: Save these codes in a secure place.',
        'They will not be shown again.',
        '',
        'RECOVERY CODES (10-digit):',
        '--------------------------',
        ...enableTwoFactor.recoveryCodes.recovery_codes.map(code => `  ${code}`),
        '',
        'BACKUP CODES (8-digit):',
        '----------------------',
        ...enableTwoFactor.recoveryCodes.backup_codes.map(code => `  ${code}`),
        '',
        '========================================',
        `Generated: ${new Date().toLocaleString()}`,
        'Account: Your Account',
        '========================================',
        '',
        'SECURITY TIPS:',
        '• Store in a password manager',
        '• Print and keep in a safe',
        '• Do not store digitally in plain text',
        '• Each code can be used once',
        '========================================'
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `2fa-recovery-codes-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setEnableTwoFactor(prev => ({
        ...prev,
        codesDownloaded: true
      }));

      setTimeout(() => {
        setEnableTwoFactor(prev => ({
          ...prev,
          codesDownloaded: false
        }));
      }, 3000);
    };

    // Print recovery codes
    const printRecoveryCodes = () => {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>2FA Recovery Codes</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .codes-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
            }
            .code {
              font-family: 'Courier New', monospace;
              background: #f8fafc;
              padding: 10px;
              border-radius: 6px;
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body { font-size: 12pt; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 2FA Recovery Codes</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="warning">
            <h3>⚠️ IMPORTANT WARNING</h3>
            <p>${enableTwoFactor.recoveryCodes?.warning || 'Save these codes in a secure place. They will not be shown again.'}</p>
          </div>
          
          <h2>Recovery Codes (10-digit)</h2>
          <div class="codes-grid">
            ${enableTwoFactor.recoveryCodes?.recovery_codes.map(code => `
              <div class="code">${code}</div>
            `).join('')}
          </div>
          
          <h2>Backup Codes (8-digit)</h2>
          <div class="codes-grid">
            ${enableTwoFactor.recoveryCodes?.backup_codes.map(code => `
              <div class="code">${code}</div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p><strong>Security Notes:</strong></p>
            <ul>
              <li>Each code can be used only once</li>
              <li>Store in a secure password manager</li>
              <li>Print and keep in a physical safe</li>
              <li>Do not store digitally in plain text</li>
              <li>Regenerate codes if compromised</li>
            </ul>
          </div>
          
          <div class="no-print">
            <p style="text-align: center; color: #94a3b8; margin-top: 40px;">
              This document contains sensitive information. Keep it secure.
            </p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    // Hide recovery codes (user confirms they've saved them)
    const handleHideCodes = () => {
      setEnableTwoFactor(prev => ({
        ...prev,
        hideCodes: true
      }));
    };

    const StartUpUIForNotEnabledAuthenticator = () =>{
      return (
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="p-6 mb-5 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">Two-Factor Authentication Setup</h1>
                <p className="text-blue-100">{enableTwoFactor.message}</p>
              </div>
              <div className="items-center hidden px-4 py-2 rounded-lg md:flex bg-white/20 backdrop-blur-sm">
                <Clock className="w-4 h-4 mr-2 text-white" />
                <span className="font-medium text-white">
                  Expires: <span className="text-red-200">{formatTime(enableTwoFactor.countdown)}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="">
            {/* Mobile Timer Alert */}
            <div className="my-6 md:hidden">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      Setup expires in <span className="font-bold text-red-600">{formatTime(enableTwoFactor.countdown)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {enableTwoFactor.error && (
              <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3 text-red-600" />
                  <p className="text-sm text-red-700">{enableTwoFactor.error}</p>
                </div>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2 ">
              {/* QR Code Section */}
              <div className="space-y-6">
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                      <QrCode className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Scan QR Code</h2>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-64 h-64">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <QRCode
                          value={enableTwoFactor.data?.qr_code_url}
                          size={180}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <button
                        onClick={toggleMobileInstructions}
                        className="flex items-center justify-between w-full p-3 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                      >
                        <span className="font-medium text-blue-700">Setup Instructions</span>
                        <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${enableTwoFactor.showMobileInstructions ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {enableTwoFactor.showMobileInstructions && (
                        <div className="p-4 mt-3 space-y-3 border border-gray-100 rounded-lg bg-gray-50">
                          {enableTwoFactor.data?.instructions && Object.entries(enableTwoFactor.data.instructions).map(([key, instruction]) => (
                            <div key={key} className="flex items-start">
                              <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                {key}
                              </span>
                              <p className="text-sm text-gray-700">{instruction}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Setup Section */}
              <div className="space-y-6">
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="p-2 mr-3 bg-purple-100 rounded-lg">
                      <Key className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Manual Setup</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Secret Key */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Secret Key
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative flex-1">
                          <input
                            type={enableTwoFactor.showSecret ? 'text' : 'password'}
                            value={enableTwoFactor.showSecret ? enableTwoFactor.data?.secret : '•'.repeat(32)}
                            readOnly
                            className="w-full px-4 py-3 pl-12 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Key className="w-5 h-5 text-gray-400" />
                          </div>
                          <button
                            onClick={toggleSecretVisibility}
                            className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                          >
                            {enableTwoFactor.showSecret ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => copyToClipboard(enableTwoFactor.data?.secret || '')}
                          className="flex items-center justify-center px-4 py-3 text-white transition-colors bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Verification Card */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="p-2 mr-3 bg-green-100 rounded-lg">
                          <Smartphone className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Verify Setup</h2>
                      </div>

                      <form onSubmit={handleVerify}>
                        <div className="mb-6">
                          <label htmlFor="verificationCode" className="block mb-3 text-sm font-medium text-gray-700">
                            Enter 6-digit code from your authenticator app
                          </label>
                          
                          <div className="relative">
                            <input
                              type="text"
                              id="verificationCode"
                              value={enableTwoFactor.verificationCode}
                              onChange={(e) => handleCodeChange(e.target.value)}
                              placeholder="123456"
                              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-[0.5em] font-medium bg-gray-50"
                              maxLength={6}
                              pattern="\d{6}"
                              required
                            />
                            <div className="absolute inset-y-0 flex items-center pointer-events-none right-4">
                              <Smartphone className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            type="submit"
                            disabled={enableTwoFactor.isVerifying}
                            className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {enableTwoFactor.isVerifying ? (
                              <>
                                <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Verify Setup
                              </>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={enableTwoFactor.isCancelling}
                            className="w-full px-6 py-3 font-medium text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {enableTwoFactor.isCancelling ? 'Cancelling...' : enableTwoFactor.actions.cancel?.description || 'Cancel Setup'}
                          </button>
                        </div>
                      </form>

                      {/* Tips Section */}
                      <div className="pt-6 mt-6 border-t border-gray-200">
                        <h3 className="flex items-center mb-3 font-semibold text-gray-700">
                          <span className="mr-2">💡</span>
                          Tips for Success
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-start p-3 rounded-lg bg-blue-50">
                            <span className="mr-2 text-blue-600">•</span>
                            <span className="text-sm text-gray-700">Ensure device time is synchronized</span>
                          </div>
                          <div className="flex items-start p-3 rounded-lg bg-blue-50">
                            <span className="mr-2 text-blue-600">•</span>
                            <span className="text-sm text-gray-700">Save backup codes securely</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const NotEnabledUI = () =>{
      return (
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
              <div className="p-5">
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="mb-3 text-2xl font-bold text-gray-900">
                    Enable Two-Factor Authentication
                  </h1>
                  <p className="text-gray-600">
                    Add an extra layer of security to your account. You'll need an authenticator app to generate codes.
                  </p>
                </div>

                <div className="mb-8 space-y-3">
                  <div className="flex items-center p-3 border border-blue-100 rounded-lg bg-blue-50">
                    <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-sm text-gray-700">Use Google Authenticator or Authy</span>
                  </div>
                  <div className="flex items-center p-3 border border-blue-100 rounded-lg bg-blue-50">
                    <QrCode className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-sm text-gray-700">Quick setup with QR code</span>
                  </div>
                  <div className="flex items-center p-3 border border-blue-100 rounded-lg bg-blue-50">
                    <Key className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-sm text-gray-700">Manual entry option available</span>
                  </div>
                </div>

                <button
                  onClick={() => requestEnable2FA()}
                  disabled={twoFactorRequestLoading}
                  className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                >
                  {
                    twoFactorRequestLoading
                    ? <span>Loading Setup</span>
                    : <span>Start Setup</span>
                  }

                  {
                    twoFactorRequestLoading 
                    ? <span className="loading loading-spinner loading-sm"></span> 
                    : <ChevronRight className="w-5 h-5 ml-2" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const SuccessfulSetupProcess = () =>{
      return (
        <div ref={recoveryCodesRef} className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
            {/* Success Banner */}
            <div className="mb-8">
              <div className="overflow-hidden shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                <div className="p-8">
                  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-16 h-16 mr-6 rounded-full bg-white/20 backdrop-blur-sm">
                        <ShieldCheck className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="mb-2 text-2xl font-bold text-white">
                          2FA Successfully Enabled!
                        </h1>
                        <p className="text-green-100">
                          Your account is now protected with two-factor authentication
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleHideCodes}
                      className="flex items-center px-6 py-3 font-medium text-green-700 transition-colors bg-white rounded-xl hover:bg-green-50"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      I've Saved My Codes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="mb-8">
              <div className="p-6 border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl">
                <div className="flex items-start">
                  <AlertTriangle className="flex-shrink-0 w-6 h-6 mr-4 text-red-600" />
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-red-800">
                      ⚠️ CRITICAL: Save Your Recovery Codes
                    </h3>
                    <p className="mb-3 text-red-700">
                      {enableTwoFactor.recoveryCodes.warning}
                    </p>
                    <div className="space-y-2 text-sm text-red-600">
                      <p>• If you lose access to your authenticator app, these codes are your only backup</p>
                      <p>• Each code can be used only once</p>
                      <p>• This is the only time these codes will be displayed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recovery Codes Card */}
              <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-white" />
                      <h2 className="text-xl font-bold text-white">
                        Recovery Codes
                      </h2>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/20">
                      <span className="text-sm font-medium text-white">
                        {enableTwoFactor.recoveryCodes.recovery_codes.length} codes
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-blue-100">
                    10-digit codes for account recovery
                  </p>
                </div>

                <div className="p-6">
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-3">
                    <button
                      onClick={copyAllRecoveryCodes}
                      className="flex items-center justify-center p-3 text-blue-700 transition-colors bg-blue-50 rounded-xl hover:bg-blue-100"
                    >
                      {enableTwoFactor.codesCopied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <>
                          <Clipboard className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Copy All</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadRecoveryCodes}
                      className="flex items-center justify-center p-3 text-green-700 transition-colors bg-green-50 rounded-xl hover:bg-green-100"
                    >
                      {enableTwoFactor.codesDownloaded ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Download</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={printRecoveryCodes}
                      className="flex items-center justify-center col-span-2 p-3 text-purple-700 transition-colors bg-purple-50 rounded-xl hover:bg-purple-100 md:col-span-1"
                    >
                      <Printer className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Print</span>
                    </button>
                  </div>

                  {/* Codes Grid */}
                  <div className="space-y-3">
                    {enableTwoFactor.recoveryCodes.recovery_codes.slice(0, 
                      enableTwoFactor.showAllRecoveryCodes ? undefined : 3
                    ).map((code, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 mr-4 text-blue-800 bg-blue-100 rounded-lg">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <code className="font-mono text-lg tracking-wider text-gray-800">
                            {code}
                          </code>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(code)}
                          className="p-2 text-gray-500 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {enableTwoFactor.recoveryCodes.recovery_codes.length > 3 && (
                    <button
                      onClick={() => setEnableTwoFactor(prev => ({
                        ...prev,
                        showAllRecoveryCodes: !prev.showAllRecoveryCodes
                      }))}
                      className="flex items-center justify-center w-full p-3 mt-4 text-blue-600 transition-colors hover:bg-blue-50 rounded-xl"
                    >
                      {enableTwoFactor.showAllRecoveryCodes ? (
                        <>
                          <ChevronUp className="w-5 h-5 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5 mr-2" />
                          Show All {enableTwoFactor.recoveryCodes.recovery_codes.length} Codes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Backup Codes Card */}
              <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-white" />
                      <h2 className="text-xl font-bold text-white">
                        Backup Codes
                      </h2>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/20">
                      <span className="text-sm font-medium text-white">
                        {enableTwoFactor.recoveryCodes.backup_codes.length} codes
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-purple-100">
                    8-digit codes for emergency access
                  </p>
                </div>

                <div className="p-6">
                  {/* Security Info */}
                  <div className="p-4 mb-6 border border-purple-200 bg-purple-50 rounded-xl">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="mb-2 font-medium text-purple-800">
                          Additional Security Layer
                        </h4>
                        <p className="text-sm text-purple-700">
                          These backup codes provide an extra layer of security beyond your recovery codes.
                          Store them separately for maximum protection.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Backup Codes Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {enableTwoFactor.recoveryCodes.backup_codes.slice(0,
                      enableTwoFactor.showAllBackupCodes ? undefined : 4
                    ).map((code, index) => (
                      <div key={index} className="relative group">
                        <div className="p-4 transition-colors border border-gray-200 bg-gray-50 rounded-xl hover:border-purple-300">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">Code #{index + 1}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(code)}
                              className="p-1 text-gray-400 transition-opacity rounded opacity-0 group-hover:opacity-100 hover:text-purple-600"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <code className="block font-mono text-lg font-bold tracking-wider text-center text-gray-800">
                            {code}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>

                  {enableTwoFactor.recoveryCodes.backup_codes.length > 4 && (
                    <button
                      onClick={() => setEnableTwoFactor(prev => ({
                        ...prev,
                        showAllBackupCodes: !prev.showAllBackupCodes
                      }))}
                      className="flex items-center justify-center w-full p-3 text-purple-600 transition-colors hover:bg-purple-50 rounded-xl"
                    >
                      {enableTwoFactor.showAllBackupCodes ? (
                        <>
                          <ChevronUp className="w-5 h-5 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5 mr-2" />
                          Show All {enableTwoFactor.recoveryCodes.backup_codes.length} Codes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8">
              <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex-1">
                    <h3 className="mb-2 font-bold text-gray-900">Next Steps</h3>
                    <p className="text-gray-600">
                      Make sure you've saved your codes before proceeding. You won't be able to see them again.
                    </p>
                  </div>
                  <div className="flex flex-col w-full gap-3 sm:flex-row md:w-auto">
                    <button
                      onClick={handleHideCodes}
                      className="flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      I've Saved My Codes
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center px-6 py-3 font-medium text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      <Printer className="w-5 h-5 mr-2" />
                      Print This Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (enableTwoFactor.isLoading) {
      return (
        <div className="mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading 2FA setup...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8 ">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
        </div>
        
        <div className="">
          {!enableTwoFactor.isSetup && !enableTwoFactor.success
            ? NotEnabledUI()
            : enableTwoFactor.data && enableTwoFactor.recoveryCodes
            ? SuccessfulSetupProcess()
            : StartUpUIForNotEnabledAuthenticator()}
        </div>
      </div>
    );
  }

  const TwoFactorAlreadyEnabled = () => {
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [recoveryCodesVisible, setRecoveryCodesVisible] = useState(false);
    const [isRegeneratingCodes, setIsRegeneratingCodes] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [actionStatus, setActionStatus] = useState({
      type: null,
      message: '',
      isSuccess: false
    });

    const [twoFactorRecoveryCodeRequestLoading, setTwoFactorRecoveryCodeRequestLoading] = useState(false);
   
    const [twoFactorData, settwoFactorData] = useState({
      error: "already_enabled",
      message: "Two-factor authentication is already enabled.",
      enabledSince: "",
      lastUsed: "",
      deviceCount: 1,
      recoveryCodesRemaining: 0,
      backupCodes: [],
      authenticatorApps: [""],
      canDisable: true,
      securityLevel: "high"
    })

    useEffect(() => {
      handleShowBackupVerificationCode()
    },[])

    // Handle verify
    const handleShowBackupVerificationCode = async () => {
      setTwoFactorRecoveryCodeRequestLoading(true)

      try {
        const result = await api_2factor.ShowBackupVerificationCode(auth_states.StateToken);
        if(result.status){
          const data = result.data.data

          settwoFactorData(prev => ({
            ...prev,
            backupCodes: data.recovery_codes?.filter(item => item?.used == false) ?? [],
            recoveryCodesRemaining: data.recovery_codes?.filter(item => item?.used == false).length ?? 0,
            enabledSince: data.enabledSince ?? "",
            lastUsed: data.lastUsed ?? ""
          }))
        }
      } catch (error) {
        toast.error("Failed to load recovery codes");
      } finally {
        setTwoFactorRecoveryCodeRequestLoading(false)
      }
    }

    // Handle regenerate recovery codes
    const handleRegenerateCodes = async() => {
      if (!window.confirm(
        "Are you sure you want to generate new recovery codes?\n\n" +
        "⚠️ Your old recovery codes will no longer work.\n" +
        "⚠️ You must save the new codes immediately."
      )) return;

      setIsRegeneratingCodes(true);
      setTwoFactorRecoveryCodeRequestLoading(true)

      try {
        const result = await api_2factor.GenerateBackupCode(auth_states.StateToken);
        if(result.status){
          const data = result.data.data

          settwoFactorData(prev => ({
            ...prev,
            backupCodes: data?.backup_codes ?? [],
            recoveryCodesRemaining: data?.backup_codes?.length ?? 0
          }))

          setActionStatus({
            type: 'regenerate',
            message: 'New recovery codes generated successfully! Make sure to save them.',
            isSuccess: true
          });

          setTimeout(() => {
            setActionStatus({ type: null, message: '', isSuccess: false });
          }, 5000);
        }
      } catch (error) {
        toast.error("Failed to regenerate codes");
      } finally {
        setIsRegeneratingCodes(false);
        setTwoFactorRecoveryCodeRequestLoading(false)
      }
    }

    // Handle disable 2FA
    const handleDisable2FA = async() => {
      if (!showDisableConfirm) {
        setShowDisableConfirm(true);
        return;
      }

      setIsDisabling(true);

      try {
        const result = await api_2factor.Disable2Factor(auth_states.StateToken);
        if(result.status){
          GetUserDetails()
          
          setIsDisabling(false);
          setShowDisableConfirm(false);
          setActionStatus({
            type: 'disable',
            message: 'Two-factor authentication has been disabled.',
            isSuccess: true
          });
        }
      } catch (err) {
        toast.error("Failed to disable 2FA");
        setIsDisabling(false);
      }
    };

    // Handle copy recovery codes
    const handleCopyCodes = () => {
      const codesText = Array.isArray(twoFactorData.backupCodes)
      ? twoFactorData.backupCodes
          .filter(item => item?.code && item.used === false)
          .map(item => item.code)
          .join(', ')
      : '';

      navigator.clipboard.writeText(codesText).then(() => {
        setActionStatus({
          type: 'copy',
          message: 'Recovery codes copied to clipboard!',
          isSuccess: true
        });
        
        setTimeout(() => {
          setActionStatus({ type: null, message: '', isSuccess: false });
        }, 3000);
      });
    };

    // Handle download recovery codes
  const handleDownloadCodes = () => {
     const content =
      `Two-Factor Authentication Recovery Codes\n\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Account: Your Account\n\n` +
      `RECOVERY CODES (save these securely):\n` +
      twoFactorData.backupCodes
        .filter(item => item?.code && item.used === false)
        .map(item => item.code)
        .join(', ') +
      `\n\n` +
      `IMPORTANT:\n` +
      `• Each code can be used only once\n` +
      `• Store in a secure location\n` +
      `• Do not share these codes`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `2fa-recovery-codes-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const renderTabContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Enabled Since</p>
                      <p className="font-semibold text-gray-900">
                        {!twoFactorRecoveryCodeRequestLoading ? formatDate(twoFactorData.enabledSince).split(' at ')[0] : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-purple-100 rounded-lg">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Used</p>
                      <p className="font-semibold text-gray-900">
                        { twoFactorData.lastUsed ? formatDate(twoFactorData.lastUsed).split(' at ')[0] : "Just Now"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 bg-orange-100 rounded-lg">
                      <Key className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recovery Codes</p>
                      {
                        !twoFactorRecoveryCodeRequestLoading
                        ?
                          <p className="font-semibold text-gray-900">
                            { twoFactorData.recoveryCodesRemaining } remaining
                          </p>
                        :
                          <p className="font-semibold text-gray-900">
                            Loading...
                          </p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {
                    twoFactorRecoveryCodeRequestLoading
                    ?
                      <div className="p-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-24 h-3 mt-1 bg-gray-100 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    :
                      <button
                        onClick={() => setShowRecoveryCodes(true)}
                        className="flex items-center justify-between p-4 text-left transition-colors border border-gray-300 rounded-xl hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">View Recovery Codes</p>
                            <p className="text-sm text-gray-500">Access your backup codes</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>
                  }

                  <button
                    onClick={handleRegenerateCodes}
                    disabled={isRegeneratingCodes}
                    className="flex items-center justify-between p-4 text-left transition-colors border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-orange-100 rounded-lg">
                        <RefreshCw className={`w-5 h-5 text-orange-600 ${isRegeneratingCodes ? 'animate-spin' : ''}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Regenerate Codes</p>
                        <p className="text-sm text-gray-500">Create new recovery codes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setShowDisableConfirm(true)}
                    className="flex items-center justify-between p-4 text-left transition-colors border border-red-300 rounded-xl hover:bg-red-50"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-red-100 rounded-lg">
                        <ShieldOff className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Disable 2FA</p>
                        <p className="text-sm text-red-600">Turn off two-factor authentication</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="mb-8">
        <div className="mb-6 border-b border-gray-100 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600">Your account is protected with 2FA</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
              Active
            </span>
          </div>
        </div>

        <div className="">
          {/* Alert Banner */}
          <div className="mb-6">
            <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
              <div className="flex items-start">
                <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    Two-Factor Authentication Already Enabled
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your account already has two-factor authentication enabled. You can manage your 
                    settings, view recovery codes, or disable 2FA below.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Status */}
          {actionStatus.message && (
            <div className={`mb-6 p-4 rounded-xl ${
              actionStatus.isSuccess 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {actionStatus.isSuccess ? (
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                )}
                <p className={actionStatus.isSuccess ? 'text-green-800' : 'text-red-800'}>
                  {actionStatus.message}
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mr-3" />
                    Overview
                  </button>
                  
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    {
                      twoFactorRecoveryCodeRequestLoading
                      ?
                        <div className="px-3 py-2.5">
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      :
                        <button
                          onClick={() => setShowRecoveryCodes(true)}
                          className="w-full flex items-center px-3 py-2.5 text-orange-700 transition-colors hover:bg-orange-50 rounded-lg"
                        >
                          <Key className="w-4 h-4 mr-3" />
                          Recovery Codes
                        </button>
                    }
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Recovery Codes Modal */}
        {showRecoveryCodes && (
          <div style={{zIndex: 3000}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Key className="w-6 h-6 mr-3 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-900">Recovery Codes</h2>
                  </div>
                  <button
                    onClick={() => setShowRecoveryCodes(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Warning */}
                <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                  <div className="flex items-start">
                    <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3 text-red-600" />
                    <div>
                      <h3 className="mb-1 font-bold text-red-800">Important Security Notice</h3>
                      <p className="text-sm text-red-700">
                        These codes are for emergency access. Each code can be used only once. 
                        Store them securely and never share them with anyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Codes */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Your Backup Codes</h3>
                    <button
                      onClick={() => setRecoveryCodesVisible(!recoveryCodesVisible)}
                      className="flex items-center text-sm text-blue-600"
                    >
                      {recoveryCodesVisible ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide Codes
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Show Codes
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {twoFactorData.backupCodes.map((code, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">Code {index + 1}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(code.code)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <code className="block font-mono text-lg font-bold tracking-wider text-center">
                          {recoveryCodesVisible ? code.code : '••••••••••'}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remaining Count */}
                <div className="p-4 mb-6 border border-blue-200 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800">Remaining Codes</p>
                      <p className="text-sm text-blue-700">
                        {twoFactorData.recoveryCodesRemaining} of {twoFactorData.backupCodes.length} codes available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-700">Last viewed: Just now</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-3">
                  <button
                    onClick={() => handleCopyCodes()}
                    className="flex items-center justify-center p-3 text-blue-700 transition-colors bg-blue-50 rounded-xl hover:bg-blue-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </button>
                  <button
                    onClick={() => handleDownloadCodes()}
                    className="flex items-center justify-center p-3 text-green-700 transition-colors bg-green-50 rounded-xl hover:bg-green-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center p-3 text-purple-700 transition-colors bg-purple-50 rounded-xl hover:bg-purple-100"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => handleRegenerateCodes()}
                    disabled={isRegeneratingCodes}
                    className="flex items-center justify-center flex-1 py-3 font-medium text-orange-700 border-2 border-orange-300 hover:bg-orange-50 rounded-xl disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRegeneratingCodes ? 'animate-spin' : ''}`} />
                    {isRegeneratingCodes ? 'Generating...' : 'Generate New Codes'}
                  </button>
                  <button
                    onClick={() => setShowRecoveryCodes(false)}
                    className="flex-1 py-3 font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disable Confirmation Modal */}
        {showDisableConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
              <div className="p-6">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                    <ShieldOff className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h2 className="mb-2 text-xl font-bold text-gray-900">
                    Disable Two-Factor Authentication?
                  </h2>
                  
                  <p className="text-gray-600">
                    This will remove the extra security layer from your account.
                  </p>
                </div>

                {/* Warning */}
                <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                  <div className="flex items-start">
                    <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3 text-red-600" />
                    <div>
                      <h3 className="mb-1 font-bold text-red-800">Security Risk</h3>
                      <p className="text-sm text-red-700">
                        Disabling 2FA makes your account more vulnerable to unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Check */}
                <div className="mb-6">
                  <label className="flex items-start p-4 border border-gray-300 cursor-pointer rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="mt-1 mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">I understand the risks</p>
                      <p className="mt-1 text-sm text-gray-500">
                        I acknowledge that disabling 2FA will reduce my account security
                      </p>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => handleDisable2FA()}
                    disabled={isDisabling}
                    className="flex items-center justify-center flex-1 py-3 font-medium text-white transition-colors bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDisabling ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        Disabling...
                      </>
                    ) : (
                      'Disable 2FA'
                    )}
                  </button>
                  <button
                    onClick={() => setShowDisableConfirm(false)}
                    className="flex-1 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
        <div data-2fa-section>
          {
            twoFactorRequestLoading
            ?
              <div className="mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-sm text-gray-600">Loading security information...</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <div className="inline-block w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <p className="mt-4 text-gray-600">Loading security settings...</p>
                    </div>
                  </div>
                </div>
              </div>
            :
              getTwoFactor.two_factor_confirmed_at &&
              getTwoFactor.two_factor_enabled_at 
              ? <TwoFactorAlreadyEnabled/>
              : <TwoFactorSetup/>
          }
        </div>
        
        <div className="mt-8">
          {_AccountDetails()}
        </div>
      </div>
      
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>  
  ) 
}

export default AccountCredentials