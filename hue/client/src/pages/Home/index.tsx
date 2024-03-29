import { FC } from "react";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Wrap,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  useLightsQuery,
  useGroupsQuery,
  useSchedulesQuery,
  useScenesQuery,
} from "@/hooks";
import { LightCard } from "@/components/LightCard";
import { GroupLightCard } from "@/components/GroupLightCard";
import { BaseLayout } from "@/components/BaseLayout";

const Home: FC = () => {
  const { data: lights } = useLightsQuery({});
  const { data: groups, refetch: refetchGroups } = useGroupsQuery({
    refetchInterval: 5000,
  });
  const { data: schedules } = useSchedulesQuery({
    refetchInterval: 5000,
  });
  const { data: scenes } = useScenesQuery({
    // refetchInterval: 5000,
  });

  return (
    <BaseLayout title="Hue Dashboard">
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
              <Card key={key}>
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
        <Heading as="h2">Scenes</Heading>
        <Stack spacing={5}>
          {Object.entries(scenes || {}).map(([key, value]) => {
            return (
              <Box key={key}>
                {value.name}({value.type})
                <UnorderedList>
                  <ListItem>Group: {value.group}</ListItem>
                  <ListItem>Owner: {value.owner}</ListItem>
                  <ListItem>Recycle: {value.recycle ? "Yes" : "No"}</ListItem>
                  <ListItem>Locked: {value.locked ? "Yes" : "No"}</ListItem>
                  <ListItem>Appdata: {JSON.stringify(value.appdata)}</ListItem>
                  <ListItem>Last Updated: {value.lastupdated}</ListItem>
                  <ListItem>Version: {value.version}</ListItem>
                  <ListItem>Picture: {value.picture}</ListItem>
                  <ListItem>Lights: {JSON.stringify(value.lights)}</ListItem>
                </UnorderedList>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </BaseLayout>
  );
};

export default Home;
