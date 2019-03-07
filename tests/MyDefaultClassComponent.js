import React, { Component } from "react";
import MyDefaultHOC from "./hocs/MyDefaultHOC";

class MyDefaultClassComponent extends Component {
  render() {
    return <label>hello world</label>;
  }
}

export default MyDefaultHOC(MyDefaultClassComponent);
