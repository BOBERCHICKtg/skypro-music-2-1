import axios from "axios";
import { BASE_URL } from "../constants";
import { TrackType } from "@/src/components/sharedTypes/types";
import { getAuthToken } from "../auth/authApi";

export const getTracks = async (): Promise<TrackType[]> => {
  const response = await axios.get(BASE_URL + "/catalog/track/all/");
  return response.data.data || [];
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
  try {
    const selection = await getSelectionById(selectionId);

    if (
      !selection ||
      !selection.data ||
      !selection.data.items ||
      !Array.isArray(selection.data.items)
    ) {
      return [];
    }

    const allTracks = await getTracks();
    const trackIds = selection.data.items;

    return allTracks.filter((track) => trackIds.includes(track._id));
  } catch (error) {
    console.error("Error loading selection tracks:", error);
    return [];
  }
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
