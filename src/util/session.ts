import { Session } from "@ftrack/api";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  ftrackServerUrl: string;
  ftrackApiUser: string;
  ftrackApiKey: string;
  assignedTasksFilter: string;
}
const preferences = getPreferenceValues<Preferences>();

export const session = new Session(
  preferences.ftrackServerUrl,
  preferences.ftrackApiUser,
  preferences.ftrackApiKey
);
