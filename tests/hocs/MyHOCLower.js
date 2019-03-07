import React from "react";
export const myHOCLower = (WC, hocProp) => props => (
  <WC {...props} hocProp={hocProp} />
);
