export type Group = {
  name: string;
  lights: string[];
  sensors: string[];
  type: string;
  state: {
    all_on: boolean;
    any_on: boolean;
  };
  recycle: boolean;
  class: string;
  action: {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    effect: string;
    xy: number[];
    ct: number;
    alert: string;
    colormode: string;
  };
};
