'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { auth } from '../../firebase/config'
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, ApplicationVerifier } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyPhone() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [phone, setPhone] = useState('')
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])
  const router = useRouter()
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    const userData = window.sessionStorage.getItem('userData')
    if (!userData) return router.push('/sign-up')

    const { phone: userPhone } = JSON.parse(userData)
    setPhone(userPhone)

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
      })
    }

    sendOtp()

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const sendOtp = async () => {
    try {
      const userData = window.sessionStorage.getItem('userData')
      if (!userData) return

      const { phone } = JSON.parse(userData)
      
      const provider = new PhoneAuthProvider(auth)
      
      // Add null check for recaptchaRef.current
      if (!recaptchaRef.current) {
        throw new Error('reCAPTCHA not initialized')
      }
      
      const verifier = recaptchaRef.current as ApplicationVerifier
      const id = await provider.verifyPhoneNumber(phone, verifier)
      
      setVerificationId(id)
      setCountdown(60)
      setSuccess('OTP sent to your phone.')
      
      // Reset OTP inputs
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error: unknown) {
      setError('Failed to send OTP. Please try again.')
      console.error('Send OTP error:', error)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if pasting multiple digits
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''
    // Hide middle digits
    const parts = phone.split('')
    if (parts.length > 8) {
      const visiblePart1 = parts.slice(0, 4).join('')
      const visiblePart2 = parts.slice(-4).join('')
      return `${visiblePart1} **** ${visiblePart2}`
    }
    return phone
  }

  const handleVerify = async () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    try {
      const cred = PhoneAuthProvider.credential(verificationId, otpValue)
      const user = auth.currentUser
      if (user) {
        await linkWithCredential(user, cred)
        setSuccess('Phone number verified successfully!')
        setTimeout(() => {
          router.push(returnUrl ?? '/clinic-onboarding')
        }, 1500)
      } else {
        setError('No user found. Please sign up again.')
      }
    } catch (error: unknown) {
      setError('Invalid OTP. Please try again.')
      console.error('Verification error:', error)
    }
  }

  // const handleResend = () => {
  //   if (countdown === 0) {
  //     sendOtp()
  //   }
  // }

  const handleEmailSignup = () => {
    router.push('/sign-up/email')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Section */}
        <div className="bg-teal-700 text-white p-8 md:w-1/3 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="5" y="4" width="14" height="17" rx="2" stroke="white" strokeWidth="2" />
                <path d="M12 4V2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 9H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 13H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">OTP</span>
              </div>
              <div className="absolute bottom-0 right-0 bg-teal-300 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-80">Enter 6-digit OTP<br />that you received on<br />{formatPhoneNumber(phone)}</p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/get-help')}
            className="mt-6 px-6 py-2 rounded-full border border-white text-white text-sm hover:bg-white hover:text-teal-700 transition duration-300"
          >
            Get Help
          </motion.button>
        </div>

        {/* Right Section */}
        <div className="p-8 flex-1">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-teal-700">Enter your OTP</h1>
            <p className="text-gray-500 text-sm">Verify your account</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Reset OTP in 
                <span className="text-teal-700 font-medium"> {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60} seconds</span>
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm bg-red-50 p-2 rounded text-center"
              >
                {error}
              </motion.div>
            )}

            {success && !error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 text-sm bg-green-50 p-2 rounded text-center"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium transition duration-300"
            >
              Verify
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Trouble signing up? 
                <button 
                  onClick={handleEmailSignup}
                  className="text-teal-700 ml-1 hover:underline font-medium"
                >
                  Try email instead.
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <div id="recaptcha-container" className="hidden" />
    </div>
  )
}