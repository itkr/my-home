import { FC } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { useLightsQuery } from "@/hooks";
import { LightCard } from "@/components/LightCard";

const Lights: FC = () => {
  const { data: lights } = useLightsQuery();

  return (
    <Container paddingY={5}>
      <Stack spacing={5}>
        <Heading as="h2">Lights</Heading>
        <Stack spacing={5}>
          {Object.entries(lights || {}).map(([key, value]) => {
            return <LightCard key={key} deviceId={key} initialData={value} />;
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Lights;
