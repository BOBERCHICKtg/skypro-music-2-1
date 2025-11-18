// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/src/services/auth/authApi'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Проверяем авторизацию и перенаправляем
    if (isAuthenticated()) {
      router.push('/music/main')
    } else {
      router.push('/auth/signin')
    }
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'var(--font-montserrat)'
    }}>
      <div>Перенаправление...</div>
    </div>
  )
}