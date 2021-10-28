import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NanoFirmwareUpdateThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 21.12H21.3601V15.36H2.64014V21.12ZM3.12014 20.64V15.84H11.6161C10.8481 16.344 10.3441 17.232 10.3201 18.216C10.3441 19.224 10.8481 20.112 11.6161 20.64H3.12014ZM7.65614 8.856L12.0001 13.2L16.3441 8.856L16.0081 8.52L14.2081 10.32L12.2401 12.288V2.88H11.7601V12.288L9.79214 10.32L7.99214 8.52L7.65614 8.856ZM10.8001 18.216C10.8241 16.92 11.8801 15.84 13.1761 15.84H20.8801V20.64H13.1761C11.8801 20.64 10.8241 19.56 10.8001 18.216ZM11.8081 18.24C11.8081 19.032 12.4561 19.68 13.2481 19.68C14.0401 19.68 14.6881 19.032 14.6881 18.24C14.6881 17.448 14.0401 16.8 13.2481 16.8C12.4561 16.8 11.8081 17.448 11.8081 18.24ZM12.2881 18.24C12.2881 17.712 12.7201 17.28 13.2481 17.28C13.7761 17.28 14.2081 17.712 14.2081 18.24C14.2081 18.768 13.7761 19.2 13.2481 19.2C12.7201 19.2 12.2881 18.768 12.2881 18.24Z"
        fill={color}
      />
    </svg>
  );
}

export default NanoFirmwareUpdateThin;