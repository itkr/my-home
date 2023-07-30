import { Container, Heading } from "@chakra-ui/react";
// import { api, v3 } from "node-hue-api";
import { FC, useEffect, useState } from "react";

const Home: FC = () => {
  // const discovery = v3.discovery;
  // const upnpSearch = discovery.upnpSearch;
  // const discoveryResults = discovery.nupnpSearch().then((res) => {
  //   console.log(res);
  // });

  // const lights = api.lights.getAll();

  return (
    <Container>
      <Heading as="h2"> Hello </Heading>
    </Container>
  );
};

export default Home;
