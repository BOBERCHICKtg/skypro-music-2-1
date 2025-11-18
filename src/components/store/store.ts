"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  useStore,
  TypedUseSelectorHook,
} from "react-redux";
import { trackSliceReducer } from "./features/trackSlice";
import favoritesReducer from "./features/favoritesSlice"; // добавляем импорт

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      tracks: trackSliceReducer,
      favorites: favoritesReducer, // добавляем в редьюсеры
    }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<AppStore["getState"]>;
type AppDispatch = AppStore["dispatch"];

// Для нового TS (версии Redux Toolkit 2.0+)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Для совместимости со старым TS (можно оставить только один вариант)
export const useAppDispatchLegacy: () => AppDispatch = useDispatch;
export const useAppSelectorLegacy: TypedUseSelectorHook<RootState> =
  useSelector;
export const useAppStoreLegacy: () => AppStore = useStore;