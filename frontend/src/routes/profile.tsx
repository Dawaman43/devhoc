import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { fetchMyProfile, updateMyProfile } from '@/lib/api/users'
import { createFileRoute, redirect } from '@tanstack/react-router'

import ProfileEditor from '@/components/profile/ProfileEditor'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    // We rely on client-side AuthProvider; for SSR-friendly protection, redirect if user is not authenticated
    // In SPA mode, this will run on client navigation.
    const win = typeof window !== 'undefined' ? window : undefined
    if (win) {
      const raw = win.localStorage.getItem('devhoc.auth')
      try {
        const parsed = raw ? JSON.parse(raw) : null
        if (!parsed?.token || !parsed?.user) {
          throw redirect({ to: '/auth/login' })
        }
      } catch {
        throw redirect({ to: '/auth/login' })
      }
    }
  },
  component: ProfileEditor,
})
