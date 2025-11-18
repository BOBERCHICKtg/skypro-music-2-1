// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'var(--font-montserrat)'
    }}>
      <h1>404 - Страница не найдена</h1>
      <p>Вернуться на <Link href={'/'}>главную страницу</Link></p>
    </div>
  )
}