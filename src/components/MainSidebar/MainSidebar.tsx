import Image from "next/image";
import Link from "next/link";
import styles from "./mainsidebar.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  logoutUser,
  getUserData,
  isAuthenticated,
} from "@/src/services/auth/authApi";

interface UserData {
  email: string;
  username: string;
  _id: string;
}

export default function MainSidebar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию при загрузке и обновляем состояние
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setAuthStatus(authenticated);

      if (authenticated) {
        const userData = getUserData();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Слушаем изменения в localStorage для обновления статуса
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Также проверяем периодически (на случай изменений в других вкладках)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // Обновляем состояние после выхода
      setUser(null);
      setAuthStatus(false);
      // Не перенаправляем на страницу входа, остаемся на текущей странице
    } catch (error) {
      // В случае ошибки все равно очищаем локальное состояние
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      setUser(null);
      setAuthStatus(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getDisplayName = (): string => {
    if (isLoggingOut) {
      return "Выход...";
    }

    if (authStatus && user && user.username) {
      return user.username;
    }

    if (authStatus) {
      return "Пользователь";
    }

    return "Войти в аккаунт";
  };

  const handleSidebarClick = () => {
    if (!authStatus) {
      router.push("/auth/signin");
      return;
    }

    if (!isLoggingOut) {
      handleLogout();
    }
  };

  const getIconPath = (): string => {
    if (isLoggingOut) {
      return "/img/icon/sprite.svg#logout";
    }
    return authStatus
      ? "/img/icon/sprite.svg#logout"
      : "/img/icon/sprite.svg#login";
  };

  return (
    <div className={styles.main__sidebar}>
      <div
        className={styles.sidebar__personal}
        onClick={handleSidebarClick}
        style={{
          cursor: isLoggingOut ? "not-allowed" : "pointer",
          opacity: isLoggingOut ? 0.7 : 1,
        }}
      >
        <p className={styles.sidebar__personalName}>{getDisplayName()}</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref={getIconPath()}></use>
          </svg>
        </div>
      </div>

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/2">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist01.png"
                alt="Плейлист дня"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/3">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist02.png"
                alt="100 танцевальных хитов"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/4">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist03.png"
                alt="Инди-заряд"
                width={250}
                height={170}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
