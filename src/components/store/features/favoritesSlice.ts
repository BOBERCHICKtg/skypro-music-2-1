// store/features/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';

interface FavoritesState {
  favoriteTracks: TrackType[];
  likedTrackIds: string[]; // меняем Set на массив строк
}

const initialState: FavoritesState = {
  favoriteTracks: [],
  likedTrackIds: [], // инициализируем пустым массивом
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
      // Преобразуем в массив ID
      state.likedTrackIds = action.payload.map(track => track._id);
    },
    addToFavorites: (state, action: PayloadAction<TrackType>) => {
      const track = action.payload;
      if (!state.likedTrackIds.includes(track._id)) {
        state.favoriteTracks.push(track);
        state.likedTrackIds.push(track._id);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      state.favoriteTracks = state.favoriteTracks.filter(track => track._id !== trackId);
      state.likedTrackIds = state.likedTrackIds.filter(id => id !== trackId);
    },
    clearFavorites: (state) => {
      state.favoriteTracks = [];
      state.likedTrackIds = [];
    },
  },
});

export const { setFavoriteTracks, addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;