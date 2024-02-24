import { FC } from "react";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
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
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useGroupsQuery } from "@/hooks";
import { GroupLightCard } from "@/components/GroupLightCard";
import { Header } from "@/components/Header";

const Groups: FC = () => {
  const { data: groups, refetch: refetchGroups } = useGroupsQuery({
    // refetchInterval: 5000,
  });

  return (
    <>
      <Header title="Hue Dashboard" />
      <Container paddingY={5}>
        <Stack spacing={5}>
          <Heading as="h2">Groups</Heading>
          <Stack spacing={5}>
            {Object.entries(groups || {}).map(([key, value]) => {
              return (
                <Box key={key}>
                  <Card>
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
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default Groups;
