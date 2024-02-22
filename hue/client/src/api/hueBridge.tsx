import axios from "axios";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME } from "@/config";
import { Light, Group, Schedule, PutResponse } from "@/types";

// Hue Bridge

const ip = HUE_BRIDGE_IP;
const username = HUE_BRIDGE_USERNAME;

// Light API

const listLights = async (): Promise<Record<string, Light>> => {
  const url = `http://${ip}/api/${username}/lights`;
  return await axios.get(url).then((res) => res.data);
};

const getLight = async (deviceId: string): Promise<Light> => {
  const url = `http://${ip}/api/${username}/lights/${deviceId}`;
  return await axios.get(url).then((res) => res.data);
};

const putLight = async (
  deviceId: string,
  state: Partial<Light["state"]>
): Promise<PutResponse> => {
  const url = `http://${ip}/api/${username}/lights/${deviceId}/state`;
  return await axios.put(url, state);
};

// Group API

const listGroups = async (): Promise<Record<string, Group>> => {
  const url = `http://${ip}/api/${username}/groups`;
  return await axios.get(url).then((res) => res.data);
};

const getGroup = async (groupId: string): Promise<Group> => {
  const url = `http://${ip}/api/${username}/groups/${groupId}`;
  return await axios.get(url).then((res) => res.data);
};

const putGroup = async (
  groupId: string,
  state: Partial<Group["action"]>
): Promise<PutResponse> => {
  const url = `http://${ip}/api/${username}/groups/${groupId}/action`;
  return await axios.put(url, state);
};

// Schedule API

const listSchedules = async (): Promise<Record<string, Schedule>> => {
  const url = `http://${ip}/api/${username}/schedules`;
  return await axios.get(url).then((res) => res.data);
};

export {
  // light
  listLights,
  getLight,
  putLight,
  // group
  listGroups,
  getGroup,
  putGroup,
  // schedule
  listSchedules,
};
