import React, { Component } from "react";
import { someOtherHocName } from "./hocs/MyHOCWithDifferentName";

class MyDefaultClassComponent extends Component {
  render() {
    return <label>hello world</label>;
  }
}

export default someOtherHocName(MyDefaultClassComponent);
