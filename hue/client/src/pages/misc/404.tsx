import { Container, Heading } from "@chakra-ui/react";

export default function NotFound() {
  console.error("404", "(Not Found)");
  return (
    <Container>
      <Heading as="h2">404</Heading>
    </Container>
  );
}
