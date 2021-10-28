import * as React from "react";
import Svg, { Path } from "react-native-svg";
type Props = {
  size?: number | string;
  color?: string;
};

function GiftCardMedium({
  size = 16,
  color = "currentColor",
}: Props): JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.56 20.952h14.88c1.104 0 1.92-.816 1.92-1.92v-9.12c0-1.104-.816-1.92-1.92-1.92h-.624c.264-.504.408-1.08.408-1.632 0-1.8-1.44-3.312-3.288-3.312-.576 0-1.2.168-1.68.456-.816.504-1.44 1.344-1.968 2.376L12 6.408l-.288-.528c-.528-1.032-1.152-1.872-1.968-2.376a3.39 3.39 0 00-1.68-.456c-1.848 0-3.288 1.512-3.288 3.312 0 .552.144 1.128.408 1.632H4.56c-1.104 0-1.92.816-1.92 1.92v9.12c0 1.104.816 1.92 1.92 1.92zm0-1.848v-5.352h14.88v5.352a.052.052 0 01-.048.048H4.608a.052.052 0 01-.048-.048zm0-7.272V9.84c0-.024.024-.048.048-.048h14.784c.024 0 .048.024.048.048v1.992H4.56zM6 17.352h3.6v-1.92H6v1.92zM6.456 6.36c0-.864.696-1.632 1.608-1.632 1.056 0 1.68.984 2.16 1.92l.768 1.464h-1.68c-.744 0-1.56-.024-2.112-.384-.528-.288-.744-.864-.744-1.368zm6.552 1.752l.768-1.464c.48-.936 1.104-1.92 2.16-1.92.912 0 1.608.768 1.608 1.632 0 .504-.216 1.08-.744 1.368-.552.36-1.368.384-2.112.384h-1.68z"
        fill={color}
      />
    </Svg>
  );
}

export default GiftCardMedium;