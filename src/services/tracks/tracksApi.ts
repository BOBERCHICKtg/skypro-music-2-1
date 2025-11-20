import axios from "axios";
import { BASE_URL } from "../constants";
import { TrackType } from "@/src/components/sharedTypes/types";
import { getAuthToken } from "../auth/authApi";

export const getTracks = (): Promise<TrackType[]> => {
  return axios(BASE_URL + "/catalog/track/all/").then((res) => {
    return res.data;
  });
};

export const addToFavorites = async (trackId: string): Promise<any> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Токен не найден");
  }

  const response = await axios.post(
    BASE_URL + `/catalog/track/${trackId}/favorite/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const removeFromFavorites = async (trackId: string): Promise<any> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Токен не найден");
  }

  const response = await axios.delete(
    BASE_URL + `/catalog/track/${trackId}/favorite/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getFavoriteTracks = async (): Promise<TrackType[]> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Токен не найден");
  }

  const response = await axios.get(BASE_URL + "/catalog/track/favorite/all/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  return [];
};

export const getSelections = async (): Promise<any[]> => {
  const response = await axios.get(BASE_URL + "/catalog/selection/all");
  return response.data;
};

export const getSelectionById = async (selectionId: string): Promise<any> => {
  const response = await axios.get(
    BASE_URL + `/catalog/selection/${selectionId}/`
  );
  return response.data;
};

export const getSelectionTracks = async (
  selectionId: string
): Promise<TrackType[]> => {
  const selection = await getSelectionById(selectionId);

  if (Array.isArray(selection)) {
    return selection;
  }

  if (selection && Array.isArray(selection.items)) {
    return selection.items;
  }

  if (selection && Array.isArray(selection.tracks)) {
    return selection.tracks;
  }

  return [];
};

export const createSelection = async (selectionData: any): Promise<any> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Токен не найден");
  }

  const response = await axios.post(
    BASE_URL + "/catalog/selection",
    selectionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
