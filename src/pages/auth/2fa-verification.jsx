import React, { useEffect, useRef, useState } from 'react'

import {
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Smartphone,
  Lock,
  Clock,
  ArrowRight,
  Loader2,
  Key,
  Mail,
  MessageSquare
} from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  setItem,
  clear
} from '../../store/store-index'

import * as AuthAction from '../../store/auth/authAction'

import * as api_2factor from '../../services/two-factor/two-factor.api.js'

import { 
    STORAGE_USER_INFORMATION, 
    STORAGE_TOKEN, 
    REDUX_PAYLOAD_INFORMATION,
    STORAGE_2_FACTOR_TOKEN,
    STORAGE_2_FACTOR_STATUS
} from '../../store/auth/authAction';

const Verification = () =>{

    const location = useLocation();
    const auth_states = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    // Destructure the state passed via navigate
    const { token, verificationId } = location.state || {};

    const [verificationState, setVerificationState] = useState({
        isVerifying: false,
        error: null,
        success: false,
        attempts: 0,
        lockedUntil: null,
        verification_id: verificationId,
        verificationMethod: 'authenticator',
        contactInfo: {
            email: 'user@example.com',
            phone: '+1 (555) 123-4567'
        }
    });

    const TwoFactorVerificationInput = ({ 
        onVerify, 
        onCancel,
        onResend,
        isVerifying = false,
        error = null,
        verificationMethod = 'authenticator', // 'authenticator', 'sms', 'email', 'backup_code'
        contactInfo = null,
        expiresIn = 300,
        title = "Two-Factor Verification Required",
        description = "Enter the verification code from your authenticator app",
        showBackupOption = true
    }) => {
        const [codes, setCodes] = useState(['', '', '', '', '', '']);
        const [activeIndex, setActiveIndex] = useState(0);
        const [timeLeft, setTimeLeft] = useState(expiresIn);
        const [isResending, setIsResending] = useState(false);
        const [resendCount, setResendCount] = useState(0);
        const [showBackupInput, setShowBackupInput] = useState(false);
        const [backupCode, setBackupCode] = useState('');
        const [selectedMethod, setSelectedMethod] = useState(verificationMethod);
        const inputRefs = useRef([]);

        // Focus first input on mount
        useEffect(() => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, []);

        // Timer for code expiration
        useEffect(() => {
            if (timeLeft <= 0) return;

            const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }, [timeLeft]);

        // Reset timer when method changes
        useEffect(() => {
            setTimeLeft(expiresIn);
        }, [selectedMethod, expiresIn]);

        // Format time
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        // Handle digit input
        const handleDigitInput = (index, value) => {
            // Only allow numbers
            const digit = value.replace(/\D/g, '').slice(0, 1);
            
            if (digit === '' && index > 0) {
                // Handle backspace on empty input
                const newCodes = [...codes];
                newCodes[index - 1] = '';
                setCodes(newCodes);
                setActiveIndex(index - 1);
                
                // Focus previous input
                setTimeout(() => {
                    if (inputRefs.current[index - 1]) {
                    inputRefs.current[index - 1].focus();
                    }
                }, 0);
                return;
            }
            
            if (digit === '') {
                // Clear current digit
                const newCodes = [...codes];
                newCodes[index] = '';
                setCodes(newCodes);
                return;
            }

            // Set digit and move to next
            const newCodes = [...codes];
            newCodes[index] = digit;
            setCodes(newCodes);

            // If we have a complete code, auto-submit
            const fullCode = newCodes.join('');
            if (fullCode.length === 6) {
                setTimeout(() => {
                    handleVerify();
                }, 100);
            } else if (index < 5) {
                setActiveIndex(index + 1);
                // Focus next input
                setTimeout(() => {
                    if (inputRefs.current[index + 1]) {
                        inputRefs.current[index + 1].focus();
                    }
                }, 0);
            }
        };

        // Handle paste
        const handlePaste = (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text/plain');
            const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
            
            const newCodes = [...codes];
            digits.forEach((digit, index) => {
            if (index < 6) {
                newCodes[index] = digit;
            }
            });
            setCodes(newCodes);
            
            // Auto-submit if we have 6 digits
            if (digits.length === 6) {
            setTimeout(() => {
                handleVerify();
            }, 100);
            } else if (digits.length > 0) {
            // Focus next empty input
            const nextIndex = Math.min(digits.length, 5);
            setActiveIndex(nextIndex);
            setTimeout(() => {
                if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
                }
            }, 0);
            }
        };

        // Handle key down (for navigation)
        const handleKeyDown = (index, e) => {
            if (e.key === 'Backspace' && codes[index] === '' && index > 0) {
            // Move to previous input on backspace
            e.preventDefault();
            const newCodes = [...codes];
            newCodes[index - 1] = '';
            setCodes(newCodes);
            setActiveIndex(index - 1);
            
            setTimeout(() => {
                if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
                }
            }, 0);
            } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            setActiveIndex(index - 1);
            setTimeout(() => {
                if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
                }
            }, 0);
            } else if (e.key === 'ArrowRight' && index < 5) {
            e.preventDefault();
            setActiveIndex(index + 1);
            setTimeout(() => {
                if (inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
                }
            }, 0);
            } else if (e.key === 'Enter') {
            e.preventDefault();
            handleVerify();
            }
        };

        // Handle verify
        const handleVerify = () => {
            if (showBackupInput) {
            if (backupCode.trim().length >= 8) {
                onVerify(backupCode, 'backup_code');
            }
            } else {
            const code = codes.join('');
            if (code.length === 6) {
                onVerify(code, selectedMethod);
            }
            }
        };
        
        // Handle resend
        const handleResend = async () => {
            setIsResending(true);
            try {
                await onResend(selectedMethod);
                setResendCount(prev => prev + 1);
                setTimeLeft(expiresIn);
                setCodes(['', '', '', '', '', '']);
                setActiveIndex(0);
                setTimeout(() => {
                    if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                    }
                }, 100);
            } catch (err) {
                console.error('Resend failed:', err);
            } finally {
                setIsResending(false);
            }
        };

        // Get method icon and description
        const getMethodInfo = (method) => {
            switch (method) {
            case 'authenticator':
                return {
                icon: <Smartphone className="w-5 h-5" />,
                name: 'Authenticator App',
                description: 'Use Google Authenticator, Authy, etc.',
                color: 'blue'
                };
            case 'backup_code':
                return {
                icon: <Key className="w-5 h-5" />,
                name: 'Backup Code',
                description: 'Use one of your saved backup codes',
                color: 'orange'
                };
            default:
                return {
                icon: <Shield className="w-5 h-5" />,
                name: 'Verification',
                description: 'Enter verification code',
                color: 'gray'
                };
            }
        };

        const currentMethod = getMethodInfo(selectedMethod);

        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="w-full max-w-md">
                    <div className="p-6 bg-white shadow-xl rounded-2xl md:p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                        <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        
                        <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        {title}
                        </h1>
                        
                        <p className="text-gray-600">
                        {showBackupInput 
                            ? 'Enter one of your backup codes' 
                            : description}
                        </p>
                    </div>

                    {/* Timer Alert */}
                    {timeLeft < 60 && (
                        <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-red-600" />
                                <span className="font-medium text-red-800">
                                    Code expires in {formatTime(timeLeft)}
                                </span>
                                </div>
                                <button
                                onClick={handleResend}
                                disabled={isResending || timeLeft > 30}
                                className="text-sm font-medium text-red-700 hover:text-red-800 disabled:opacity-50"
                                >
                                {isResending ? 'Sending...' : 'Resend'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Method Selection */}
                    {!showBackupInput && (
                        <div className="mb-6">
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                            Verification Method
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                            {['authenticator'].map((method) => {
                            const info = getMethodInfo(method);
                            const isDisabled = method === 'sms' && !contactInfo?.phone || 
                                            method === 'email' && !contactInfo?.email;
                            
                            return (
                                <button
                                key={method}
                                onClick={() => setSelectedMethod(method)}
                                disabled={isDisabled}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedMethod === method
                                    ? `border-${info.color}-500 bg-${info.color}-50`
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg bg-${info.color}-100 mr-3`}>
                                        <div className={`text-${info.color}-600`}>
                                            {info.icon}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{info.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{info.description}</div>
                                    </div>
                                </div>
                                </button>
                            );
                            })}
                        </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                        <div className="flex items-center">
                            <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3 text-red-600" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        </div>
                    )}

                    {/* Backup Code Input */}
                    {showBackupInput ? (
                        <div className="mb-6">
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                            Backup Code
                        </label>
                        <div className="relative">
                            <input
                            type="text"
                            value={backupCode}
                            onChange={(e) => setBackupCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                            placeholder="Enter 8-10 character code"
                            className="w-full px-4 py-4 font-mono text-lg tracking-wider text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                            autoComplete="off"
                            autoFocus
                            />
                            <div className="absolute inset-y-0 flex items-center pointer-events-none right-4">
                                <Key className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-500">
                            Enter one of your saved backup codes (usually 8-10 characters)
                        </p>
                        </div>
                    ) : (
                        /* 6-Digit Code Input */
                        <div className="mb-6">
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                            {currentMethod.name} Code
                        </label>
                        
                        <div className="flex justify-center mb-6 space-x-2 md:space-x-3">
                            {codes.map((digit, index) => (
                            <div key={index} className="relative">
                                <input
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleDigitInput(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                onFocus={() => setActiveIndex(index)}
                                className={`w-12 h-14 md:w-14 md:h-16 text-2xl md:text-3xl font-bold text-center border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    activeIndex === index
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 bg-white'
                                }`}
                                autoComplete="off"
                                />
                                {/* Bottom indicator */}
                                <div className={`absolute  left-1/2 transform w-2 h-2 rounded-full mt-2 ${
                                    activeIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                                    }`} />
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-center text-gray-500">
                            Enter the 6-digit code from your {currentMethod.name.toLowerCase()}
                        </p>

                        {/* Timer */}
                        <div className="flex items-center justify-center mt-4 text-sm">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span className={`font-medium ${
                            timeLeft < 60 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                            Code valid for {formatTime(timeLeft)}
                            </span>
                        </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                        onClick={handleVerify}
                        disabled={isVerifying || 
                            (showBackupInput ? backupCode.length < 8 : codes.join('').length !== 6)}
                        className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isVerifying ? (
                            <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Verifying...
                            </>
                        ) : (
                            <>
                            <ArrowRight className="w-5 h-5 mr-2" />
                            Verify & Continue
                            </>
                        )}
                        </button>

                        <div className="flex items-center justify-between">
                        <button
                            onClick={handleResend}
                            disabled={isResending || timeLeft > 30}
                            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                            {isResending ? 'Sending...' : 'Resend Code'}
                            {resendCount > 0 && ` (${resendCount})`}
                        </button>

                        {showBackupOption && !showBackupInput && (
                            <button
                            onClick={() => setShowBackupInput(true)}
                            className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
                            >
                            <Key className="w-4 h-4 mr-1" />
                            Use backup code
                            </button>
                        )}

                        {showBackupInput && (
                            <button
                            onClick={() => setShowBackupInput(false)}
                            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                            <Smartphone className="w-4 h-4 mr-1" />
                            Use authenticator
                            </button>
                        )}
                        </div>

                        {onCancel && (
                        <button
                            onClick={onCancel}
                            className="w-full px-6 py-3 font-medium text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="pt-6 mt-8 border-t border-gray-200">
                        <div className="flex items-start">
                        <Lock className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                            For your security, this code expires in 5 minutes. Never share your verification codes with anyone.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleVerify = async (code, method) => {

        try{
            setVerificationState(prev => ({
                ...prev,
                isVerifying: true,
                error: null
            }));

            // Mock verification logic
            if (method === 'backup_code') {
                // Check backup code
                const isValidBackupCode = code.length >= 8 && /^[A-Z0-9]+$/.test(code);
                
                if (isValidBackupCode) {

                    const verificationData = {
                        code: code,
                        verificationId: verificationState.verification_id
                    }

                    // api request
                    await api_2factor.VerifyFactorBackupCode(token, verificationData).then((result) =>{
                        if(result.status){
                            
                            setVerificationState(prev => ({
                                ...prev,
                                isVerifying: false,
                                error: result.data.message,
                                success: true,
                                attempts: 0,
                                lockedUntil: null,
                                verification_id: null,
                            }));

                            toast.success(result.data.message);

                            var userInformation = result.data.data.user
                            var payload = result.data.data.payload

                            const twoFactor = {
                                two_factor_enabled_at: userInformation.two_factor_enabled_at ,
                                two_factor_confirmed_at: userInformation.two_factor_confirmed_at,
                            }

                            const auth_headers = 
                            {
                                'X-2FA-Token': result.data.data.session_token,
                                'Authorization': token,
                            }

                            setItem(STORAGE_TOKEN, JSON.stringify(auth_headers))
                            setItem(STORAGE_USER_INFORMATION, JSON.stringify(userInformation))
                            setItem(REDUX_PAYLOAD_INFORMATION, payload)
                            setItem(STORAGE_2_FACTOR_STATUS, true)

                            dispatch(AuthAction.LoginUser(auth_headers, userInformation, payload))
                            dispatch(AuthAction.GetTwoFactorAuthentication(twoFactor, result.data.data.session_token))

                        }
                    }).catch((err) =>{
                        const err_response = err?.response?.data

                        let message = err_response?.message
                        let verification_id = err_response?.verification_id

                        toast.warning(message);

                        setVerificationState(prev => ({
                            ...prev,
                            error: message,
                            verification_id: verification_id,
                            isVerifying: false
                        }));
                    })

                } else {

                    toast.warning("Invalid backup code. Please try again.");

                    setVerificationState(prev => ({
                        ...prev,
                        error: 'Invalid backup code. Please try again.',
                        isVerifying: false
                    }));
                }
            } else {
                // Check 6-digit code (mock: any 6-digit code works)
                const isValidCode = /^\d{6}$/.test(code);
                if (isValidCode) {

                    const verificationData = {
                        code: code,
                        verification_id: verificationState.verification_id
                    }

                    // api request
                    await api_2factor.VerifyFactor(token, verificationData).then((result) =>{
                        if(result.status){
                            if(result.data.status){

                                setVerificationState(prev => ({
                                    ...prev,
                                    isVerifying: false,
                                    error: result.data.message,
                                    success: true,
                                    attempts: 0,
                                    lockedUntil: null,
                                    verification_id: null,
                                }));

                                toast.success(result.data.message);

                                var userInformation = result.data.data.user
                                var payload = result.data.data.payload

                                const twoFactor = {
                                    two_factor_enabled_at: userInformation.two_factor_enabled_at ,
                                    two_factor_confirmed_at: userInformation.two_factor_confirmed_at,
                                }

                                const auth_headers = 
                                {
                                    'X-2FA-Token': result.data.data.session_token,
                                    'Authorization': token,
                                }

                                setItem(STORAGE_TOKEN, JSON.stringify(auth_headers))
                                setItem(STORAGE_USER_INFORMATION, JSON.stringify(userInformation))
                                setItem(REDUX_PAYLOAD_INFORMATION, payload)
                                setItem(STORAGE_2_FACTOR_STATUS, true)

                                dispatch(AuthAction.LoginUser(auth_headers, userInformation, payload))
                                dispatch(AuthAction.GetTwoFactorAuthentication(twoFactor, result.data.data.session_token))
                            }
                            else{
                                toast.warning(result.data.message);

                                if(result.data.is_locked_out){
                                    LogoutUser()
                                    navigate('/')
                                }else{
                                    setVerificationState(prev => ({
                                        ...prev,
                                        error: result.data.message,
                                        lockedUntil: result.data?.is_locked_out ? result.data?.locked_until : null,
                                        isVerifying: false,
                                        verification_id: result.data?.verification_id,
                                        attempts: result.data?.locked
                                    }));
                                }
                            }
                        }
                    }).catch((err) =>{

                        const err_response = err?.response?.data

                        let message = err_response?.message
                        let verification_id = err_response?.verification_id

                        toast.warning(message);

                        setVerificationState(prev => ({
                            ...prev,
                            error: message,
                            verification_id: verification_id,
                            isVerifying: false
                        }));
                    })
                } 
            }
           
        }catch(err){    
            toast.error(err.message || "An error occurred during verification. Please try again.");
            
            setVerificationState(prev => ({
                ...prev,
                error: 'An error occurred during verification. Please try again.',
                isVerifying: false
            }));
        }
    };

    const handleResend = async (method) => {
        // Simulate resend API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would trigger sending a new code
        console.log(`Resending ${method} code...`);
        
        // Show success message
        setVerificationState(prev => ({
            ...prev,
            error: `New code sent to your ${method === 'sms' ? 'phone' : method === 'email' ? 'email' : 'authenticator app'}`
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
            setVerificationState(prev => ({
            ...prev,
            error: null
            }));
        }, 3000);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel verification?')) {
            LogoutUser()
            navigate('/')
        }
    }

    const LogoutUser = async () =>{
        await clear().then((result) =>{
            dispatch(AuthAction.LogoutUser())
        }).catch((err) =>{
            console.log(err.message)
        })
    }

    // Success screen
    if (verificationState.success) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
                <div className="w-full max-w-md">
                    <div className="p-6 bg-white shadow-lg rounded-2xl md:p-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            
                            <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                            Verification Successful!
                            </h1>
                            
                            <p className="mb-8 text-sm text-gray-600 md:text-base">
                            You have successfully verified your identity. Redirecting to your account...
                            </p>

                            <div className="space-y-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800"
                            >
                                Go to App
                            </button>
                            
                            {/* <button
                                onClick={() => setVerificationState({
                                isVerifying: false,
                                error: null,
                                success: false,
                                attempts: 0,
                                lockedUntil: null,
                                verificationMethod: 'authenticator',
                                contactInfo: {
                                    email: 'user@example.com',
                                    phone: '+1 (555) 123-4567'
                                }
                                })}
                                className="w-full px-6 py-3 font-medium text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                            >
                                Verify Another Account
                            </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Account locked screen
    if (verificationState.lockedUntil && Date.now() < verificationState.lockedUntil) {
        const minutesLeft = Math.ceil((verificationState.lockedUntil - Date.now()) / (60 * 1000));
        
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 to-white">
            <div className="w-full max-w-md">
                <div className="p-6 bg-white shadow-lg rounded-2xl md:p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full">
                    <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    
                    <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                    Account Temporarily Locked
                    </h1>
                    
                    <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
                    <p className="text-red-700">
                        Too many failed verification attempts. Please try again in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}.
                    </p>
                    </div>

                    <div className="space-y-3">
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800"
                    >
                        Return to Login
                    </button>
                    
                    <button
                        onClick={() => window.location.href = '/support/2fa'}
                        className="w-full px-6 py-3 font-medium text-red-700 transition-colors border-2 border-red-300 rounded-xl hover:bg-red-50"
                    >
                        Need Help?
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        );
    }

    return (

        <div>

            <TwoFactorVerificationInput
            onVerify={handleVerify}
            onCancel={handleCancel}
            onResend={handleResend}
            isVerifying={verificationState.isVerifying}
            error={verificationState.error}
            verificationMethod={verificationState.verificationMethod}
            contactInfo={verificationState.contactInfo}
            expiresIn={30}
            title="Verify Your Identity"
            description="Enter the verification code to access your account"
            showBackupOption={true}
            />
            
            <ToastContainer />
            
        </div>
        
    )
}

export default Verification