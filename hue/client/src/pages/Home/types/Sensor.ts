export type Sensor = {
  name: string;
  type: string;
  modelid: string;
  manufacturername: string;
  swversion: string;
  uniqueid: string;
  recycle: boolean;
  state: {
    daylight: boolean;
    lastupdated: string;
  };
  config: {
    on: boolean;
    long: string;
    lat: string;
    sunriseoffset: number;
    sunsetoffset: number;
  };
  capabilities: {
    certified: boolean;
    primary: boolean;
    inputs: [
      {
        repeatintervals: number[];
        events: [
          {
            buttonevent: number;
            eventtype: string;
          }
        ];
      }
    ];
  };
};
