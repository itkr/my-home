export type Scene = {
  name: string;
  lights: string[];
  owner: string;
  recycle: boolean;
  locked: boolean;
  appdata: {
    version: number;
    data: string;
  };
  picture: string;
  lastupdated: string;
  version: number;
};
