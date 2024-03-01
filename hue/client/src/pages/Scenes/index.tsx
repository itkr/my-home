import { FC } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useScenesQuery } from "@/hooks";
import { BaseLayout } from "@/components/BaseLayout";

const Home: FC = () => {
  const { data: scenes } = useScenesQuery();
  return (
    <BaseLayout title="Scenes">
      <Stack spacing={5}>
        {Object.entries(scenes || {}).map(([key, value]) => {
          return (
            <Box key={key}>
              <Card>
                <CardHeader>
                  <Flex justifyContent="space-between">
                    <Heading as="h3" size="md">
                      {value.name} (ID: {key})
                    </Heading>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<BsThreeDotsVertical />}
                      />
                      <MenuList>
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <UnorderedList>
                    <ListItem>Type: {value.type}</ListItem>
                    <ListItem>Group: {value.group}</ListItem>
                    <ListItem>Owner: {value.owner}</ListItem>
                    <ListItem>Recycle: {value.recycle ? "Yes" : "No"}</ListItem>
                    <ListItem>Locked: {value.locked ? "Yes" : "No"}</ListItem>
                    <ListItem>
                      Appdata: {JSON.stringify(value.appdata)}
                    </ListItem>
                    <ListItem>Last Updated: {value.lastupdated}</ListItem>
                    <ListItem>Version: {value.version}</ListItem>
                    <ListItem>Picture: {value.picture}</ListItem>
                    <ListItem>Lights: {JSON.stringify(value.lights)}</ListItem>
                  </UnorderedList>
                </CardBody>
              </Card>
            </Box>
          );
        })}
      </Stack>
    </BaseLayout>
  );
};

export default Home;
