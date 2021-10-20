import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WalletThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.04012 19.92H20.8801V7.19999H6.36012V7.67999H20.4001V19.44H5.04012C4.12812 19.44 3.60012 18.912 3.60012 18V5.99999C3.60012 5.08799 4.12812 4.55999 5.04012 4.55999H18.8161C18.4801 4.24799 18.0241 4.07999 17.5201 4.07999H5.04012C3.93612 4.07999 3.12012 4.89599 3.12012 5.99999V18C3.12012 19.104 3.93612 19.92 5.04012 19.92ZM15.4801 13.656C15.4801 14.112 15.8641 14.52 16.3441 14.52C16.7761 14.52 17.1601 14.112 17.1601 13.656C17.1601 13.224 16.7761 12.84 16.3441 12.84C15.8641 12.84 15.4801 13.224 15.4801 13.656Z"
        fill={color}
      />
    </svg>
  );
}

export default WalletThin;