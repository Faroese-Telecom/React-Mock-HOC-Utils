# React Mock HOC Utilities

This package of Higher-Order-Component utilities contain the following:

- [Mocking Higher Order Components](#Mock-Hoc)
- [Diving Through Shallow Components](#Diving-Utilities)

This library mixes well with the [test-component-builder](https://github.com/Faroese-Telecom/Test-Component-Builder), to allow for easy to setup tests

<br>

# Mock Hoc

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

  .create();

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
constructMockHoc(/*...*/).mock(
  "../HigherOrderComponent.js",
  "#uc",
  (path, method) => jest.doMock(path, () => method))
);
```

| Parameters                           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                               | string   | Is the path to the higher-order-component, if this is not defined, then the object will throw an error, relative to the origin specified in `constructMockHoc`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `methodName` (**optional**)          | string   | is the name of the method, within the file specified in _path_. This parameter has two formats. if the following strings are typed in: `"#uc"` or `"#lc"`, then it will try and parse the file name from path, and then format:<br> - `"#uc"`: start with an upper-case letter <br> - `"#lc"`: starts with a lower-case letter<br><br> By default this parameter is set to `"#uc"`                                                                                                                                                                                                                                                |
| `contextModuleMethod` (**optional**) | function | by default, this value is set to use `jest.doMock` internally. This is fine for cases where custom higher order components are used. <br/> However, when you have to mock another installed module, you will have to provide your own method. This method can be the exact same as shown in the snippet above. <br> The reason for this limitation, is because the `react-moc-hoc-utils` module does not know of the existence of the other installed modules. Using your own method however works, because then the scope of the mock is in your project, whereas otherwise it would be within the `react-moc-hoc-utils` package |

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

## createPure

The `createPure` is a simplified version of the regular `create` function, where it mocks the component and does a simple `require`. Whereas, `create`, does the same, only it also auto extracts the `export` method of your choice from the required file

```js
/*...*/.mock(/*...*/).createPure();
```

This may be desirable, if the mocked component does not contain a `default` export, or any other export object for that matter.

<br>

---

<br>

# Diving Utilities

There are multiple shallow diving methods available in this utility - they are as follows:

Each of one of them take in a `shallow` component as their first parameter. Meaning that for it to function, you have to pass in a `shallow` object by [Enzyme](https://github.com/airbnb/enzyme). The reason for it is because of the diving method inside the `shallow` object. Each one returns a `shallow` object back in respect to the amount of dives it did.

```js
diveThroughComponents(shallow(<MyComponent />), [View, Text]);
```

| Parameters | Type                 | Description                                                                                                                            |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| diveTos    | array [*components*] | Will find the component in the array, and then proceed to dive through it, repating itself until it has iterated over the entire array |

<br/>
<br/>

```js
diveThroughComponent(shallow(<MyComponent />), View);
```

| Parameters | Type   | Description                                                                                                                                           |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| diveTo     | object | Functions just like the previous method, only it dives through a single layer. Meaning that he will find the component and dive through it, then stop |

<br/>
<br/>

```js
diveStaticAmount(shallow(<MyComponent />), 3);
```

| Parameters | Type   | Description                                                                                                        |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| diveCount  | number | Will very simply dive through the shallow component n number of times, using the first element it finds per layer) |

<br/>
<br/>

```js
diveSingleToComponent(shallow(<MyComponent />), "MySwimSuitComponent");
```

| Parameters | Type   | Description                                                                                                                                                   |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| diveTarget | string | Will dive down the first element per layer, where it checks against each one for the name that matches `diveTarget`. If it finds one, then return the object. |

<br/>
<br/>

```js
diveThroughMockHocs(shallow(<MyComponent />));
```

Will attempt to dive through each of the mocked higher order components that wrap `MyComponent`.

<br/>

`diveSingleToComponent` and `diveThroughMockHocs` both have a max dive depth, of `50` by default. This can be altered by changing the value of the static property `MAX_DIVES`
