import React from "react";
import BadgeComponent, { Props } from "./Badge";
import Icon from "../../asorted/Icon";
import FlexBox from "../../layout/Flex";

export default {
  title: "Messages/Notifications/Badge",
  component: BadgeComponent,
  argTypes: {
    active: {
      type: "boolean",
      defaultValue: false,
    },
    icon: { control: false },
    theme: { table: { disable: true } },
    as: { table: { disable: true } },
    forwardedAs: { table: { disable: true } },
  },
};

export const Badge = (args: Props): JSX.Element => {
  return (
    <FlexBox style={{ columnGap: "2em" }}>
      <BadgeComponent
        {...args}
        color="palette.warning.c100"
        backgroundColor="palette.warning.c10"
        icon={<Icon name="Warning" size={24} />}
      />
      <BadgeComponent
        {...args}
        color="palette.primary.c100"
        backgroundColor="palette.primary.c10"
        icon={<Icon name="Info" size={24} weight="Medium" />}
      />
    </FlexBox>
  );
};