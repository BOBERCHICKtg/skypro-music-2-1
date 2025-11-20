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
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUserData();
      setUser(userData);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      router.push("/auth/signin");
    } catch (error) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      setUser(null);
      router.push("/auth/signin");
    }
  };

  const getDisplayName = (): string => {
    if (isLoggingOut) {
      return "Выход...";
    }

    if (user && user.username) {
      return user.username;
    }

    if (isAuthenticated()) {
      return "Пользователь";
    }

    return "Войти в аккаунт";
  };

  const handleSidebarClick = () => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }

    if (!isLoggingOut) {
      handleLogout();
    }
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
            <use
              xlinkHref={
                isAuthenticated()
                  ? "/img/icon/sprite.svg#logout"
                  : "/img/icon/sprite.svg#login"
              }
            ></use>
          </svg>
        </div>
      </div>

      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/1">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/2">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/3">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist03.png"
                alt="day's playlist"
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
