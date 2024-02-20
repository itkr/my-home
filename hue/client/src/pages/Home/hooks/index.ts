import { useQuery, useMutation, UseQueryOptions } from "react-query";
import axios from "axios";
import { Light, Group, Schedule } from "../types";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME } from "@/config";

const ip = HUE_BRIDGE_IP;
const username = HUE_BRIDGE_USERNAME;

const useLights = (ip: string, username: string) => {
  const getLight = async (deviceId: string): Promise<Light> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}`;
    return await axios.get(url).then((res) => res.data);
  };

  // TODO: 返り値の型を定義する
  const toggleLight = async (deviceId: string): Promise<any> => {
    // return await putLight(deviceId, { on: !lights[deviceId].state.on });
    const light = await getLight(deviceId);
    return await putLight(deviceId, { on: !light.state.on });
  };

  // TODO: 返り値の型を定義する
  const putLight = async (
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<any> => {
    const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
    return await axios.put(url, state);
  };

  return {
    getLight,
    putLight,
    toggleLight,
  };
};

const useLightsQuery = (options: UseQueryOptions = {}) => {
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

const useLightsQueryById = (
  deviceId: string,
  options: UseQueryOptions = {}
) => {
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

const useGroupsQuery = (options: UseQueryOptions = {}) => {
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
  useLightsQueryById,
  useGroupsQuery,
  useSchedulesQuery,
};
