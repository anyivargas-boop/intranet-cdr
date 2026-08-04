import React from 'react';

export const DriveIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13,20H6l7.33-12.67l3.5,6.04L13,20z M21.67,14l-3.5,6.04H14l3.5-6.04L21.67,14z M10.67,4L14,9.78l-3.33,5.78L7.33,9.78L10.67,4z" />
  </svg>
);
