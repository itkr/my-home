import { FC, useEffect, useState } from "react";
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
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HuePicker } from "react-color";
import { hsvToHsl } from "@/utils/color";
import { Light } from "./types";
import { useLights } from "./hooks";

const SliderTitle: FC<BoxProps> = ({ children, ...props }) => (
  <Box
    bg="rgba(255,255,255,0.2)"
    width="2em"
    height="2em"
    lineHeight="2em"
    textAlign="center"
    {...props}
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
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              icon={<BsThreeDotsVertical />}
              colorScheme="gray"
              color={light.state.on ? "black" : "white"}
            />
            <MenuList color="black">
              {/* alert */}
              <MenuGroup title="Alert">
                <MenuItem
                  onClick={() => {
                    putLight(deviceId, { alert: "select" });
                    // refresh();
                  }}
                >
                  Flash
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight(deviceId, { alert: "lselect" });
                    // refresh();
                  }}
                >
                  Flash for 30 seconds
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight(deviceId, { alert: "none" });
                    // refresh();
                  }}
                >
                  No alert
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Effect">
                <MenuItem
                  onClick={() => {
                    putLight(deviceId, { effect: "colorloop" });
                    refresh();
                  }}
                >
                  Color loop
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight(deviceId, { effect: "none" });
                    // refresh();
                  }}
                >
                  No effect
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
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
        <Progress size="xs" isIndeterminate />
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
