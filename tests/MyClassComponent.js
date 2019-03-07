import React, { Component } from "react";
import { MyHOC } from "./hocs/MyHOC";

class MyClassComponent extends Component {
  render() {
    return <label>class</label>;
  }
}

export default MyHOC(MyClassComponent);
