import { shallow } from "enzyme";
import _ from "lodash";

export let MAX_DIVES = 50;

const invalidMessage = (methodName, component, otherName, otherValue) => {
  throw `${methodName}: either the component (${component}) or the ${otherName} (${otherValue}) is invalid`;
};

const ProviderDiver_legacy = diveTo => wrappedComponent => {
  return shallow(wrappedComponent)
    .find(diveTo)
    .dive();
};

const ProviderDeepDiver_legacy = diveTo => wrappedComponent => {
  let component = shallow(wrappedComponent);
  _.forEach(diveTo, next => {
    component = component.find(next).dive();
  });

  return component;
};

export const diveThroughComponents = (shallowComponent, diveTos) => {
  if (!shallowComponent || !diveTos)
    throw invalidMessage("diveThroughComponents", shallowComponent, "diveTos", diveTos);

  let component = shallowComponent;
  _.forEach(diveTo, next => {
    component = component.find(next).dive();
  });

  return component;
};

export const diveThroughComponent = (shallowComponent, diveTo) => {
  if (!shallowComponent || !diveTo)
    throw invalidMessage("diveThroughComponent", shallowComponent, "diveTo", diveTo);

  return shallowComponent.find(diveTo).dive();
};

export const diveStaticAmount = (shallowComponent, diveCount) => {
  if (!shallowComponent || !_.isNumber(diveCount))
    invalidMessage("diveStaticAmount", shallowComponent, "diveCount", diveCount);

  let comp = shallowComponent;
  for (let i = 0; i < diveCount; i++) {
    comp = comp.dive();
  }
  return comp;
};

export const diveSingleToComponent = (shallowComponent, diveTarget) => {
  let comp = shallowComponent;

  if (!diveTarget || !shallowComponent)
    invalidMessage("diveSingleToComponent", shallowComponent, "diveTarget", diveTarget);

  for (let i = 0; i < MAX_DIVES && comp.name() != diveTarget; i++) {
    comp = comp.dive();
  }
  return comp.dive();
};

export const diveThroughMockHocs = shallowComponent => {
  if (!shallowComponent) throw `diveThroughMocHoc: the component was invalid (${shallowComponent})`;

  let comp = shallowComponent;
  for (let i = 0; i < MAX_DIVES && comp.name() == ""; i++) {
    comp = comp.dive();
  }
  return comp.dive();
};
