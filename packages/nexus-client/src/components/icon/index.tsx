import { memo, FC } from "react";
import { createFromIconfontCN } from "@ant-design/icons";

interface IconProps {
  type: string;
  className?: string;
  title?: string;
  onClick?(event: React.MouseEvent): void;
  style?: React.CSSProperties;
}

const scriptUrl = "//at.alicdn.com/t/c/font_2473458_z355a5tsyf.js";
const IconFont = createFromIconfontCN({
  scriptUrl,
});

const MyIcon: FC<IconProps> = ({ type, className, title, onClick, style }) => {
  return (
    <IconFont
      type={`custom-icon-${type}`}
      className={className && className}
      title={title}
      onClick={onClick}
      style={style}
    />
  );
};
export default memo(MyIcon);
