import React, { Component } from "react";
import { myHOCLower } from "./hocs/MyHOCLower";

class MyDefaultClassComponent extends Component {
  render() {
    return <label>hello world</label>;
  }
}

export default myHOCLower(MyDefaultClassComponent);
