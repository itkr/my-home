import { FC } from "react";
import { Container, Stack } from "@chakra-ui/react";
import { useLightsQuery } from "@/hooks";
import { LightCard } from "@/components/LightCard";
import { BaseLayout } from "@/components/BaseLayout";

const Lights: FC = () => {
  const { data: lights } = useLightsQuery();

  return (
    <BaseLayout title="Lights">
      <Stack spacing={5}>
        <Stack spacing={5}>
          {Object.entries(lights || {}).map(([key, value]) => {
            return <LightCard key={key} deviceId={key} initialData={value} />;
          })}
        </Stack>
      </Stack>
    </BaseLayout>
  );
};

export default Lights;
