import React from "react";
export const MyHOC = (WC, hocProp) => props => <WC {...props} hocProp={hocProp} />;
