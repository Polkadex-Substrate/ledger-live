import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BuyCryptoAltLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C16.4399 4.08 19.9199 7.56 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C7.55988 19.92 4.07988 16.44 4.07988 12ZM8.32788 13.416C8.32788 15.312 9.64788 16.632 11.5679 16.8V17.976H12.4559V16.8C14.2559 16.632 15.5999 15.528 15.5999 13.944C15.5999 12.528 14.5439 11.688 12.9359 11.472L11.3759 11.28C10.2719 11.136 9.76788 10.704 9.76788 9.816C9.76788 8.71201 10.6319 8.16001 12.0239 8.16001C13.5359 8.16001 14.2559 8.856 14.2319 10.272H15.4079C15.4079 8.592 14.1839 7.32 12.4559 7.152V5.976H11.5679V7.152C9.88788 7.32 8.63988 8.4 8.63988 9.86401C8.63988 11.232 9.52788 12.048 11.0399 12.24L12.5999 12.456C13.8479 12.624 14.4239 13.056 14.4239 14.016C14.4239 15.192 13.5839 15.768 12.0239 15.768C10.2719 15.768 9.45588 15.048 9.45588 13.416H8.32788Z"
        fill={color}
      />
    </svg>
  );
}

export default BuyCryptoAltLight;