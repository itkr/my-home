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
  Tooltip,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HuePicker } from "react-color";
import { hsvToHsl } from "@/utils/color";
import { Light } from "./types";
import {
  toggleLight,
  useLightsQuery,
  useSchedulesQuery,
  useGroupsQuery,
  useLightQueryById,
  useLightMutation,
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

const LightCard: FC<{
  deviceId: string;
  defaultLight: Light;
}> = ({ deviceId, defaultLight }) => {
  const queryOptions = {
    initialData: defaultLight,
    // refetchInterval: 1000,
  };
  const { data, refetch } = useLightQueryById(deviceId, queryOptions);
  const light: Light = data as Light;
  const putLight = useLightMutation(deviceId).mutate;
  const [hue, setHue] = useState<number>(convertHue(light.state.hue));
  const [saturation, setSaturation] = useState<number>(light.state.sat);
  const [brightness, setBrightness] = useState<number>(light.state.bri);
  const [showSatTooltip, setShowSatTooltip] = useState<boolean>(false);
  const [showBriTooltip, setShowBriTooltip] = useState<boolean>(false);

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
                    refetch();
                  }}
                >
                  Flash {light.state.alert === "select" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ alert: "lselect" });
                    refetch();
                  }}
                >
                  Flash for 30 seconds {light.state.alert === "lselect" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ alert: "none" });
                    refetch();
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
                    refetch();
                  }}
                >
                  Color loop {light.state.effect === "colorloop" && "✓"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    putLight({ effect: "none" });
                    refetch();
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
              onChangeEnd={() => {
                // refetch();
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
              onChangeEnd={() => {
                // refetch();
                setShowBriTooltip(false);
              }}
              onMouseEnter={() => setShowBriTooltip(true)}
              onMouseLeave={() => setShowBriTooltip(false)}
            >
              <SliderTrack
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
        <Progress size="xs" isIndeterminate />
        <Switch
          isChecked={light.state.on}
          onChange={async () => {
            await toggleLight(deviceId).then(async () => {
              await refetch();
            });
          }}
        />
      </CardFooter>
    </Card>
  );
};

const Home: FC = () => {
  const { data: lights } = useLightsQuery({
    // refetchInterval: 1000,
  });
  const { data: groups } = useGroupsQuery({
    // refetchInterval: 1000,
  });
  const { data: schedules } = useSchedulesQuery({
    // refetchInterval: 1000,
  });

  return (
    <Container paddingY={5}>
      <Stack spacing={5}>
        <Heading as="h2"> Lights </Heading>
        <Stack spacing={5}>
          {Object.entries(lights || {}).map(([key, value]) => {
            return <LightCard deviceId={key} defaultLight={value} key={key} />;
          })}
        </Stack>
        <Heading as="h2"> Groups </Heading>
        <Stack spacing={5}>
          {Object.entries(groups || {}).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name}({value.state.all_on ? "on" : "off"})
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
