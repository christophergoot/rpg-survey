import React from 'react'

interface D20IconProps {
  size?: number
  className?: string
}

export const D20Icon: React.FC<D20IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id={`d20gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00d9ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0066ff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* D20 outline */}
      <path
        d="M50 5 L85 30 L85 70 L50 95 L15 70 L15 30 Z"
        fill={`url(#d20gradient-${size})`}
        stroke="#003366"
        strokeWidth="2"
      />

      {/* Inner facets for 3D effect */}
      <path
        d="M50 5 L50 50 L85 30 Z"
        fill="rgba(255,255,255,0.1)"
        stroke="#003366"
        strokeWidth="1"
      />
      <path
        d="M50 5 L50 50 L15 30 Z"
        fill="rgba(255,255,255,0.15)"
        stroke="#003366"
        strokeWidth="1"
      />
      <path
        d="M50 95 L50 50 L85 70 Z"
        fill="rgba(0,0,0,0.2)"
        stroke="#003366"
        strokeWidth="1"
      />
      <path
        d="M50 95 L50 50 L15 70 Z"
        fill="rgba(0,0,0,0.15)"
        stroke="#003366"
        strokeWidth="1"
      />
      <path
        d="M15 30 L50 50 L15 70 Z"
        fill="rgba(255,255,255,0.05)"
        stroke="#003366"
        strokeWidth="1"
      />
      <path
        d="M85 30 L50 50 L85 70 Z"
        fill="rgba(0,0,0,0.1)"
        stroke="#003366"
        strokeWidth="1"
      />

      {/* Number 20 */}
      <text
        x="50"
        y="58"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        stroke="#003366"
        strokeWidth="0.5"
      >
        20
      </text>
    </svg>
  )
}
