import React from "react";
import MyDefaultHOC from "./MyDefaultClassComponent";

const MyFunctionalDefaultComponent = props => {
  return <label>hello world</label>;
};
export default MyDefaultHOC(MyFunctionalDefaultComponent);

export const MyFunctionalComponent = props => <label>hello world</label>;
