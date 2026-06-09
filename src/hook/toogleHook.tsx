import { TouchEvent, MouseEvent } from 'react';

export const useToggleClick = (callback: () => void) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    callback();
  };

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    callback();
  };

  return { onClick: handleClick, onTouchEnd: handleTouchEnd };
};