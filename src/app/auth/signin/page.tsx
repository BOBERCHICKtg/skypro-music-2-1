'use client'

import { authUser, getTokens } from '@/src/services/auth/authApi';
import styles from './signin.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import { ChangeEvent, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Signin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setErrorMessage('')
    }

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setErrorMessage('')
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMessage('')

        if (!email.trim() || !password.trim()) {
            return setErrorMessage('Заполните все поля')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return setErrorMessage('Введите корректный email')
        }

        setIsLoading(true)

        try {
            // ВАЖНО: сначала получаем токены, потом данные пользователя
            await getTokens({ email, password })
            const userData = await authUser({ email, password })
            console.log('Успешная авторизация:', userData)
            
            // Проверяем что токен сохранился
            console.log('Токен после входа:', localStorage.getItem('authToken'))
            
            router.push('/music/main')
            
        } catch (error: any) {
            console.error('Ошибка авторизации:', error)
            
            if (error.response) {
                const status = error.response.status
                
                switch (status) {
                    case 400:
                        setErrorMessage('Неверные данные для входа')
                        break
                    case 401:
                        setErrorMessage('Неверный email или пароль')
                        break
                    case 404:
                        setErrorMessage('Пользователь не найден')
                        break
                    case 500:
                        setErrorMessage('Ошибка сервера. Попробуйте позже')
                        break
                    default:
                        setErrorMessage(error.response.data?.message || `Ошибка: ${status}`)
                }
            } else if (error.request) {
                setErrorMessage('Нет ответа от сервера. Проверьте подключение к интернету')
            } else {
                setErrorMessage('Ошибка при отправке запроса')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className={styles.modal__form} onSubmit={onSubmit}>
            <a href="/music/main">
                <div className={styles.modal__logo}>
                    <img src="/img/logo_modal.png" alt="logo" />
                </div>
            </a>
            
            <input
                className={classNames(styles.modal__input, styles.login)}
                type="email"
                name="login"
                placeholder="Почта"
                value={email}
                onChange={onChangeEmail}
                disabled={isLoading}
                required
            />
            
            <input
                className={classNames(styles.modal__input)}
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={onChangePassword}
                disabled={isLoading}
                required
                minLength={6}
            />
            
            {errorMessage && (
                <div className={styles.errorContainer}>
                    {errorMessage}
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={isLoading} 
                className={classNames(styles.modal__btnEnter, {
                    [styles.loading]: isLoading
                })}
            >
                {isLoading ? 'Вход...' : 'Войти'}
            </button>
            
            <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
                Зарегистрироваться
            </Link>
        </form>
    );
}