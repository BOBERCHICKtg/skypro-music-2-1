import axios from "axios"
import { BASE_URL } from "../constants"
import { TrackType } from "@/components/sharedTypes/types"
import { getAuthToken } from "../auth/authApi"

export const getTracks = (): Promise<TrackType[]> => {
    return axios(BASE_URL + '/catalog/track/all/').then((res) => {
        return res.data
    })
}

export const addToFavorites = async (trackId: string): Promise<any> => {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await axios.post(BASE_URL + `/catalog/track/${trackId}/favorite/`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response.data;
}

export const removeFromFavorites = async (trackId: string): Promise<any> => {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await axios.delete(BASE_URL + `/catalog/track/${trackId}/favorite/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response.data;
}

export const getFavoriteTracks = async (): Promise<TrackType[]> => {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await axios.get(BASE_URL + '/catalog/track/favorite/all/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    // Добавим проверку формата ответа
    console.log('Ответ от getFavoriteTracks:', response.data);
    
    // Если ответ - массив, возвращаем его
    if (Array.isArray(response.data)) {
        return response.data;
    }
    
    // Если ответ - объект с данными, возвращаем data
    if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    
    // Если другой формат, возвращаем пустой массив
    return [];
}