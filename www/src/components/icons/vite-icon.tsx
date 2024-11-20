import React from "react";

const ViteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={52}
    height={50}
    viewBox="0 0 52 50"
    fill="none"
    aria-label="Vite logomark"
    {...props}
  >
    <path
      fill="url(#1)"
      d="m50.238 7.367-22.772 40.72c-.47.841-1.678.846-2.155.01L2.087 7.37c-.52-.912.26-2.016 1.293-1.832l22.797 4.075c.145.026.294.026.44 0l22.32-4.069c1.029-.187 1.812.908 1.301 1.822Z"
    />
    <path
      fill="url(#2)"
      d="M37.036.195 20.184 3.497a.619.619 0 0 0-.499.57l-1.037 17.509a.619.619 0 0 0 .757.64l4.692-1.084a.619.619 0 0 1 .745.727l-1.393 6.826a.619.619 0 0 0 .786.716l2.898-.88c.449-.137.88.257.785.717L25.703 39.96c-.139.67.754 1.036 1.126.461l.248-.384L40.81 12.633a.619.619 0 0 0-.67-.885l-4.83.932a.619.619 0 0 1-.712-.78L37.75.975a.619.619 0 0 0-.713-.78Z"
    />
    <defs>
      <linearGradient
        id="1"
        x1={1.52}
        x2={29.862}
        y1={4.084}
        y2={42.574}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#41D1FF" />
        <stop offset={1} stopColor="#BD34FE" />
      </linearGradient>
      <linearGradient
        id="2"
        x1={24.868}
        x2={29.995}
        y1={1.091}
        y2={36.261}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFEA83" />
        <stop offset={0.083} stopColor="#FFDD35" />
        <stop offset={1} stopColor="#FFA800" />
      </linearGradient>
    </defs>
  </svg>
);
export { ViteIcon };
