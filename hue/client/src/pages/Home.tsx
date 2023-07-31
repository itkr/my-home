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

  const getLights = () => {
    const url = `http://${ip}/api/${username}/lights`;
    axios.get(url).then((res) => {
      setLights(res.data);
    });
  };

  const getLight = (deviceId: string) => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    axios.get(url).then((res) => {
      setLights((prev) => ({ ...prev, [deviceId]: res.data }));
    });
  };

  const toggleLight = (deviceId: string) => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    putLight(deviceId, { on: !lights[deviceId].state.on });
  };

  const putLight = (deviceId: string, state: Partial<Light["state"]>) => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    axios.put(url, state).then((res) => {
      getLights();
    });
  };

  return {
    lights,
    getLight,
    getLights,
    putLight,
    toggleLight,
  };
};

function hslToHex(h: number, s: number, l: number): string {
  console.log(h, s, l);
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  console.log(`#${f(0)}${f(8)}${f(4)}`);
  return `#${f(0)}${f(8)}${f(4)}`;
}

const LightCard: FC<{
  deviceId: string;
  light: Light;
  onToggle: () => void;
}> = ({ deviceId, light, onToggle }) => {
  const { toggleLight, putLight } = useLights();
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
        bg={hslToHex(
          Math.round((light.state.hue / 65535) * 360),
          (light.state.sat / 254) * 100,
          (light.state.bri / 254) * 100
        )}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stack>
            <HuePicker
              color={{
                h: (light.state.hue / 65535) * 360,
                s: 254,
                l: 254,
                // s: light.state.sat,
                // l: light.state.bri,
              }}
              onChangeComplete={(color) => {
                console.log(color);
                putLight(deviceId, {
                  // hue: 32000,
                  hue: Math.round((color.hsl.h / 360) * 65535),
                  // sat: 254,
                  // bri: 254,
                });
                // setColor(color.hex);
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
                  toggleLight(key);
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
