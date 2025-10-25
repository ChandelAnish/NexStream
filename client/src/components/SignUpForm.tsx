'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError
} from 'firebase/auth'
import { auth } from '../../firebase/config'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const router = useRouter()

  // Load form data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFormData = window.sessionStorage.getItem('signupFormData')
      
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData)
          setForm(parsedData)
        } catch (error) {
          console.error('Error parsing saved form data:', error)
        }
      }
    }
  }, [])

  // Save form data to sessionStorage whenever form changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('signupFormData', JSON.stringify(form))
    }
  }, [form])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing again
    if (error) setError('')
  }

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent multiple submissions
    
    setError('')
    setIsLoading(true)
    const { name, email, password, confirmPassword } = form

    // Validate form fields
    if (!name) {
      setError('Name is required')
      setIsLoading(false)
      return
    }
    if (!email) {
      setError('Email is required')
      setIsLoading(false)
      return
    }
    if (!password) {
      setError('Password is required')
      setIsLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      setIsLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Proceed with user creation
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(res.user, { displayName: name })

      // Store user data temporarily
      window.sessionStorage.setItem('userData', JSON.stringify({ name, email }))
      // Clear signup form data as registration is successful
      window.sessionStorage.removeItem('signupFormData')
      
      router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) {
        const authError = err as AuthError;
        if (authError.code === 'auth/email-already-in-use') {
          setError('Email is already in use')
        } else if (authError.code === 'auth/invalid-email') {
          setError('Invalid email format')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      
      window.sessionStorage.setItem('userData', JSON.stringify({ name: user.displayName, email: user.email }))
      // Clear signup form data
      window.sessionStorage.removeItem('signupFormData')
      
      // Redirect to dashboard (consistent with email sign up)
      router.push('/dashboard')
    } catch (err: unknown) {
      console.log(err)
      setError('Google Sign-in failed')
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    router.push('/sign-in')
  }

  // Check if form is complete to enable/disable button
  const isFormIncomplete = !form.name || !form.email || !form.password || !form.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gaming background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-500 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-500 rotate-12 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 border border-pink-500 rotate-45 animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-blue-500 rotate-12 animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism container */}
        <div className="backdrop-blur-xl bg-gray-900/80 border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-center"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Join NexStream
              </h2>
              <p className="text-gray-400">Create your gaming account</p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Name input */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Email input (Simplified) */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              
              {/* Password input */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password input */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Sign up button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isFormIncomplete || isLoading}
                className={`w-full py-4 ${isFormIncomplete || isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500'} text-white font-semibold rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/25`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <div className="px-4 text-sm text-gray-400">or</div>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Google sign up */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-4 bg-gray-800/50 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-gray-700/50 backdrop-blur-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </motion.button>

              {/* Sign in link */}
              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <button 
                    onClick={handleSignIn}
                    className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}