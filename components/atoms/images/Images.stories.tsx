import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Images } from "./images";
import file from "../../../public/assets/icons/copy.svg";

export default {
  title: "atoms/Images",
  component: Images,
} as ComponentMeta<typeof Images>;

const Template: ComponentStory<typeof Images> = (args) => <Images {...args} />;

export const Example = Template.bind({});
Example.args = {
  alt: "copy",
  src: file
};
