import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ElementMenuDesktop } from "./elementMenuDesktop";
import file from "../../../public/assets/icons/horp_icon.svg";

export default {
  title: "atoms/ElementMenuDesktop",
  component: ElementMenuDesktop,
} as ComponentMeta<typeof ElementMenuDesktop>;

const Template: ComponentStory<typeof ElementMenuDesktop> = (args) => (
  <ElementMenuDesktop {...args} />
);

export const Example = Template.bind({});
Example.args = {
  className: "storybook-MenuItemDesktop storybook-MenuItemDesktopImage ",
  href: "sadasdas",
  alt: "HOPR NFTs",
  p: "NFTs",
  src: file
};
