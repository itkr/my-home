export type Config = {
  name: string;
  zigbeechannel: number;
  bridgeid: string;
  mac: string;
  dhcp: boolean;
  ipaddress: string;
  netmask: string;
  gateway: string;
  proxyaddress: string;
  proxyport: number;
  UTC: string;
  localtime: string;
  timezone: string;
  modelid: string;
  datastoreversion: string;
  swversion: string;
  apiversion: string;
  swupdate: {
    updatestate: number;
    checkforupdate: boolean;
    devicetypes: {
      bridge: boolean;
      lights: number[];
      sensors: number[];
    };
    url: string;
    text: string;
    notify: boolean;
  };
  linkbutton: boolean;
  portalservices: boolean;
  portalconnection: string;
  portalstate: {
    signedon: boolean;
    incoming: boolean;
    outgoing: boolean;
    communication: string;
  };
  factorynew: boolean;
  replacesbridgeid: string;
  backup: {
    status: string;
    errorcode: number;
  };
  starterkitid: string;
  whitelist: {
    [key: string]: {
      "last use date": string;
      "create date": string;
      name: string;
    };
  };
};
