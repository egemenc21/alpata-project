/* eslint-disable react-refresh/only-export-components */
import {ButtonHTMLAttributes} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: BUTTON_TYPE_CLASSES;
}
export enum BUTTON_TYPE_CLASSES {
  base = "base",
  inverted = "inverted"
}

function BaseButton({
  children,
  onClick,
  type = "submit",
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-4 bg-blue-700 text-white rounded-lg"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function InvertedButton({
  children,
  onClick,
  type = "submit",
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-4 bg-blue-300 text-gray-700 rounded-lg"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) =>
  ({
    [BUTTON_TYPE_CLASSES.base]: BaseButton,
    [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,

  }[buttonType]);

function Button({children, onClick, buttonType, type}: ButtonProps) {
  const CustomButton = getButton(buttonType);
  return (
    <CustomButton onClick={onClick} type={type}>
      {children}
    </CustomButton>
  );
}

export default Button;
