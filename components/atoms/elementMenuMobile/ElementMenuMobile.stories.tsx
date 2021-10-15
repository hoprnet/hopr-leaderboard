import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ElementMenuMobile } from "./elementMenuMobile";
import file from "../../../public/assets/icons/home.svg";

export default {
  title: "atoms/ElementMenuMobile",
  component: ElementMenuMobile,
} as ComponentMeta<typeof ElementMenuMobile>;

const Template: ComponentStory<typeof ElementMenuMobile> = (args) => (
  <ElementMenuMobile {...args} />
);

export const Example = Template.bind({});
Example.args = {
  href: "/",
  className: 'storybook-MenuItemMobile storybook-MenuItemMobileP storybook-MenuItemMobileImage',
  alt: "HOPR network",
  p: "Network",
  src: file
};
