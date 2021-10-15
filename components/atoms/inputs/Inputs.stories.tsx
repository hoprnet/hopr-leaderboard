import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Inputs } from "./inputs";

export default {
  title: "atoms/Inputs",
  component: Inputs,
} as ComponentMeta<typeof Inputs>;

const Template: ComponentStory<typeof Inputs> = (args) => <Inputs {...args} />;

export const Example = Template.bind({});
Example.args = {
  type: "checkbox",
  checked: true,
  placeholder: "example",
  value: "example",
};
