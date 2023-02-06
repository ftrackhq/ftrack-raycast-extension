// :copyright: Copyright (c) 2023 ftrack
import {
  ActionPanel,
  Action,
  Icon,
  showToast,
  Toast,
  useNavigation,
  List,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { buildExpression } from "./util/buildExpression";
import { operation, Session } from "@ftrack/api";
import { updateEntity } from "./util/updateEntity";
import { Status } from "./types";

async function getStatusOptions({
  session,
  entityType,
  entityId,
}: {
  session: Session;
  entityType: string;
  entityId: string;
}) {
  const statusQuery = buildExpression({
    entityType: "Status",
    projection: ["id", "name", "sort", "color"],
    order: "sort desc, name asc",
    limit: 200,
  });
  const taskQuery = buildExpression({
    entityType: entityType,
    projection: ["status_id", "__permissions.status_id"],
    filter: [`id is "${entityId}"`],
    limit: 1,
  });

  const [statusResponse, taskResponse] = await session.call([
    operation.query(statusQuery),
    operation.query(taskQuery),
  ]);

  const allowedStatusIds =
    taskResponse.data[0].__permissions.status_id.__options;
  const validStatuses = (statusResponse.data as Status[]).filter((status) =>
    allowedStatusIds.includes(status.id)
  );
  const defaultValue = taskResponse.data[0].status_id as string;

  return {
    options: validStatuses,
    defaultValue,
  };
}

export default function ChangeStatusCommand({
  session,
  entityType = "Task",
  entityId,
  onStatusChanged = () => ({}),
}: {
  session: Session;
  entityType: string;
  entityId: string;
  onStatusChanged: () => void;
}) {
  const { data, isLoading, mutate } = usePromise(
    getStatusOptions.bind(null, { session, entityType, entityId })
  );
  const { pop } = useNavigation();

  const mutateEntity = async (values: { status_id: string }) => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Changing status...",
    });
    try {
      await mutate(updateEntity({ session, entityType, entityId, values }));
      toast.style = Toast.Style.Success;
      toast.title = "Status changed";
      onStatusChanged();
      pop();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to change status";
      toast.message = (error as Error)?.message;
    }
  };

  return (
    <List isLoading={isLoading}>
      {data?.options.map((status) => (
        <List.Item
          key={status.id}
          title={status.name}
          icon={{
            source:
              status.id === data.defaultValue ? Icon.CheckCircle : Icon.Circle,
            tintColor: status.color,
          }}
          actions={
            <ActionPanel>
              <Action
                title="Change Status"
                onAction={() => {
                  mutateEntity({ status_id: status.id });
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
