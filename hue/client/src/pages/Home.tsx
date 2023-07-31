import { Box, Container, Heading, Switch } from "@chakra-ui/react";
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

  const toggleLight = (deviceId: string) => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    axios
      .put(url, {
        on: !lights[deviceId].state.on,
        // bri: 254,
        // hue: 10000,
        // sat: 254,
      })
      .then((res) => {
        getLights();
      });
  };

  return {
    lights,
    getLights,
    toggleLight,
  };
};

const Home: FC = () => {
  const { lights, getLights, toggleLight } = useLights();

  useEffect(() => {
    getLights();
  }, []);

  return (
    <Container>
      <Heading as="h2"> Hello </Heading>
      {Object.entries(lights).map(([key, value]) => {
        return (
          <Box key={key}>
            <Heading as="h3"> {value.name} </Heading>
            <Switch
              isChecked={value.state.on}
              onChange={() => {
                toggleLight(key);
              }}
            />
          </Box>
        );
      })}
    </Container>
  );
};

export default Home;
