"use client"

import styles from "../Profile/profile.module.css";
import { useState, useEffect, useRef } from "react";

export default function Profile() {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs} ч ${mins} мин ${secs} сек`;
    } else if (mins > 0) {
      return `${mins} мин ${secs} сек`;
    }
    return `${secs} сек`;
  };

  // Запуск/остановка таймера
  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        // Сохраняем в sessionStorage каждые 5 секунд
        if (typeof window !== "undefined" && newTime % 5 === 0) {
          sessionStorage.setItem("timeOnSite", newTime.toString());
        }
        return newTime;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Инициализация из sessionStorage
    if (typeof window !== "undefined") {
      const savedTime = sessionStorage.getItem("timeOnSite");
      if (savedTime) {
        setTimeSpent(parseInt(savedTime, 10));
      }
    }

    // Запускаем таймер
    startTimer();

    // Обработчик видимости страницы
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        stopTimer();
      } else {
        setIsVisible(true);
        startTimer();
      }
    };

    // Обработчик фокуса окна
    const handleFocus = () => {
      setIsVisible(true);
      startTimer();
    };

    const handleBlur = () => {
      setIsVisible(false);
      stopTimer();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Очистка
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className={styles.profile}>
      <div className={styles.profileBox}>
        <img className={styles.profileImg} src="/img/987.jpg" alt="" />
        <div className="">
          <p className={styles.profileName}>Danil Bersenev</p>
          <div>
            <p className={styles.profileInt}>Онлайн</p>
            <p className={styles.timer}>{formatTime(timeSpent)}</p>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <h1 className={styles.mainTrack}>Недавно прослушанные треки</h1>
        <div className={styles.mainRecent}>
        
        </div>
      </div>
    </div>
  );
}

// components/TimeTracker.tsx
/* ("use client"); // Важно: это клиентский компонент

import { useState, useEffect, useRef } from "react";

export default function TimeTracker() {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs} ч ${mins} мин ${secs} сек`;
    } else if (mins > 0) {
      return `${mins} мин ${secs} сек`;
    }
    return `${secs} сек`;
  };

  // Запуск/остановка таймера
  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        // Сохраняем в sessionStorage каждые 5 секунд
        if (typeof window !== "undefined" && newTime % 5 === 0) {
          sessionStorage.setItem("timeOnSite", newTime.toString());
        }
        return newTime;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Инициализация из sessionStorage
    if (typeof window !== "undefined") {
      const savedTime = sessionStorage.getItem("timeOnSite");
      if (savedTime) {
        setTimeSpent(parseInt(savedTime, 10));
      }
    }

    // Запускаем таймер
    startTimer();

    // Обработчик видимости страницы
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        stopTimer();
      } else {
        setIsVisible(true);
        startTimer();
      }
    };

    // Обработчик фокуса окна
    const handleFocus = () => {
      setIsVisible(true);
      startTimer();
    };

    const handleBlur = () => {
      setIsVisible(false);
      stopTimer();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Очистка
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Время на сайте</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatTime(timeSpent)}
          </p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${isVisible ? "bg-green-500" : "bg-red-500"}`}
          title={isVisible ? "Таймер активен" : "Таймер на паузе"}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Обновляется в реальном времени
      </p>
    </div>
  );
}
 */