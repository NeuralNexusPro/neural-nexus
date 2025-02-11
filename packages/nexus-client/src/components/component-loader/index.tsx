import React from "react";
const Fallback = () => <div>组件不存在</div>

const ComponentLoader: React.FC<any> = (props) => {
  const { components, code, data } = props;
  const RenderComponent = components[code];

  return RenderComponent ? <RenderComponent {...data}/> : <Fallback/>;
}

export default ComponentLoader;
