import { FC } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  useColorModeValue,
  // useColorMode,
} from "@chakra-ui/react";

interface HeaderProps {
  title: string;
}

const menuItems = [
  {
    label: "Login",
    href: "/login",
  },
];
const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <Box as="header" bg={useColorModeValue("white", "gray.800")} px={4} py={4}>
      <Container maxW="container.lg">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="lg">
            <Link href="/">{title}</Link>
          </Heading>
          <Flex>
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} px={2}>
                {item.label}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export { Header };
