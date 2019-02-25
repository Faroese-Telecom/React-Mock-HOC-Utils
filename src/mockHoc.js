import React from "react";
import _ from "lodash";
import { GetFileName, SetFirstCase } from "./utils";

const path = require("path");
const stack = require("callsite");

// * -------------- Higher-Order-Component Mocking -------------- *
export const jestMockHocMethod = (path, method) => jest.doMock(path, () => method);

const MockHOC = (path, methodName, mockFunction) => hocProp => {
  if (!path || typeof path !== "string")
    throw `MockHoc | MockHocHierarchy: the path provided was not valid, but instead: ${path}`;
  if (!methodName || typeof methodName !== "string")
    throw `MockHoc | MockHocHierarchy: the methodName provided was not valid, but instead: ${methodName}`;

  let mockMethod = {};
  mockMethod[methodName] = WrappedComponent => props => {
    if (hocProp) props = _.assign(hocProp, props);

    return <WrappedComponent {...props} />;
  };
  mockFunction(path, mockMethod);
  //jest.doMock(path, () => mockMethod);
};

const MockHOCHierarchy = mocks => requireName => {
  if (!Array.isArray(mocks))
    throw `MockHocHierarchy: the mocked data is not an arrays, but instead: ${mocks}`;

  mocks.forEach(mock => {
    const { path, methodName, hocProp, contextModuleMethod } = mock;
    MockHOC(path, methodName, contextModuleMethod)(hocProp);
  });

  return require(requireName);
};

class MockHoc {
  constructor(wrappedComponentPath, origin, clearOnCreation) {
    this.mock = this.mock.bind(this);
    this.with = this.with.bind(this);
    this.clear = this.clear.bind(this);
    this.create = this.create.bind(this);
    this.createPure = this.createPure.bind(this);

    if (clearOnCreation) this.clear();

    this.requiredPath = wrappedComponentPath;
    this.origin = origin;

    this.imported = [];

    // ? this parses the file name to potential get the function/class name of the "imported" module
    // ?? this is used, in case the provided apply method does not find an export with the name of >target<
    this.potentialRequireMethodName = GetFileName(wrappedComponentPath);

    // ? if the origin is not specifided, then try to determine it through the call-stack
    if (!this.origin) {
      const sites = stack();
      if (sites.length >= 3) this.origin = path.dirname(sites[2].getFileName());
    }

    // ? if the origin does not end with a trailing '/', then one needs to be added to reduce failure from origin + path
    if (this.origin && this.origin[this.origin.length - 1] != "/") this.origin += "/";
  }

  mock(path, methodName = "#uc", contextModuleMethod = null) {
    if (!path || typeof path !== "string") throw `MockHoc: [mock] missing path, instead recieved ${path}`;

    // ? if no method is specified then try and parse it out of the path
    if (!methodName || typeof methodName !== "string") methodName = "#uc";

    if (methodName == "#uc" || methodName == "#lc") methodName = SetFirstCase(GetFileName(path), methodName); // ? <-- methodName can be a number matching the StartingCase, if it is not a string

    if (typeof contextModuleMethod !== "function") {
      path = this.origin + path;
      contextModuleMethod = jestMockHocMethod;
    }

    // ? store it for when applied is called
    this.imported.push({
      path,
      methodName,
      hocProp: {},
      contextModuleMethod
    });

    return this;
  }

  with(injectedProps) {
    const importCount = this.imported.length;
    if (importCount < 1) return;

    this.imported[importCount - 1].hocProp = _.assign(this.imported[importCount - 1].hocProp, injectedProps);

    return this;
  }

  clear() {
    jest.resetModules();
    return this;
  }

  createPure() {
    return MockHOCHierarchy(this.imported)(this.origin + this.requiredPath);
  }

  create(target = "default") {
    const req = MockHOCHierarchy(this.imported)(this.origin + this.requiredPath);

    // ? if the specified target is not found, then attempt to find a predicted target name instead
    // ?? if it finds neither, then throw a detailed, helpful error (as opposed to how jest handles it)
    if (!req[target]) {
      if (!req[this.potentialRequireMethodName])
        throw `MockHoc [create]: could not find the exported target, "${target}", nor could it find the fallback target, "${
          this.potentialRequireMethodName
        }"`;

      target = this.potentialRequireMethodName;
    }
    return req[target];
  }
}

const constructMockHoc = (wrappedComponentPath, origin = null, clearOnCreation = true) =>
  new MockHoc(wrappedComponentPath, origin, clearOnCreation);

export default constructMockHoc;
