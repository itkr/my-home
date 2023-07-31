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
} from "@chakra-ui/react";
import { HuePicker, AlphaPicker } from "react-color";
// import { api, v3 } from "node-hue-api";
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

const useLights = () => {
  const ip = "192.168.1.2";
  const username = "9cjWI194Z58UwXDBKww9SMlZLrLH-0k01Gdjr1hv";
  const [lights, setLights] = useState<Record<string, Light>>({});

  const getLights = (): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights`;
    return axios.get(url).then((res) => {
      setLights(res.data);
    });
  };

  const getLight = (deviceId: string): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return axios.get(url).then((res) => {
      setLights((prev) => ({ ...prev, [deviceId]: res.data }));
    });
  };

  const toggleLight = (deviceId: string): Promise<any> => {
    return putLight(deviceId, { on: !lights[deviceId].state.on });
    // const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    // return axios.put(url, { on: !lights[deviceId].state.on });
  };

  const putLight = (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return axios.put(url, state);
  };

  return {
    lights,
    getLight,
    getLights,
    putLight,
    toggleLight,
  };
};

const LightCard: FC<{
  deviceId: string;
  light: Light;
  onToggle: () => void;
  putLight: (deviceId: string, state: Partial<Light["state"]>) => Promise<any>;
  refresh: () => void;
}> = ({ deviceId, light, onToggle, putLight, refresh }) => {
  // const { toggleLight, putLight } = useLights();
  const [color, setColor] = useState<string>("#fff");
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
        //bg={color}
        // bg={`hsl(${(light.state.hue / 65535) * 360}, 100%, 50%)`}
        bg={`hsl(${(light.state.hue / 65535) * 360}, ${
          (light.state.sat / 254) * 100
        }%, ${(light.state.bri / 254) * 100}%)`}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stack>
            <HuePicker
              color={{
                h: (light.state.hue / 65535) * 360,
                s: 254,
                l: 254,
              }}
              onChangeComplete={(color) => {
                putLight(deviceId, {
                  hue: Math.round((color.hsl.h / 360) * 65535),
                  // sat: 254,
                  // bri: 254,
                }).then(() => {
                  setColor(color.hex);
                  refresh();
                });
              }}
            />
          </Stack>
          <Switch
            isChecked={light.state.on}
            onChange={() => {
              onToggle();
            }}
          />
        </Flex>
      </CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
};

const Home: FC = () => {
  const { lights, getLights, toggleLight, putLight } = useLights();

  useEffect(() => {
    getLights();
  }, []);

  return (
    <Container paddingY={3}>
      <Stack spacing={3}>
        <Heading as="h2"> Hello </Heading>
        <Stack spacing={3}>
          {Object.entries(lights).map(([key, value]) => {
            return (
              <LightCard
                deviceId={key}
                light={value}
                key={key}
                onToggle={() => {
                  toggleLight(key).then(() => {
                    getLights();
                  });
                }}
                putLight={putLight}
                refresh={() => {
                  getLights();
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
