import * as icons from "react-icons/fa";

type IconName = keyof typeof icons;

type Props = {
  iconName: IconName;
  className?: string;
};

const Icon = ({ iconName, className, ...props }: Props) => {
  const IconComponent = icons[iconName] as any;
  return <IconComponent {...props} className={className} />;
};

export default Icon;
