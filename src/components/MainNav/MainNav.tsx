"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./mainnav.module.css";
import { useState, useEffect } from "react";
import { getAuthToken, logoutUser } from "@/src/services/auth/authApi";
import { useRouter } from "next/navigation";

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию при загрузке компонента
    const token = getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      // Остаемся на текущей странице
      router.refresh(); // Обновляем страницу чтобы применить изменения
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      // Все равно очищаем локальное состояние
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      router.refresh();
    }
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    // Переход на страницу входа произойдет через Link
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={"logo"}
        />
      </div>
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div
        className={`${styles.nav__menu} ${
          isMenuOpen ? styles.menu__active : ""
        }`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link
              href="/"
              className={styles.menu__link}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
          </li>

          {/* Показываем "Мой плейлист" только для авторизованных пользователей */}
          {isAuthenticated && (
            <li className={styles.menu__item}>
              <Link
                href={"/music/favorites"}
                className={styles.menu__link}
                onClick={() => setIsMenuOpen(false)}
              >
                Мой плейлист
              </Link>
            </li>
          )}

          {/* Показываем либо Войти, либо Выйти */}
          {isAuthenticated ? (
            <li className={styles.menu__item}>
              <button
                className={styles.menu__link}
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                }}
              >
                Выйти
              </button>
            </li>
          ) : (
            <li className={styles.menu__item}>
              <Link
                href={"/auth/signin"}
                className={styles.menu__link}
                onClick={handleLogin}
              >
                Войти
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
