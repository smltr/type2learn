import React from 'react';

interface ReactIconProps {
  size?: number;
}

export function ReactIcon({ size = 14 }: ReactIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="6" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="4" fill="none">
        <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(0 32 32)" />
        <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)" />
      </g>
    </svg>
  );
}
