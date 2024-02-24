import { FC } from "react";
// chakra
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";

const menuItems = [
  { label: "Home", value: "/" },
  { label: "Lights", value: "/lights" },
  { label: "Groups", value: "/groups" },
  { label: "Schedules", value: "/schedules" },
  { label: "Scenes", value: "/scenes" },
  { label: "Settings", value: "/settings" },
];

const SideMenu: FC = () => {
  return (
    <Flex backgroundColor="gray.100" w="250px" h="100vh" direction="column">
      <Box p={4}>
        <Flex direction="column" align="center">
          <Heading size="md" mb={2}>
            Hue Dashboard
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Project to control your Hue lights.
          </Text>
        </Flex>
        <Spacer />
        <Stack spacing={4} mt={8}>
          {menuItems.map((item) => (
            <>
              <Link key={item.value} href={item.value}>
                {item.label}
              </Link>
            </>
          ))}
        </Stack>
      </Box>
    </Flex>
  );
};

export { SideMenu };
