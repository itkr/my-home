import { FC, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { hsvToHsl } from "@/utils/color";
import { Light } from "@/types";
import { useLightQueryById, useLightMutation } from "@/hooks";
import { alerts, effects, maxBrightness, maxSaturation } from "@/constants";
import { convertHue, normalizeHue, makeHueGradient } from "@/utils/color";

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

const DetailModal: FC<{
  light: Light;
  isOpen: boolean;
  onClose: () => void;
}> = ({ light, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{light.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Type</Td>
                <Td>{light.type}</Td>
              </Tr>
              <Tr>
                <Td>Model</Td>
                <Td>{light.modelid}</Td>
              </Tr>
              <Tr>
                <Td>Product Name</Td>
                <Td>{light.productname}</Td>
              </Tr>
              <Tr>
                <Td>Product ID</Td>
                <Td>{light.productid}</Td>
              </Tr>
              <Tr>
                <Td>Manufacturer</Td>
                <Td>{light.manufacturername}</Td>
              </Tr>
              <Tr>
                <Td>Software Version</Td>
                <Td>{light.swversion}</Td>
              </Tr>
              <Tr>
                <Td>Software Config ID</Td>
                <Td>{light.swconfigid}</Td>
              </Tr>
              <Tr>
                <Td>Unique ID</Td>
                <Td>{light.uniqueid}</Td>
              </Tr>
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type Preset = {
  key: string;
  label: string;
  hsv: { hue: number; sat: number; bri: number };
};

const presets: Preset[] = [
  { key: "red", label: "Red", hsv: { hue: 0, sat: 254, bri: 254 } },
  { key: "green", label: "Green", hsv: { hue: 21845, sat: 254, bri: 254 } },
  { key: "blue", label: "Blue", hsv: { hue: 43690, sat: 254, bri: 254 } },
  { key: "white", label: "White", hsv: { hue: 0, sat: 0, bri: 254 } },
  { key: "yellow", label: "Yellow", hsv: { hue: 10922, sat: 254, bri: 254 } },
  { key: "orange", label: "Orange", hsv: { hue: 5461, sat: 254, bri: 254 } },
  { key: "pink", label: "Pink", hsv: { hue: 54613, sat: 254, bri: 254 } },
  { key: "cyan", label: "Cyan", hsv: { hue: 32768, sat: 254, bri: 254 } },
];

const LightCard: FC<{
  deviceId: string;
  initialData: Light;
  onSuccess?: () => void;
}> = ({ deviceId, initialData, onSuccess }) => {
  // Query
  const { data } = useLightQueryById(deviceId, {
    initialData,
    refetchInterval: 5000,
  });
  const light: Light = data as Light;

  // Mutation
  const { mutate } = useLightMutation(deviceId, {
    onSuccess: () => onSuccess?.(),
  });

  // Slider
  const [hue, setHue] = useState<number>(convertHue(light.state.hue));
  const [saturation, setSaturation] = useState<number>(light.state.sat);
  const [brightness, setBrightness] = useState<number>(light.state.bri);

  // Slider Tooltip
  const [showHueTooltip, setShowHueTooltip] = useState<boolean>(false);
  const [showSatTooltip, setShowSatTooltip] = useState<boolean>(false);
  const [showBriTooltip, setShowBriTooltip] = useState<boolean>(false);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Update state when light changes
  useEffect(() => {
    setHue(convertHue(light.state.hue));
    setSaturation(light.state.sat);
    setBrightness(light.state.bri);
  }, [light]);

  return (
    <>
      <DetailModal light={light} isOpen={isOpen} onClose={onClose} />
      <Card
        bg={light.state.on ? "white" : "gray.700"}
        color={light.state.on ? "black" : "white"}
        opacity={light.state.reachable ? 1 : 0.5}
      >
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="center" gap={3}>
            <Avatar
              size="sm"
              name={light.name}
              bg={hsvToHsl(
                hue,
                saturation / maxSaturation,
                brightness / maxBrightness
              )}
              boxShadow="sm"
            />
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
                <MenuGroup title="Infomation">
                  <MenuDivider />
                  <MenuItem onClick={() => onOpen()}>Details</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        <Divider borderColor="gray.200" />
        <CardBody padding={0}>
          <Stack
            padding={5}
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
            {/* Hue */}
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
                  setShowHueTooltip(true);
                  mutate({ hue: normalizeHue(value) });
                }}
                onChangeEnd={() => setShowHueTooltip(false)}
                onMouseEnter={() => setShowHueTooltip(true)}
                onMouseLeave={() => setShowHueTooltip(false)}
                isDisabled={!light.state.on}
              >
                <SliderTrack
                  height="1em"
                  style={{ background: makeHueGradient() }}
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
                  setShowSatTooltip(true);
                  mutate({ sat: value });
                }}
                onChangeEnd={() => setShowSatTooltip(false)}
                onMouseEnter={() => setShowSatTooltip(true)}
                onMouseLeave={() => setShowSatTooltip(false)}
                isDisabled={!light.state.on}
              >
                <SliderTrack
                  height="1em"
                  style={{
                    background: `linear-gradient(to right,
                      ${hsvToHsl(hue, 0, brightness / maxBrightness)} 0%,
                      ${hsvToHsl(hue, 1, brightness / maxBrightness)} 100%)`,
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
                  setShowBriTooltip(true);
                  mutate({ bri: value });
                }}
                onChangeEnd={() => setShowBriTooltip(false)}
                onMouseEnter={() => setShowBriTooltip(true)}
                onMouseLeave={() => setShowBriTooltip(false)}
                isDisabled={!light.state.on}
              >
                <SliderTrack
                  height="1em"
                  style={{
                    background: `linear-gradient(to right,
                      ${hsvToHsl(hue, saturation / maxSaturation, 0)} 0%,
                      ${hsvToHsl(hue, saturation / maxSaturation, 1)} 100%)`,
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
          <Box>
            <Text fontSize="sm" color="gray.500" pl={5}>
              Presets
            </Text>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              padding={5}
            >
              {presets.map((preset) => (
                <IconButton
                  key={preset.key}
                  aria-label={preset.label}
                  icon={<SunIcon />}
                  borderRadius="full"
                  border="1px solid #eeeeee;"
                  bg={hsvToHsl(
                    convertHue(preset.hsv.hue),
                    preset.hsv.sat / maxSaturation,
                    preset.hsv.bri / maxBrightness
                  )}
                  onClick={() => mutate({ ...preset.hsv })}
                  _hover={{
                    opacity: 0.8,
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Divider borderColor="gray.200" />
          <Stack spacing={3} p={5}>
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              alignSelf="center"
            >
              {alerts.map((alert) => (
                <Button
                  key={alert.key}
                  variant={
                    light.state.alert === alert.key ? "solid" : "outline"
                  }
                  onClick={() => mutate({ alert: alert.key })}
                >
                  {alert.label}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              alignSelf="center"
              isDisabled={!light.state.on}
            >
              {effects.map((effect) => (
                <Button
                  key={effect.key}
                  variant={
                    light.state.effect === effect.key ? "solid" : "outline"
                  }
                  onClick={() => mutate({ effect: effect.key })}
                >
                  {effect.label}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
        </CardBody>
        <Divider borderColor="gray.200" />
        <CardFooter>
          <HStack justifyContent="space-between" alignItems="center" flex="1">
            <Switch
              isChecked={light.state.on}
              onChange={() => mutate({ on: !light.state.on })}
            />
            <Text fontSize="sm" color="gray.500" flex="1" textAlign="right">
              HSV({Math.round(hue)}°,{" "}
              {Math.round((saturation / maxSaturation) * 100)}%,{" "}
              {Math.round((brightness / maxBrightness) * 100)}%)
            </Text>
            <Icon color="gray.500" as={light.state.on ? SunIcon : MoonIcon} />
          </HStack>
        </CardFooter>
      </Card>
    </>
  );
};

export { LightCard };
