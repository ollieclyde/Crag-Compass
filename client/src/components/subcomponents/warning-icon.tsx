import React from "react";
import { Icon, Box } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { IconType } from "react-icons/lib";

// Define the props type
interface WarningIconProps {
  accessType?: number;
}

// Define the color and icon mappings
const warningColor: { [key: number]: string } = {
  1: "blue",
  2: "yellow",
  3: "red",
};

const warningIcon: { [key: number]: IconType } = {
  1: FaInfoCircle,
  2: IoMdWarning,
  3: RiErrorWarningFill,
};

const WarningIcon: React.FC<WarningIconProps> = ({ accessType }) => {
  if (
    !accessType ||
    !(accessType in warningColor && accessType in warningIcon)
  ) {
    return null;
  }

  const IconComponent = warningIcon[accessType];
  const color = warningColor[accessType];

  return <Icon boxSize={8} color={color} as={IconComponent} />;
};

export default WarningIcon;
