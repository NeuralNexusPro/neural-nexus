import _React from "react";

export default (props: any ={}) => {
  const { title } = props;

  console.log(props, 'props');
  
  return (
    <div className="header">
      <div className="title">{title}</div>
    </div>
  )
}