'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { toast } from "sonner"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        console.error('Login failed', error)
        return
      }

      // Send the access_token to backend API
      const res = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: session.access_token,
        }),
      })

      if (res.ok) {
       
          toast.success("Account created successfully!")
          router.push("/dashboard")
          router.refresh()
      } else {
        console.error('Failed to store token in cookie')
      }
    }

    handleRedirect()
  }, [router])

  return <div>Processing login...</div>
}
