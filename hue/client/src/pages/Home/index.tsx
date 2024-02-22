import { FC, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { hsvToHsl } from "@/utils/color";
import { Light } from "./types";
import {
  useLightsQuery,
  useLightQueryById,
  useLightMutation,
  useGroupsQuery,
  useSchedulesQuery,
} from "./hooks";
import { LightCard } from "./components/LightCard";

const maxSaturation = 254;
const maxBrightness = 254;

const alerts = [
  { key: "select", label: "Flash" },
  { key: "lselect", label: "Flash for 30s" },
  { key: "none", label: "No alert" },
];

const effects = [
  { key: "colorloop", label: "Color loop" },
  { key: "none", label: "No effect" },
];

const convertHue = (hue: number) => (hue / 65535) * 360;
const normalizeHue = (hue: number) => Math.round((hue / 360) * 65535);

const GroupLightCard: FC<{ deviceId: string; onSuccess?: () => void }> = ({
  deviceId,
  onSuccess,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { data } = useLightQueryById(deviceId);
  const light: Light = data as Light;
  return (
    <>
      <Drawer
        isOpen={showDrawer}
        placement="right"
        onClose={() => setShowDrawer(false)}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Light Settings</DrawerHeader>
          <DrawerBody>
            <LightCard
              deviceId={deviceId}
              initialData={light}
              onSuccess={onSuccess}
            />
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Stack
        key={deviceId}
        direction="row"
        bg={light.state.on ? "white" : "gray.700"}
        borderRadius="md"
        overflow="hidden"
        borderWidth="1px"
        padding={2}
        width="100%"
        display="flex"
        alignItems="center"
        cursor="pointer"
        boxShadow="sm"
        onClick={() => setShowDrawer(true)}
      >
        <Avatar
          size="sm"
          color="black"
          name={light.name}
          bg={hsvToHsl(
            convertHue(light.state.hue),
            light.state.sat / maxSaturation,
            light.state.bri / maxBrightness
          )}
          opacity={light.state.on ? 1 : 0.5}
        />
        <Text
          fontSize="sm"
          color={light.state.on ? "black" : "white"}
          textAlign="center"
        >
          {light.name}
        </Text>
        <Icon color="gray.500" as={light.state.on ? SunIcon : MoonIcon} />
        {light.state.alert !== "none" && (
          <Badge colorScheme="red">
            {alerts.find((a) => a.key === light.state.alert)?.label}
          </Badge>
        )}
        {light.state.effect !== "none" && (
          <Badge colorScheme="blue">
            {effects.find((e) => e.key === light.state.effect)?.label}
          </Badge>
        )}
      </Stack>
    </>
  );
};

const Home: FC = () => {
  const { data: lights } = useLightsQuery({});
  const { data: groups, refetch: refetchGroups } = useGroupsQuery({
    refetchInterval: 5000,
  });
  const { data: schedules } = useSchedulesQuery({
    refetchInterval: 5000,
  });

  return (
    <Container paddingY={5}>
      <Stack spacing={5}>
        <Heading as="h2">Lights</Heading>
        <Stack spacing={5}>
          {Object.entries(lights || {}).map(([key, value]) => {
            return (
              <LightCard
                key={key}
                deviceId={key}
                initialData={value}
                onSuccess={() => refetchGroups()}
              />
            );
          })}
        </Stack>
        <Heading as="h2">Groups</Heading>
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
                  <CardBody bg="gray.100">
                    <Wrap spacing={3}>
                      {value.lights.map((deviceId: string) => {
                        return (
                          <GroupLightCard
                            key={deviceId}
                            deviceId={deviceId}
                            onSuccess={() => refetchGroups()}
                          />
                        );
                      })}
                    </Wrap>
                  </CardBody>
                  <CardFooter>
                    <Switch isChecked={value.state.any_on} isDisabled />
                  </CardFooter>
                </Card>
              </Box>
            );
          })}
        </Stack>
        <Heading as="h2">Schedules</Heading>
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
