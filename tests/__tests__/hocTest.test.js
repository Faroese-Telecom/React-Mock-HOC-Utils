import React from "react";
import constructMockHoc from "../../src/mockHoc";
import { shallow } from "enzyme";

describe("Base HOC mocking", () => {
  let mocked;
  it("Should be able to create a mocked HOC with non-defaulted HOC exports", () => {
    mocked = constructMockHoc("../MyClassComponent.js").mock("../hocs/MyHOC.js", "#uc");
  });

  it("Should be able to create a mocked HOC with a defaulted export", () => {
    mocked = constructMockHoc("../MyDefaultClassComponent.js").mock("../hocs/MyDefaultHOC.js");
  });

  it("Should be able to create a mocked HOC with a non-default HOC export, but with a different name than the file", () => {
    mocked = constructMockHoc("../MyClassComponentWithDifferentHOCName.js").mock(
      "../hocs/MyHOCWithDifferentName.js",
      "someOtherHocName"
    );
  });

  it("Should be able to create a mocked HOC with a non-default HOC export but the export name is lowercase", () => {
    mocked = constructMockHoc("../MyClassComponentWithLowercaseHOC.js").mock("../hocs/MyHOCLower.js", "#lc");
  });

  afterEach(() => {
    const Comp = mocked.create();
    expect(
      shallow(<Comp />)
        .dive()
        .find("label")
    ).toHaveLength(1);
  });
});

describe("HOC prop injection", () => {
  let mocked;
  it("Should be able to inject a prop into a component with non-defaulted HOC exports", () => {
    mocked = constructMockHoc("../MyClassComponent.js").mock("../hocs/MyHOC.js", "#uc");
  });

  it("Should be able to inject a prop into a component with a defaulted HOC export", () => {
    mocked = constructMockHoc("../MyDefaultClassComponent.js").mock("../hocs/MyDefaultHOC.js");
  });

  it("Should be able to inject a prop into a component with a non-default HOC export, but with a different name than the file", () => {
    mocked = constructMockHoc("../MyClassComponentWithDifferentHOCName.js").mock(
      "../hocs/MyHOCWithDifferentName.js",
      "someOtherHocName"
    );
  });

  it("Should be able to inject a prop into a component with a non-default HOC export but the export name is lowercase", () => {
    mocked = constructMockHoc("../MyClassComponentWithLowercaseHOC.js").mock("../hocs/MyHOCLower.js", "#lc");
  });

  afterEach(() => {
    const Comp = mocked.with({ hocProp: "test" }).create();

    expect(
      shallow(<Comp />)
        .dive()
        .instance().props.hocProp
    ).toBe("test");
  });
});

describe("Multiple HOCs", () => {
  it("Should be able to inject props from multiple HOCs", () => {
    const Comp = constructMockHoc("../MyClassComponentWithMultipleHOCS.js")
      .mock("../hocs/MyHOC.js", "#uc")
      .with({ myHoc: "hello" })
      .mock("../hocs/MyDefaultHOC.js")
      .with({ myDefaultHoc: "hello" })
      .create();

    const props = shallow(<Comp />)
      .dive()
      .dive()
      .instance().props;

    expect(props.myHoc).toBe("hello");
    expect(props.myDefaultHoc).toBe("hello");
  });
});

describe("Functional Components", () => {
  it("Should be able to create a HOC wrapped default functional component", () => {
    const Comp = constructMockHoc("../MyFunctionalDefaultComponent.js")
      .mock("../hocs/MyDefaultHOC.js")
      .with({ hocProp: "test" })
      .create();

    expect(Comp.props.hocProp).toBe("test");
  });
});
