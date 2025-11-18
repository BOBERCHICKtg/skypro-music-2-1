import axios from "axios"
import { BASE_URL } from "../constants"

type AuthUserProps = {
    email: string,
    password: string,
}

type AuthUserReturn = {
    email: string;
    username: string;
    _id: string;
    token?: string;
}

export const authUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
    try {
        const response = await axios.post(BASE_URL + '/user/login/', data, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.data) {
            localStorage.setItem('userData', JSON.stringify(response.data));
        }

        return response.data;

    } catch (error: any) {
        let errorMessage = "Произошла неизвестная ошибка"

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status
                
                switch (status) {
                    case 400:
                        errorMessage = "Неверные данные для входа"
                        break
                    case 401:
                        errorMessage = "Неверный email или пароль"
                        break
                    case 404:
                        errorMessage = "Пользователь не найден"
                        break
                    case 500:
                        errorMessage = "Ошибка сервера. Попробуйте позже"
                        break
                    default:
                        errorMessage = error.response.data?.message || `Ошибка: ${status}`
                }
            } else if (error.request) {
                errorMessage = "Нет ответа от сервера. Проверьте подключение к интернету"
            } else {
                errorMessage = "Ошибка при отправке запроса"
            }
        } else {
            errorMessage = error.message || "Неизвестная ошибка"
        }

        throw new Error(errorMessage)
    }
}

export const getTokens = async (data: AuthUserProps) => {
    try {
        const response = await axios.post(BASE_URL + '/user/token/', data, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.data.access) {
            localStorage.setItem('authToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            return response.data;
        }

        throw new Error('Токен не получен');

    } catch (error: any) {
        let errorMessage = "Ошибка при получении токенов"

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status
                
                switch (status) {
                    case 400:
                        errorMessage = "Неверные данные для входа"
                        break
                    case 401:
                        errorMessage = "Неверный email или пароль"
                        break
                    default:
                        errorMessage = error.response.data?.message || `Ошибка: ${status}`
                }
            } else if (error.request) {
                errorMessage = "Нет ответа от сервера"
            } else {
                errorMessage = "Ошибка при отправке запроса"
            }
        } else {
            errorMessage = error.message || "Неизвестная ошибка"
        }

        throw new Error(errorMessage)
    }
}

export const refreshAuthToken = async (): Promise<string> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('Refresh token не найден');
        }

        const response = await axios.post(BASE_URL + '/user/token/refresh/', {
            refresh: refreshToken
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data.access) {
            localStorage.setItem('authToken', response.data.access);
            return response.data.access;
        }

        throw new Error('Токен не получен');

    } catch (error: any) {
        logoutUser();
        throw new Error('Не удалось обновить токен. Пожалуйста, войдите снова.');
    }
}

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('authToken');
    return !!token;
}

export const getUserData = (): AuthUserReturn | null => {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
}

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken');
}

export const logoutUser = async (): Promise<void> => {
    try {
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
    } catch (error: any) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
        throw new Error('Ошибка при выходе из системы')
    }
}

export const registerUser = async (data: AuthUserProps & { username: string }): Promise<AuthUserReturn> => {
    try {
        const response = await axios.post(BASE_URL + '/user/signup/', data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error: any) {
        let errorMessage = "Произошла неизвестная ошибка при регистрации"
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status
                switch (status) {
                    case 400:
                        errorMessage = "Неверные данные для регистрации"
                        break
                    case 409:
                        errorMessage = "Пользователь с таким email уже существует"
                        break
                    default:
                        errorMessage = error.response.data?.message || `Ошибка регистрации: ${status}`
                }
            }
        }
        throw new Error(errorMessage)
    }
}