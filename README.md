# React Mock HOC Utilities

A Higher-Order-Component mocking tool that allows for mocking any component that is wrapped by one or more HOCs - additionally, supporting prop injection on a per-hoc-basis. Is built for React and Jest.

To install run `npm install react-hoc-mock-utils`

The control of this tool goes through a single function called `constructMockHoc`. This function returns a `MockHoc` object, that is used to construct a mocked higher-order-component enviroment around a component.
It functions just like a regular hoc mock, using `jest.doMock`, passing in the paths and injected props and finally does a `require` of the wrapped component. Only it handles all of this behind the scenes, and structures it in a much nicer, and automated format.

Here is an example of a component that is wrapped by 3 different higher order components -
where 2 of them inject props into the component, and 1 does not:

```js
import constructMockHoc from "react-hoc-mock-utils";

const MyWrappedComponent = constructMockHoc("../MyWrappedComponent.js")
  .mock("../HigherOrderComponent__1.js")
  .with({ hoc1: "bob" })

  .mock("../HigherOrderComponent__2.js")

  .mock("../HigherOrderComponent__3.js")
  .with({ anotherProp: "flower" })

  .apply();

const mockedWrappedComponent = shallow(<MyWrappedComponent />)
  .dive()
  .dive()
  .dive();
```

Would result in getting your wrapped component, with the injected props: `{hoc1: "bob", anotherProp: "flower"}`

There is a lot going on here, so here is a break down of the `MockHoc` object and all of its functions.

# Description

The object uses a chained method design. Where the functions return the object, allowing for chaining multiple calls, as shown in the example above

## constructMockHoc

```js
const MyWrappedComponent = constructMockHoc("../MyWrappedComponent.js", __dirname, false);
```

As mentioned this function simply creates a new `MockHoc` object -
the parameters it takes, is as follows:

| Parameter                        | Type   | Description                                                                                                                                                             |
| -------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wrappedComponentPath`           | string | Is the path to the wrapped component, \*usually relative to the file that constructs the `MockHoc`.                                                                     |
| `origin` (**optional**)          | string | Sets the starting point in which to base the `wrappedComponentPath` on. If you do not specify a trailing "/", then the object will add it for you automatically         |
| `clearOnCreation` (**optional**) | bool   | the default value is true: if set to true, it will call `jest.resetModules()` before construction the `MockHoc`. This is normally true, due to the nature of unit tests |

- The reason it is **usually** relative to the file, is because as shown, you can pass in your own starting point (`origin`), but if you do not pass in an origin; then the object will automatically attempt to figure out the origin based on what file called the `constructMockHoc` function.

## mock

```js
constructMockHoc(/*...*/).mock("../HigherOrderComponent.js", "#uc", true);
```

| Parameters                     | Type   | Description                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                         | string | Is the path to the higher-order-component, if this is not defined, then the object will throw an error, relative to the origin specified in `constructMockHoc`                                                                                                                                                                                                                     |
| `methodName` (**optional**)    | string | is the name of the method, within the file specified in _path_. This parameter has two formats. if the following strings are typed in: `"#uc"` or `"#lc"`, then it will try and parse the file name from path, and then format:<br> - `"#uc"`: start with an upper-case letter <br> - `"#lc"`: starts with a lower-case letter<br><br> By default this parameter is set to `"#uc"` |
| `useCustomPath` (**optional**) | bool   | if set to true, it will append the `origin` to the path specified. This might not be desired (`false`) as sometimes you need to mock packages, and thereby do not have a physical path <br> `import React from "react"`. If set to false, it will simply ignore the `origin` and use the `path` as is.                                                                             |

## with

The with functions relative to the last `mock`. So if you call an `mock` followed by a `with`, then the props passed into that `with` will be injected into the wrapped component through that `mock`.<br>
Generally, you just need to remember that if you desire to mock a HOC, and that HOC injects props into the wrapped component, then you do one `mock` specificing the HOC, followed by a `with`, specifying what props that HOC should inject.

Additionally, you can nest `with`'s, and it will just merge the the props and add them to the last `mock`. There is no use for this behaviour, but it exists as a by-product of the chained function design.

```js
/*...*/.mock(/*...*/).with({injectedProp: "MUAHAHA"})
```

| Parameters    | Type   | Description                                                                                                                                                                                                   |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injectedProps | object | This is simply an object that is to be injected into wrapped component. Using this, it means that a prop called _injectedProp_ with the value "_MUAHAHA_" can be found in the wrapped component's prop object |

## create

The `create` method is the only thing that does not return itself, but instead, it returns the desired export of the WrappedComponent file path. Because of that, this is the method you call when you have nothing left to chain, and it is ready to formulate the mocked Wrapped Component

```js
/*...*/.mock(/*...*/).create("default");
```

| Parameters            | Type   | Description                                                                                                                                                        |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| target (**optional**) | string | is used to fetch a specific export within the wrapped pomponent `path` (the path provided in the `constructMockHoc`). By default it is set to the `default` export |

<br>

---

This library mixes well with the [test-component-builder](https://github.com/Faroese-Telecom/Test-Component-Builder), to allow for easy to setup tests
