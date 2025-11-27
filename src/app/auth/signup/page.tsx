"use client";

import { registerUser, getTokens } from "@/src/services/auth/authApi";
import styles from "./signup.module.css";
import classNames from "classnames";
import Link from "next/link";
import { ChangeEvent, useState, FormEvent } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage("");
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return setErrorMessage("Заполните все поля");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setErrorMessage("Введите корректный email");
    }

    if (password.length < 6) {
      return setErrorMessage("Пароль должен содержать минимум 6 символов");
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Пароли не совпадают");
    }

    setIsLoading(true);

    try {
      const userData = await registerUser({ email, password, username });
      console.log("Успешная регистрация:", userData);

      // После регистрации автоматически входим и получаем токены
      await getTokens({ email, password });
      console.log("Токены получены после регистрации");

      window.location.href = "/music/main";
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);

      // Обработка ошибки дублирования почты
      if (error.response?.status === 400 || error.response?.status === 409) {
        // Проверяем сообщение об ошибке или код
        const errorData = error.response?.data;

        if (
          errorData?.email?.[0]?.includes("уже существует") ||
          errorData?.detail?.includes("email") ||
          error.message?.includes("email") ||
          error.message?.includes("почт") ||
          errorData?.email?.[0]?.toLowerCase().includes("already exists") ||
          errorData?.detail?.toLowerCase().includes("already exists")
        ) {
          setErrorMessage("Пользователь с такой почтой уже существует");
        } else if (
          errorData?.username?.[0]?.includes("уже существует") ||
          errorData?.detail?.includes("username") ||
          error.message?.includes("username") ||
          error.message?.includes("имя") ||
          errorData?.username?.[0]?.toLowerCase().includes("already exists")
        ) {
          setErrorMessage("Пользователь с таким именем уже существует");
        } else {
          setErrorMessage(error.message || "Ошибка при регистрации");
        }
      } else if (error.response?.status === 500) {
        setErrorMessage("Ошибка сервера. Попробуйте позже");
      } else {
        setErrorMessage(error.message || "Ошибка при регистрации");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.modal__form} onSubmit={onSubmit}>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="email"
        name="email"
        placeholder="Почта"
        value={email}
        onChange={onChangeEmail}
        disabled={isLoading}
        required
      />

      <input
        className={styles.modal__input}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={username}
        onChange={onChangeUsername}
        disabled={isLoading}
        required
      />

      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        disabled={isLoading}
        required
        minLength={6}
      />

      <input
        className={styles.modal__input}
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        disabled={isLoading}
        required
      />

      {errorMessage && (
        <div className={styles.errorContainer}>{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={classNames(styles.modal__btnSignupEnt, {
          [styles.loading]: isLoading,
        })}
      >
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <Link href={"/auth/signin"} className={styles.modal__btnLogin}>
        Уже есть аккаунт? Войти
      </Link>
    </form>
  );
}
