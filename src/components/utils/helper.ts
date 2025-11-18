import { TrackType } from "@/sharedTypes/sharedTypes";

export function getUniqueValuesByKey(
  arr: any[],
  key: keyof TrackType
): string[] {
  // Защита от не-массива
  if (!Array.isArray(arr)) {
    console.warn('getUniqueValuesByKey: передан не массив', arr);
    return [];
  }

  const uniqueValues = new Set<string>();
  
  arr.forEach((item) => {
    // Проверяем что item - объект и содержит нужный ключ
    if (item && typeof item === 'object' && key in item) {
      const value = item[key];

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v && typeof v === 'string') {
            uniqueValues.add(v);
          }
        });
      } else if (typeof value === "string" && value) {
        uniqueValues.add(value);
      }
    }
  });

  return Array.from(uniqueValues);
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

  return `${minutes}:${outputSeconds}`;
}

export const getTimePanel = (
  currentTime: number,
  totalTime: number | undefined
) => {
  if (totalTime) {
    return `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
  }
};