import { Entity } from "@ftrack/api";

interface Preferences {
  ftrackServerUrl: string;
  ftrackApiUser: string;
  ftrackApiKey: string;
  assignedTasksFilter: string;
}

interface Status {
  id: string;
  sort: number;
  name: string;
  color: string;
}

interface Task extends Entity {
  name: string;
  description: string;
  thumbnail_url: {
    value: string;
  };
  link: {
    id: string;
    name: string;
  }[];
  priority: {
    name: string;
    color: string;
  };
  status: Status;
  end_date: {
    toDate: () => Date;
  };
}


interface AssetVersionEntity extends Entity {
  id: string;
  asset: { name: string };
  link: { name: string }[];
  version: string;
  thumbnail_url: { value: string };
  status: { name: string; color: string };
}

interface ProjectEntity extends Entity {
  full_name: string;
  thumbnail_url: { value: string };
  status: string;
  project_schema: { name: string };
  end_date: { toDate: () => Date };
}

interface TypedContextEntity extends Entity {
  name: string;
  link: { name: string }[];
  thumbnail_url: { value: string };
  status: { name: string; color: string };
  end_date: { toDate: () => Date };
}

export type SearchableEntity = AssetVersionEntity | ProjectEntity | TypedContextEntity;
