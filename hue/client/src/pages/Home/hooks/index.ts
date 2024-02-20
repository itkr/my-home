import {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import axios from "axios";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME } from "@/config";
import { Light, Group, Schedule } from "../types";

const ip = HUE_BRIDGE_IP;
const username = HUE_BRIDGE_USERNAME;

const useLights = (ip: string, username: string) => {
  const getLight = async (deviceId: string): Promise<Light> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => res.data);
  };

  const putLight = async (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };

  const toggleLight = async (deviceId: string): Promise<any> => {
    const light = await getLight(deviceId);
    return await putLight(deviceId, { on: !light.state.on });
  };

  return { putLight, toggleLight };
};

type MutationOptions = {
  onMutate?: (args: any) => any;
  onError?: (args: any) => any;
  onSuccess?: () => any;
  onSettled?: () => any;
};

// const useLightMutation = (deviceId: string, options?: UseMutationOptions) => {
const useLightMutation = (deviceId: string, options?: MutationOptions) => {
  const putLight = async (state: Partial<Light["state"]>) => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };
  return useMutation({
    mutationFn: putLight,
    ...options,
  });
};

const useLightsQuery = (options?: UseQueryOptions) => {
  const listLights = async (): Promise<Record<string, Light>> => {
    const url = `http://${ip}/api/${username}/lights`;
    return await axios.get(url).then((res) => res.data);
  };
  return useQuery({
    queryKey: "lights",
    queryFn: listLights,
    ...options,
  });
};

const useLightQueryById = (deviceId: string, options?: UseQueryOptions) => {
  const getLight = async (): Promise<Light> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => res.data);
  };
  return useQuery({
    queryKey: ["lights", deviceId],
    queryFn: getLight,
    ...options,
  });
};

const useGroupsQuery = (options?: UseQueryOptions) => {
  const listGroups = async (): Promise<Record<string, Group>> => {
    const url = `http://${ip}/api/${username}/groups`;
    return await axios.get(url).then((res) => res.data);
  };
  return useQuery({
    queryKey: "groups",
    queryFn: listGroups,
    ...options,
  });
};

const useSchedulesQuery = (options: UseQueryOptions = {}) => {
  const listSchedules = async (): Promise<Record<string, Schedule>> => {
    const url = `http://${ip}/api/${username}/schedules`;
    return await axios.get(url).then((res) => res.data);
  };
  return useQuery({
    queryKey: "schedules",
    queryFn: listSchedules,
    ...options,
  });
};

export {
  useLights,
  useLightsQuery,
  useLightQueryById,
  useGroupsQuery,
  useSchedulesQuery,
  useLightMutation,
};
