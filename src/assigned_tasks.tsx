// :copyright: Copyright (c) 2023 ftrack
import "cross-fetch/polyfill";
import {
  ActionPanel,
  List,
  Action,
  Image,
  getPreferenceValues,
  openCommandPreferences,
  Icon,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { buildExpression } from "./util/buildExpression";
import ChangeStatusCommand from "./change_status";
import { session } from "./util/session";
import { Preferences, Task } from "./types";

const preferences = getPreferenceValues<Preferences>();

async function getAssignedTasks() {
  await session.initializing;

  const filters = [
    `assignments.resource.username is "${session.apiUser}"`,
    "status.state.short is_not 'DONE'",
    "project.status is_not 'hidden'",
    "ancestors.status.state.short is_not 'BLOCKED'",
  ];
  if (preferences.assignedTasksFilter) {
    filters.push(preferences.assignedTasksFilter);
  }

  const expression = buildExpression({
    entityType: "Task",
    projection: [
      "id",
      "name",
      "link",
      "description",
      "status.name",
      "status.color",
      "status.state.short",
      "priority.color",
      "priority.name",
      "thumbnail_url",
      "end_date",
    ],
    filter: filters,
    order: "status.sort asc, name asc",
    limit: 200,
  });

  const response = await session.query(expression);
  return response.data as Task[];
}

export default function AssignedTasksCommand() {
  const { data, isLoading, revalidate } = usePromise(getAssignedTasks);
  return (
    <List isLoading={isLoading}>
      {data?.map((task) => (
        <List.Item
          key={task.id}
          title={task.name}
          subtitle={task.link
            .slice(-3, -1)
            .map((item) => item.name)
            .join(" / ")}
          icon={{
            source: task.thumbnail_url.value,
            mask: Image.Mask.Circle,
          }}
          accessories={[
            {
              tag: { value: task.priority?.name, color: task.priority?.color },
            },
            { tag: { value: task.status?.name, color: task.status?.color } },
            task.end_date ? { date: task.end_date.toDate() } : {},
          ]}
          actions={
            <ActionPanel>
              <Action.Push
                title="Change Status"
                icon={Icon.ArrowRightCircle}
                target={
                  <ChangeStatusCommand
                    entityType="Task"
                    entityId={task.id}
                    onStatusChanged={revalidate}
                  />
                }
              />
              <Action.OpenInBrowser
                url={`${preferences.ftrackServerUrl}/#itemId=home&slideEntityType=task&slideEntityId=${task.id}`}
              />
              <Action.CopyToClipboard
                title="Copy Task ID"
                content={task.id}
                shortcut={{ modifiers: ["cmd"], key: "i" }}
              />
              <Action
                title="Open Extension Preferences"
                icon={Icon.Cog}
                onAction={openCommandPreferences}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
