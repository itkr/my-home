import { FC, useEffect, useState, ReactNode } from "react";
import {
  Avatar,
  Tooltip,
  Box,
  BoxProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Stack,
  Switch,
  SliderThumb,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HuePicker } from "react-color";
import axios from "axios";
import { hsvToHsl } from "@/utils/color";
import { Light, Group, Schedule } from "./types";

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
const SliderTitle: FC<{ children: ReactNode; props?: BoxProps }> = ({
  children,
  ...props
}) => (
  <Box
    bg="rgba(255,255,255,0.2)"
    width="2em"
    height="2em"
    lineHeight="2em"
    textAlign="center"
  >
    {children}
  </Box>
);

const LightCard: FC<{
  deviceId: string;
  defaultLight: Light;
}> = ({ deviceId, defaultLight }) => {
  const { putLight, getLight, toggleLight } = useLights();
  const [light, setLight] = useState<Light>(defaultLight);
  const [hue, setHue] = useState<number>(
    (defaultLight.state.hue / 65535) * 360
  );
  const [saturation, setSaturation] = useState<number>(defaultLight.state.sat);
  const [brightness, setBrightness] = useState<number>(defaultLight.state.bri);
  const [showSatTooltip, setShowSatTooltip] = useState<boolean>(false);
  const [showBriTooltip, setShowBriTooltip] = useState<boolean>(false);

  const refresh = async () => {
    return await getLight(deviceId).then(async (light) => {
      setLight(light);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Card
      bg={light.state.on ? "white" : "gray.700"}
      color={light.state.on ? "black" : "white"}
      // style={{ transition: "all 0.2s ease-in-out" }}
      opacity={light.state.reachable ? 1 : 0.5}
    >
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center" gap={3}>
          <Avatar size="sm" name={light.name} bg="gray.500" />
          <Heading as="h3" size="md" flex="1">
            {light.name}
          </Heading>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BsThreeDotsVertical />}
          />
        </Flex>
      </CardHeader>
      <CardBody
        bg={
          light.state.on
            ? hsvToHsl(hue, saturation / 254, brightness / 254)
            : "gray.500"
        }
      >
        <Stack>
          {/* Hue */}
          <HStack>
            <SliderTitle>H</SliderTitle>
            <HuePicker
              width="100%"
              color={{ h: hue, s: 0, l: 0 }}
              onChange={(color) => {
                if (!light.state.on) return;
                setHue(color.hsl.h);
              }}
              onChangeComplete={(color) => {
                putLight(deviceId, {
                  hue: Math.round((color.hsl.h / 360) * 65535),
                }).then(() => refresh());
              }}
            />
          </HStack>
          {/* Saturation */}
          <HStack>
            <SliderTitle>S</SliderTitle>
            <Slider
              min={0}
              max={254}
              defaultValue={light.state.sat}
              value={saturation}
              onChange={(value) => {
                if (!light.state.on) return;
                setSaturation(value);
                putLight(deviceId, { sat: value });
                setShowSatTooltip(true);
              }}
              onChangeEnd={() => {
                refresh();
                setShowSatTooltip(false);
              }}
              onMouseEnter={() => setShowSatTooltip(true)}
              onMouseLeave={() => setShowSatTooltip(false)}
            >
              <SliderTrack
                style={{
                  background: `linear-gradient(to right, ${hsvToHsl(
                    hue,
                    0,
                    brightness / 254
                  )} 0%, ${hsvToHsl(hue, 1, brightness / 254)})`,
                }}
              >
                <SliderFilledTrack bg="none" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="gray.700"
                placement="top"
                isOpen={showSatTooltip}
                label={`${Math.round((saturation / 254) * 100)}%`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </HStack>
          {/* Brightness */}
          <HStack>
            <SliderTitle>V</SliderTitle>
            <Slider
              min={0}
              max={254}
              defaultValue={light.state.bri}
              value={brightness}
              onChange={(value) => {
                if (!light.state.on) return;
                setBrightness(value);
                putLight(deviceId, { bri: value });
                setShowBriTooltip(true);
              }}
              onChangeEnd={() => {
                refresh();
                setShowBriTooltip(false);
              }}
              onMouseEnter={() => setShowBriTooltip(true)}
              onMouseLeave={() => setShowBriTooltip(false)}
            >
              <SliderTrack
                style={{
                  background: `linear-gradient(to right, ${hsvToHsl(
                    hue,
                    saturation / 254,
                    0
                  )}, ${hsvToHsl(hue, saturation / 254, 1)})`,
                }}
              >
                <SliderFilledTrack bg="none" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="gray.700"
                placement="top"
                isOpen={showBriTooltip}
                label={`${Math.round((brightness / 254) * 100)}%`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </HStack>
        </Stack>
      </CardBody>
      <CardFooter>
        <Switch
          isChecked={light.state.on}
          onChange={async () => {
            await toggleLight(deviceId).then(async () => {
              await refresh();
            });
          }}
        />
      </CardFooter>
    </Card>
  );
};

const Home: FC = () => {
  const {
    groups,
    lights,
    listGroups,
    listLights,
    // putLight,
    // toggleLight,
    schedules,
    listSchedules,
  } = useLights();

  useEffect(() => {
    listLights();
    listGroups();
    listSchedules();
  }, []);

  return (
    <Container paddingY={5}>
      <Stack spacing={5}>
        <Heading as="h2"> Lights </Heading>
        <Stack spacing={5}>
          {Object.entries(lights).map(([key, value]) => {
            return <LightCard deviceId={key} defaultLight={value} key={key} />;
          })}
        </Stack>
        <Heading as="h2"> Groups </Heading>
        <Stack spacing={5}>
          {Object.entries(groups).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name}({value.state.all_on ? "on" : "off"})
              </Box>
            );
          })}
        </Stack>
        <Heading as="h2"> Schedules </Heading>
        <Stack spacing={5}>
          {Object.entries(schedules).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name}({value.status})
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
