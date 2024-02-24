import { FC } from "react";
// chakra
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Stack,
  Divider,
  Text,
  Link,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaHome,
  FaLightbulb,
  FaObjectGroup,
  FaSnowflake,
  FaWrench,
} from "react-icons/fa";

const menuItems = [
  { label: "Home", value: "/", icon: <Icon as={FaHome} /> },
  { label: "Lights", value: "/lights", icon: <Icon as={FaLightbulb} /> },
  { label: "Groups", value: "/groups", icon: <Icon as={FaObjectGroup} /> },
  {
    label: "Schedules",
    value: "/schedules",
    icon: <Icon as={FaCalendarAlt} />,
  },
  { label: "Scenes", value: "/scenes", icon: <Icon as={FaSnowflake} /> },
  { label: "Settings", value: "/settings", icon: <Icon as={FaWrench} /> },
];

const SideMenu: FC = () => {
  return (
    <Flex backgroundColor="gray.100" w="250px" h="100vh" direction="column">
      <Box p={4} pt={8}>
        <Flex direction="column" align="center" mb={8}>
          <Heading size="md" mb={2}>
            Hue Dashboard
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Project to control your Hue lights.
          </Text>
        </Flex>
        <Spacer />
        <Divider borderColor="gray.300" />
        <Stack spacing={4} mt={8}>
          {menuItems.map((item) => (
            <Link key={item.value} href={item.value}>
              {item.icon} {item.label}
            </Link>
          ))}
        </Stack>
      </Box>
      <Box p={4} mt="auto">
        <Divider borderColor="gray.300" />
        <Text fontSize="sm" color="gray.500" textAlign="center" pt={4}>
          &copy; 2023 Hue Dashboard
        </Text>
      </Box>
    </Flex>
  );
};

export { SideMenu };
