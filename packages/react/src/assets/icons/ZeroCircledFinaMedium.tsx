import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ZeroCircledFinaMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4402 16.7039C12.9122 16.7039 14.2082 14.8559 14.2082 12.0239C14.2082 9.16789 12.9362 7.34389 10.4402 7.34389C7.96819 7.34389 6.6482 9.19189 6.6482 12.0239C6.6482 14.8559 7.96819 16.7039 10.4402 16.7039ZM4.2002 21.3599H10.4402C15.6962 21.3599 19.8002 17.0879 19.8002 11.9999C19.8002 6.76789 15.6722 2.63989 10.4402 2.63989H4.2002V4.55989H10.4402C14.6162 4.55989 17.8802 7.82389 17.8802 11.9999C17.8802 16.0559 14.6162 19.4399 10.4402 19.4399H4.2002V21.3599ZM8.64019 13.1519V10.9439C8.64019 9.26389 9.1442 8.95189 10.4162 8.95189C11.1362 8.95189 11.6162 9.04789 11.9042 9.45589L8.64019 13.1519ZM8.92819 14.6399L12.2162 10.9439V13.1759C12.2162 14.8319 11.6882 15.1439 10.4162 15.1439C9.6962 15.1439 9.2162 15.0479 8.92819 14.6399Z"
        fill={color}
      />
    </svg>
  );
}

export default ZeroCircledFinaMedium;