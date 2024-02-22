import { FC, useState, useEffect } from "react";
import {
  Avatar,
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
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HuePicker } from "react-color";
import { hsvToHsl } from "@/utils/color";
import { Light } from "./types";
import {
  // light
  useLightsQuery,
  useLightQueryById,
  useLightMutation,

  // group
  useGroupsQuery,
  useGroupQueryById,
  useGroupMutation,

  // schedule
  useSchedulesQuery,
} from "./hooks";

const maxSaturation = 254;
const maxBrightness = 254;
const convertHue = (hue: number) => (hue / 65535) * 360;
const normalizeHue = (hue: number) => Math.round((hue / 360) * 65535);

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

const LightCard: FC<{ deviceId: string; initialData: Light }> = ({
  deviceId,
  initialData,
}) => {
  // Query
  const { data } = useLightQueryById(deviceId, {
    initialData,
    refetchInterval: 5000,
  });
  const light: Light = data as Light;

  // Mutation
  const { mutate: putLight } = useLightMutation(deviceId);

  // Slider
  const [hue, setHue] = useState<number>(convertHue(light.state.hue));
  const [saturation, setSaturation] = useState<number>(light.state.sat);
  const [brightness, setBrightness] = useState<number>(light.state.bri);

  // Slider Tooltip
  const [showHueTooltip, setShowHueTooltip] = useState<boolean>(false);
  const [showSatTooltip, setShowSatTooltip] = useState<boolean>(false);
  const [showBriTooltip, setShowBriTooltip] = useState<boolean>(false);

  // Update state when light changes
  useEffect(() => {
    setHue(convertHue(light.state.hue));
    setSaturation(light.state.sat);
    setBrightness(light.state.bri);
  }, [light]);

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
                    putLight({ alert: "select" });
                    // refetch();
                  }}
                >
                  Flash {light.state.alert === "select" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ alert: "lselect" });
                    // refetch();
                  }}
                >
                  Flash for 30 seconds {light.state.alert === "lselect" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ alert: "none" });
                    // refetch();
                  }}
                >
                  No alert {light.state.alert === "none" && "✓"}
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Effect">
                <MenuItem
                  onClick={() => {
                    putLight({ effect: "colorloop" });
                    // refetch();
                  }}
                >
                  Color loop {light.state.effect === "colorloop" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ effect: "none" });
                    // refetch();
                  }}
                >
                  No effect {light.state.effect === "none" && "✓"}
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody
        bg={
          light.state.on
            ? hsvToHsl(
                hue,
                saturation / maxSaturation,
                brightness / maxBrightness
              )
            : "gray.500"
        }
      >
        <Stack>
          {/* Hue */}
          {/*
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
                putLight({ hue: normalizeHue(color.hsl.h) });
                // putLight(deviceId, {
                //   hue: normalizeHue(color.hsl.h),
                // }).then(() => refetch());
              }}
            />
          </HStack>
          */}
          <HStack>
            <SliderTitle>H</SliderTitle>
            <Slider
              min={0}
              max={359}
              defaultValue={light.state.sat}
              value={hue}
              onChange={(value) => {
                if (!light.state.on) return;
                setHue(value);
                putLight({ hue: normalizeHue(value) });
                setShowHueTooltip(true);
              }}
              onChangeEnd={(value) => {
                // refetch();
                setShowHueTooltip(false);
              }}
              onMouseEnter={() => setShowHueTooltip(true)}
              onMouseLeave={() => setShowHueTooltip(false)}
              isDisabled={!light.state.on}
            >
              <SliderTrack
                height="1em"
                style={{
                  background: `linear-gradient(to right,
                     ${hsvToHsl(0, 1, 1)} 0%,
                     ${hsvToHsl(30, 1, 1)} ${(30 / 360) * 100}%,
                     ${hsvToHsl(60, 1, 1)} ${(60 / 360) * 100}%,
                     ${hsvToHsl(90, 1, 1)} ${(90 / 360) * 100}%,
                     ${hsvToHsl(120, 1, 1)} ${(120 / 360) * 100}%,
                     ${hsvToHsl(150, 1, 1)} ${(150 / 360) * 100}%,
                     ${hsvToHsl(180, 1, 1)} ${(180 / 360) * 100}%,
                     ${hsvToHsl(210, 1, 1)} ${(210 / 360) * 100}%,
                     ${hsvToHsl(240, 1, 1)} ${(240 / 360) * 100}%,
                     ${hsvToHsl(270, 1, 1)} ${(270 / 360) * 100}%,
                     ${hsvToHsl(300, 1, 1)} ${(300 / 360) * 100}%,
                     ${hsvToHsl(330, 1, 1)} ${(330 / 360) * 100}%,
                     ${hsvToHsl(360, 1, 1)} 100%)`,
                }}
              >
                <SliderFilledTrack bg="none" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="gray.700"
                placement="top"
                isOpen={showHueTooltip}
                label={`${Math.round(hue)}°`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </HStack>
          {/* Saturation */}
          <HStack>
            <SliderTitle>S</SliderTitle>
            <Slider
              min={0}
              max={maxSaturation}
              defaultValue={light.state.sat}
              value={saturation}
              onChange={(value) => {
                if (!light.state.on) return;
                setSaturation(value);
                putLight({ sat: value });
                setShowSatTooltip(true);
              }}
              onChangeEnd={(value) => {
                // refetch();
                setShowSatTooltip(false);
              }}
              onMouseEnter={() => setShowSatTooltip(true)}
              onMouseLeave={() => setShowSatTooltip(false)}
              isDisabled={!light.state.on}
            >
              <SliderTrack
                height="1em"
                style={{
                  background: `linear-gradient(to right, ${hsvToHsl(
                    hue,
                    0,
                    brightness / maxBrightness
                  )} 0%, ${hsvToHsl(hue, 1, brightness / maxBrightness)})`,
                }}
              >
                <SliderFilledTrack bg="none" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="gray.700"
                placement="top"
                isOpen={showSatTooltip}
                label={`${Math.round((saturation / maxSaturation) * 100)}%`}
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
              max={maxBrightness}
              defaultValue={light.state.bri}
              value={brightness}
              onChange={(value) => {
                if (!light.state.on) return;
                setBrightness(value);
                putLight({ bri: value });
                setShowBriTooltip(true);
              }}
              onChangeEnd={(value) => {
                // refetch();
                setShowBriTooltip(false);
              }}
              onMouseEnter={() => setShowBriTooltip(true)}
              onMouseLeave={() => setShowBriTooltip(false)}
              isDisabled={!light.state.on}
            >
              <SliderTrack
                height="1em"
                style={{
                  background: `linear-gradient(to right, ${hsvToHsl(
                    hue,
                    saturation / maxSaturation,
                    0
                  )}, ${hsvToHsl(hue, saturation / maxSaturation, 1)})`,
                }}
              >
                <SliderFilledTrack bg="none" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="gray.700"
                placement="top"
                isOpen={showBriTooltip}
                label={`${Math.round((brightness / maxBrightness) * 100)}%`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </HStack>
        </Stack>
      </CardBody>
      <CardFooter>
        {/* <Progress size="xs" isIndeterminate /> */}
        <HStack justifyContent="space-between" alignItems="center" flex="1">
          <Switch
            isChecked={light.state.on}
            onChange={() => {
              putLight({ on: !light.state.on });
            }}
          />
          <Text
            fontSize="sm"
            color={light.state.on ? "black" : "white"}
            flex="1"
            textAlign="right"
          >
            HSV({Math.round(hue)}°,{" "}
            {Math.round((saturation / maxSaturation) * 100)}%,{" "}
            {Math.round((brightness / maxBrightness) * 100)}%)
          </Text>
        </HStack>
      </CardFooter>
    </Card>
  );
};

// const CountDownProgress: FC<{seconds: number}> = ({seconds}) => {
//   const [progress, setProgress] = useState(100);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => prev - 100 / seconds);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [seconds]);
//   return <Progress size="xs" value={progress} />;
// }

// const useCountDown = (seconds: number) => {
//   const [progress, setProgress] = useState(100);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => prev - 100 / seconds);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [seconds]);
//   return progress;
// }

const Home: FC = () => {
  const { data: lights } = useLightsQuery({
    // refetchInterval: 1000,
  });
  const { data: groups } = useGroupsQuery({
    refetchInterval: 5000,
  });
  const { data: schedules } = useSchedulesQuery({
    refetchInterval: 5000,
  });

  return (
    <Container paddingY={5}>
      <Stack spacing={5}>
        <Heading as="h2"> Lights </Heading>
        <Stack spacing={5}>
          {Object.entries(lights || {}).map(([key, value]) => {
            return <LightCard deviceId={key} initialData={value} key={key} />;
          })}
        </Stack>
        <Heading as="h2"> Groups </Heading>
        <Stack spacing={5}>
          {Object.entries(groups || {}).map(([key, value]) => {
            return (
              <Box key={key}>
                <Card>
                  <CardHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Flex alignItems="center" gap={3}>
                        <Avatar size="sm" name={value.name} />
                        <Heading as="h3" size="md">
                          {value.name}
                        </Heading>
                      </Flex>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          variant="ghost"
                          icon={<BsThreeDotsVertical />}
                          colorScheme="gray"
                        />
                        <MenuList>
                          <MenuItem>Turn on</MenuItem>
                          <MenuItem>Turn off</MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Wrap spacing={3}>
                      {value.lights.map((lightId: string) => {
                        // const light = lights[lightId];
                        return (
                          <Box
                            key={lightId}
                            borderRadius="md"
                            overflow="hidden"
                            borderWidth="1px"
                            padding={2}
                            width="100px"
                            height="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() => {
                              console.log(lightId);
                            }}
                          >
                            <Avatar size="md" name={lightId} />
                          </Box>
                        );
                      })}
                    </Wrap>
                  </CardBody>
                  <CardFooter>
                    <Switch isChecked={value.state.all_on} isDisabled />
                  </CardFooter>
                  {/* <Progress size="xs" isIndeterminate /> */}
                  {/* <CountDownProgress seconds={30} /> */}
                </Card>
              </Box>
            );
          })}
        </Stack>
        <Heading as="h2"> Schedules </Heading>
        <Stack spacing={5}>
          {Object.entries(schedules || {}).map(([key, value]) => {
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
