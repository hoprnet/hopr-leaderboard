import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Buttons } from "./buttons";

import '../../../.storybook/stories-styles.css';

export default {
  title: "atoms/Button",
  component: Buttons,
} as ComponentMeta<typeof Buttons>;

const Template: ComponentStory<typeof Buttons> = (args) => (
  <Buttons {...args} />
);

export const Example = Template.bind({});
Example.args = {
  text: "Agregar",
  disabled: false,
  className: "storybook-button"
};
