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
import { BaseLayout } from "@/components/BaseLayout";

const Groups: FC = () => {
  const { data: groups, refetch: refetchGroups } = useGroupsQuery({
    // refetchInterval: 5000,
  });

  return (
    <BaseLayout title="Groups">
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
    </BaseLayout>
  );
};

export default Groups;
