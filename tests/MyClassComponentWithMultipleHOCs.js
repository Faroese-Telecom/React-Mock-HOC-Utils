import React, { Component } from "react";
import { MyHOC } from "./hocs/MyHOC";
import MyDefaultHOC from "./hocs/MyDefaultHOC";

class MyClassComponentWithMultipleHOCS extends Component {
  render() {
    return <label>hello world</label>;
  }
}

export default MyHOC(MyDefaultHOC(MyClassComponentWithMultipleHOCS));
