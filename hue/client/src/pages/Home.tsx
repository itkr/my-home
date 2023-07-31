import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Stack,
  Heading,
  HStack,
  Flex,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { HuePicker, AlphaPicker } from "react-color";
import { FC, useEffect, useState } from "react";
import axios from "axios";

type Light = {
  name: string;
  state: {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    effect: string;
    xy: number[];
    ct: number;
    alert: string;
    colormode: string;
    mode: string;
    reachable: boolean;
  };
  type: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: {
    certified: boolean;
    control: {
      mindimlevel: number;
      maxlumen: number;
      colorgamuttype: string;
      colorgamut: number[][];
      ct: {
        min: number;
        max: number;
      };
    };
    streaming: {
      renderer: boolean;
      proxy: boolean;
    };
  };
  config: {
    archetype: string;
    function: string;
    direction: string;
    startup: {
      mode: string;
      configured: boolean;
    };
  };
  uniqueid: string;
  swversion: string;
  swconfigid: string;
  productid: string;
};

type Group = {
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

type Schedule = {
  name: string;
  description: string;
  command: {
    address: string;
    body: {
      scene: string;
    };
    method: string;
  };
  status: string;
  time: string;
  localtime: string;
  created: string;
  autodelete: boolean;
  starttime: string;
};

type Sensor = {
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

type Scene = {
  name: string;
  lights: string[];
  owner: string;
  recycle: boolean;
  locked: boolean;
  appdata: {
    version: number;
    data: string;
  };
  picture: string;
  lastupdated: string;
  version: number;
};

type Rule = {
  name: string;
  owner: string;
  created: string;
  lasttriggered: string;
  timestriggered: number;
  status: string;
  conditions: [
    {
      address: string;
      operator: string;
      value: string;
    }
  ];
  actions: [
    {
      address: string;
      method: string;
      body: {
        scene: string;
      };
    }
  ];
};

type ResourceLink = {
  name: string;
  description: string;
  type: string;
  classid: number;
  owner: string;
  links: string[];
};

type Capabilities = {
  lights: {
    available: number;
    total: number;
  };
  sensors: {
    available: number;
    total: number;
  };
  groups: {
    available: number;
    total: number;
  };
  scenes: {
    available: number;
    total: number;
  };
  rules: {
    available: number;
    total: number;
  };
  schedules: {
    available: number;
    total: number;
  };
  resourcelinks: {
    available: number;
    total: number;
  };
};

type Config = {
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

const useLights = () => {
  const ip = "192.168.1.2";
  const username = "9cjWI194Z58UwXDBKww9SMlZLrLH-0k01Gdjr1hv";
  const [lights, setLights] = useState<Record<string, Light>>({});
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});

  const listSchedules = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/schedules`;
    return await axios.get(url).then((res) => {
      setSchedules(res.data);
    });
  };

  const listGroups = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/groups`;
    return await axios.get(url).then((res) => {
      setGroups(res.data);
    });
  };

  const listLights = async (): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => {
      setLights(res.data);
    });
  };

  const getLight = async (deviceId: string): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => {
      setLights((prev) => ({ ...prev, [deviceId]: res.data }));
      return res.data;
    });
  };

  const toggleLight = async (deviceId: string): Promise<any> => {
    return await putLight(deviceId, { on: !lights[deviceId].state.on });
  };

  const putLight = async (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };

  return {
    getLight,
    groups,
    lights,
    listGroups,
    listLights,
    listSchedules,
    putLight,
    schedules,
    toggleLight,
  };
};

const LightCard: FC<{
  deviceId: string;
  defaultLight: Light;
}> = ({ deviceId, defaultLight }) => {
  const { putLight, getLight, toggleLight } = useLights();
  const [light, setLight] = useState<Light>(defaultLight);
  const [hex, setHex] = useState<string>("#fff");
  const [hue, setHue] = useState<number>(
    (defaultLight.state.hue / 65535) * 360
  );

  const refresh = async () => {
    return await getLight(deviceId).then(async (light) => {
      await setLight(light);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Card>
      <CardHeader>
        <HStack spacing={3}>
          <Avatar size="sm" name={light.name} bg="gray.500" />
          <Heading as="h3" size="md">
            {light.name}
          </Heading>
        </HStack>
      </CardHeader>
      <CardBody
        // bg={hex}
        // bg={`hsl(${(light.state.hue / 65535) * 360}, 100%, 50%)`}
        // hsv?
        bg={`hsl(${(light.state.hue / 65535) * 360}, ${
          (light.state.sat / 254) * 100
        }%, ${(light.state.bri / 254) * 100}%)`}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stack>
            <HStack>
              <Box>H</Box>
              <HuePicker
                color={{ h: hue, s: 254, l: 254 }}
                onChange={(color) => {
                  if (!light.state.on) return;
                  setHue(color.hsl.h);
                  setHex(color.hex);
                }}
                onChangeComplete={(color) => {
                  putLight(deviceId, {
                    hue: Math.round((color.hsl.h / 360) * 65535),
                  });
                }}
              />
            </HStack>
            <HStack>
              <Box>S</Box>
              <Slider
                min={0}
                max={254}
                value={light.state.sat}
                onChange={(value) => {
                  putLight(deviceId, { sat: value }).then(() => {
                    refresh();
                  });
                }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </HStack>
            <HStack>
              <Box>V</Box>
              <Slider
                min={0}
                max={254}
                value={light.state.bri}
                onChange={(value) => {
                  putLight(deviceId, { bri: value }).then(() => {
                    refresh();
                  });
                }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </HStack>
          </Stack>
          <Switch
            isChecked={light.state.on}
            onChange={async () => {
              console.log(
                `${light.state.hue}, ${(light.state.sat / 254) * 100}%, ${
                  (light.state.bri / 254) * 100
                }%`
              );
              await toggleLight(deviceId).then(async () => {
                await refresh();
              });
            }}
          />
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

const Home: FC = () => {
  const {
    groups,
    lights,
    listGroups,
    listLights,
    putLight,
    toggleLight,
    schedules,
    listSchedules,
  } = useLights();

  useEffect(() => {
    listLights();
    listGroups();
    listSchedules();
  }, []);

  return (
    <Container paddingY={3}>
      <Stack spacing={3}>
        <Heading as="h2">Lights</Heading>
        <Stack spacing={3}>
          {Object.entries(lights).map(([key, value]) => {
            return <LightCard deviceId={key} defaultLight={value} key={key} />;
          })}
        </Stack>
        <Heading as="h2">Groups</Heading>
        <Stack spacing={3}>
          {Object.entries(groups).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name} ({value.state.all_on ? "on" : "off"})
              </Box>
            );
          })}
        </Stack>
        <Heading as="h2">Schedules</Heading>
        <Stack spacing={3}>
          {Object.entries(schedules).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name} ({value.status})
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
