import * as React from "react";
import Svg, { Path } from "react-native-svg";
type Props = {
  size?: number | string;
  color?: string;
};

function CoinsMedium({
  size = 16,
  color = "currentColor",
}: Props): JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.648 21.372c3.936 0 7.032-1.272 7.032-3.504v-1.44c2.712-.384 4.728-1.536 4.728-3.336V6.108c0-2.232-3-3.48-7.032-3.48-3.864 0-7.056 1.224-7.056 3.48v1.44c-2.736.408-4.728 1.536-4.728 3.336v6.984c0 2.232 3.048 3.504 7.056 3.504zm-5.376-3.504v-1.056c1.272.72 3.192 1.104 5.376 1.104 2.16 0 4.08-.384 5.352-1.104v1.056c0 1.008-1.92 1.824-5.352 1.824-3.504 0-5.376-.816-5.376-1.824zm0-3.456v-1.128c1.272.72 3.192 1.104 5.376 1.104 2.16 0 4.08-.384 5.352-1.104v1.128c0 1.008-1.92 1.824-5.352 1.824-3.504 0-5.376-.816-5.376-1.824zm0-3.528c0-1.008 1.944-1.8 5.376-1.8 3.528 0 5.352.792 5.352 1.8s-1.92 1.824-5.352 1.824c-3.504 0-5.376-.816-5.376-1.824zM9 6.108c0-1.008 1.944-1.8 5.376-1.8 3.528 0 5.352.792 5.352 1.8s-2.4 2.064-6.072 1.8c-.936-.264-2.016-.432-3.216-.48C9.48 7.092 9 6.612 9 6.108zm7.224 3.408c1.392-.168 2.616-.504 3.504-1.008v1.128c0 .744-1.008 1.368-3.048 1.656v-.408c0-.504-.168-.96-.456-1.368zm.456 5.232v-1.776c1.176-.168 2.232-.48 3.048-.936v1.056c0 .744-1.008 1.368-3.048 1.656z"
        fill={color}
      />
    </Svg>
  );
}

export default CoinsMedium;