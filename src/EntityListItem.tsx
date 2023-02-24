import { Entity } from "@ftrack/api";
import {
  Color,
  List,
  Image,
  ActionPanel,
  Action,
  getPreferenceValues,
  Icon,
} from "@raycast/api";
// import SearchObjectsCommand from "./search_typedcontext";
// import SearchVersionsCommand from "./search_versions";
import {
  AssetVersionEntity,
  Preferences,
  ProjectEntity,
  SearchableEntity,
  TypedContextEntity,
} from "./types";

const preferences = getPreferenceValues<Preferences>();

function toSentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.substring(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface EntityListItemProps<EntityType = any> {
  entity: EntityType;
  configuration: EntityListItemConfiguration<EntityType>;
}

export function EntityListItem({
  entity,
  configuration,
  ...props
}: EntityListItemProps) {
  return (
    <List.Item
      title={configuration.title(entity)}
      subtitle={configuration.subtitle?.(entity)}
      icon={
        configuration.thumbnail && {
          source: configuration.thumbnail?.(entity),
          mask: Image.Mask.RoundedRectangle,
        }
      }
      accessories={configuration.accessories?.(entity)}
      actions={configuration.actions?.(entity)}
      {...props}
    />
  );
}

interface EntityListItemConfiguration<EntityType = SearchableEntity> {
  namePlural: string;
  projection: string[];
  order: string;
  title: (entity: EntityType) => List.Item.Props["title"];
  subtitle?: (entity: EntityType) => List.Item.Props["subtitle"];
  thumbnail?: (entity: EntityType) => Image.Source;
  accessories?: (entity: EntityType) => List.Item.Props["accessories"];
  actions?: (entity: EntityType) => List.Item.Props["actions"];
}

export const configuration = {
  AssetVersion: {
    namePlural: "versions",
    projection: [
      "id",
      "asset.name",
      "link",
      "version",
      "thumbnail_url",
      "status.name",
      "status.color",
    ],
    order: "asset.name, version desc",
    title: (entity) => `${entity.asset?.name} - v${entity.version}`,
    subtitle: (entity) =>
      entity.link
        .slice(0, -1)
        .map((item) => item.name)
        .join("/"),
    thumbnail: (entity) => entity.thumbnail_url.value,
    accessories: (entity) => [
      { tag: { value: entity.status.name, color: entity.status.color } },
    ],
    actions: (entity) => (
      <ActionPanel>
        <Action.OpenInBrowser
          url={`${preferences.ftrackServerUrl}/#itemId=home&slideEntityType=assetversion&slideEntityId=${entity.id}`}
        />
        <Action.OpenInBrowser
          title="Play"
          icon={Icon.Play}
          url={`${preferences.ftrackServerUrl}/player/version/${entity.id}`}
        />
      </ActionPanel>
    ),
  } as EntityListItemConfiguration<AssetVersionEntity>,
  Project: {
    namePlural: "projects",
    projection: [
      "id",
      "full_name",
      "thumbnail_url",
      "status",
      "project_schema.name",
      "end_date",
    ],
    order: "full_name",
    title: (entity) => entity.full_name,
    subtitle: (entity) => entity.project_schema.name,
    thumbnail: (entity) => entity.thumbnail_url.value,
    accessories: (entity) => [
      {
        tag: {
          value: toSentenceCase(entity.status),
          color: entity.status === "active" ? Color.Green : Color.SecondaryText,
        },
      },
      {
        date: entity.end_date?.toDate(),
      },
    ],
    actions: (entity) => (
      <ActionPanel>
        <Action.OpenInBrowser
          url={`${preferences.ftrackServerUrl}/#itemId=projects&entityType=show&entityId=${entity.id}&slideEntityType=show&slideEntityId=${entity.id}`}
        />
        <Action.OpenInBrowser
          title="Play"
          icon={Icon.Play}
          url={`${preferences.ftrackServerUrl}/player/context/${entity.id}`}
        />
        {/*
        <Action.Push
          title="Search Versions"
          icon={Icon.MagnifyingGlass}
          target={
            <SearchVersionsCommand
              defaultSearchText={`project_id:${entity.id}`}
            />
          }
        />
        <Action.Push
          title="Search Objects"
          icon={Icon.MagnifyingGlass}
          target={
            <SearchObjectsCommand
              defaultSearchText={`project_id:${entity.id}`}
            />
          }
        />
        */}
      </ActionPanel>
    ),
  } as EntityListItemConfiguration<ProjectEntity>,
  TypedContext: {
    namePlural: "objects",
    projection: [
      "id",
      "name",
      "link",
      "thumbnail_url",
      "type.name",
      "type.color",
      "object_type.name",
      "object_type.is_typeable",
      "object_type.is_statusable",
      "object_type.is_prioritizable",
      "status.name",
      "status.color",
      "priority.name",
      "priority.color",
      "end_date",
    ],
    order: "name",
    title: (entity) => entity.name,
    subtitle: (entity) => entity.link.map((item) => item.name).join("/"),
    thumbnail: (entity) => entity.thumbnail_url.value,
    accessories: (entity) => [
      {
        tag: {
          value: entity.object_type.is_typeable
            ? `${entity.type.name} (${entity.object_type.name})`
            : entity.object_type.name,
          color: entity.object_type.is_typeable ? entity.type.color : null,
        },
      },
      {
        tag: {
          value: entity.object_type.is_prioritizable
            ? entity.priority.name
            : null,
          color: entity.object_type.is_prioritizable
            ? entity.priority.color
            : null,
        },
      },
      {
        date: entity.end_date?.toDate(),
      },
      {
        tag: {
          value: entity.object_type.is_statusable ? entity.status.name : null,
          color: entity.object_type.is_statusable ? entity.status.color : null,
        },
      },
    ],
    actions: (entity) => (
      <ActionPanel>
        <Action.OpenInBrowser
          url={`${preferences.ftrackServerUrl}/#itemId=home&slideEntityType=task&slideEntityId=${entity.id}`}
        />
        <Action.OpenInBrowser
          title="Play"
          icon={Icon.Play}
          url={`${preferences.ftrackServerUrl}/player/context/${entity.id}`}
        />
      </ActionPanel>
    ),
  } as EntityListItemConfiguration<TypedContextEntity>,
};
