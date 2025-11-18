import Image from "next/image";
import Link from "next/link";
import styles from "./mainsidebar.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/src/services/auth/authApi";

export default function MainSidebar() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      router.push('/auth/signin')
    } catch (error) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      router.push('/auth/signin')
    }
  }

  return (
    <div className={styles.main__sidebar}>
      <div 
      className={styles.sidebar__personal}
      onClick={handleLogout}
      style={{ 
        cursor: isLoggingOut ? 'not-allowed' : 'pointer',
        opacity: isLoggingOut ? 0.7 : 1
      }}
    >
      <p className={styles.sidebar__personalName}>
        {isLoggingOut ? 'Выход...' : 'Sergey.Ivanov'}
      </p>
      <div className={styles.sidebar__icon}>
        <svg>
          <use xlinkHref="/img/icon/sprite.svg#logout"></use>
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
