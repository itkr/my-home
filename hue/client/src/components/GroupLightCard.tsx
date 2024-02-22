import { FC, useState } from "react";
import {
  Avatar,
  Badge,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { hsvToHsl } from "@/utils/color";
import { Light } from "@/types";
import { useLightQueryById } from "@/hooks";
import { LightCard } from "@/components/LightCard";
import { alerts, effects, maxBrightness, maxSaturation } from "@/constants";
import { convertHue } from "@/utils/color";

const GroupLightCard: FC<{
  deviceId: string;
  onSuccess?: () => void;
  initialData?: Light;
}> = ({ deviceId, onSuccess, initialData }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { data } = useLightQueryById(deviceId, { initialData });
  const light: Light | undefined = data as Light | undefined;
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
              initialData={light as Light}
              onSuccess={onSuccess}
            />
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Stack
        key={deviceId}
        direction="row"
        bg={light?.state.on ? "white" : "gray.700"}
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
          name={light?.name}
          bg={hsvToHsl(
            convertHue(light?.state.hue || 0),
            (light?.state.sat || 1) / maxSaturation,
            (light?.state.bri || 1) / maxBrightness
          )}
          opacity={light?.state.on ? 1 : 0.5}
        />
        <Text
          fontSize="sm"
          color={light?.state.on ? "black" : "white"}
          textAlign="center"
        >
          {light?.name}
        </Text>
        <Icon color="gray.500" as={light?.state.on ? SunIcon : MoonIcon} />
        {light?.state.alert !== "none" && (
          <Badge colorScheme="red">
            {alerts.find((a) => a.key === light?.state.alert)?.label}
          </Badge>
        )}
        {light?.state.effect !== "none" && (
          <Badge colorScheme="blue">
            {effects.find((e) => e.key === light?.state.effect)?.label}
          </Badge>
        )}
      </Stack>
    </>
  );
};

export { GroupLightCard };
