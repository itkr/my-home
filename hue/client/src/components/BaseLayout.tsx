import { FC } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";

import { Header } from "@/components/Header";
import { SideMenu } from "@/components/SideMenu";

const BaseLayout: FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title = "Hue Dashboard",
}) => {
  return (
    <Flex>
      <SideMenu />
      <Box w="100%" h="100%">
        <Header title={title} />
        <Container maxW="container.lg" paddingY={5}>
          {children}
        </Container>
      </Box>
    </Flex>
  );
};

export { BaseLayout };
