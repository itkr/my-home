import axios from "axios";
import { HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME } from "@/config";
import { Light, Group, Schedule, PutResponse, Scene } from "@/types";

class BaseAPI<T> {
  protected ip: string;
  protected username: string;
  protected resource: string;
  constructor(ip: string, username: string, resource: string) {
    this.ip = ip;
    this.username = username;
    this.resource = resource;
  }
  async list(): Promise<Record<string, T>> {
    const url = `http://${this.ip}/api/${this.username}/${this.resource}`;
    return await axios.get(url).then((res) => res.data);
  }
  async get(deviceId: string): Promise<T> {
    const url = `http://${this.ip}/api/${this.username}/${this.resource}/${deviceId}`;
    return await axios.get(url).then((res) => res.data);
  }
}

class LightAPI extends BaseAPI<Light> {
  constructor(ip: string, username: string) {
    super(ip, username, "lights");
  }
  async put(
    deviceId: string,
    state: Partial<Light["state"]>
  ): Promise<PutResponse> {
    const url = `http://${this.ip}/api/${this.username}/${this.resource}/${deviceId}/state`;
    return await axios.put(url, state);
  }
}

class GroupAPI extends BaseAPI<Group> {
  constructor(ip: string, username: string) {
    super(ip, username, "groups");
  }
  async put(
    groupId: string,
    state: Partial<Group["action"]>
  ): Promise<PutResponse> {
    const url = `http://${this.ip}/api/${this.username}/${this.resource}/${groupId}/action`;
    return await axios.put(url, state);
  }
}

class ScheduleAPI extends BaseAPI<Schedule> {
  constructor(ip: string, username: string) {
    super(ip, username, "schedules");
  }
}

class SceneAPI extends BaseAPI<Scene> {
  constructor(ip: string, username: string) {
    super(ip, username, "scenes");
  }
}

class HueBridge {
  light: LightAPI;
  group: GroupAPI;
  schedule: ScheduleAPI;
  scene: SceneAPI;

  constructor(ip: string, username: string) {
    this.light = new LightAPI(ip, username);
    this.group = new GroupAPI(ip, username);
    this.schedule = new ScheduleAPI(ip, username);
    this.scene = new SceneAPI(ip, username);
  }
}

const v1 = new HueBridge(HUE_BRIDGE_IP, HUE_BRIDGE_USERNAME);

export { v1 };
