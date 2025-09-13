// utils/emailMagicLink.ts
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '../../firebase/config'

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email`,
  // This must be true.
  handleCodeInApp: true,
}

export const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', email)
    }
    return { success: true }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error sending magic link:', err)
    return { 
      success: false, 
      error: err.message || 'Failed to send verification email' 
    }
  }
}

export const verifyMagicLink = async (url: string, email?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSignInWithEmailLink(auth, url)) {
      return { success: false, error: 'Invalid verification link' }
    }

    let emailToVerify = email
    if (!emailToVerify && typeof window !== 'undefined') {
      emailToVerify = window.localStorage.getItem('emailForSignIn') ?? undefined
    }

    if (!emailToVerify) {
      return { success: false, error: 'Email not found. Please try signing up again.' }
    }

    await signInWithEmailLink(auth, emailToVerify, url)

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('emailForSignIn')
    }

    return { success: true }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error verifying magic link:', err)
    return { 
      success: false, 
      error: err.message || 'Failed to verify email' 
    }
  }
}
