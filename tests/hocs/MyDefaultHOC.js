import React from "react";
const MyDefaultHOC = (WC, hocProp) => props => (
  <WC {...props} hocProp={hocProp} />
);

export default MyDefaultHOC;
