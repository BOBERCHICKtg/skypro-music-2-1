import styles from "./progressBar.module.css";
import { ChangeEvent } from "react";

type progressBarProp = {
  max: number;
  value: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
};

export default function ProgressBar({
  max,
  value,
  step,
  onChange,
  readOnly,
}: progressBarProp) {
  return (
    <input
      className={styles.styledProgressInput} // Применение стилей к ползунку
      type="range" // Тип элемента - ползунок
      min="0" // Минимальное значение ползунка
      max={max} // Максимальное значение, зависит от длительности аудио
      value={value} // Текущее значение ползунка
      step={step} // Шаг изменения значения
      onChange={onChange} // Обработчик события изменения
      readOnly={readOnly}
    />
  );
}
