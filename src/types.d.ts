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
