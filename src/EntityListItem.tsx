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
import { Preferences } from "./types";

const preferences = getPreferenceValues<Preferences>();

function toSentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.substring(1);
}

function EntityListItem({ entity, configuration, ...props }) {
  return (
    <List.Item
      title={configuration.title(entity)}
      subtitle={configuration.subtitle?.(entity)}
      icon={{
        source: configuration.thumbnail(entity),
        mask: Image.Mask.Circle,
      }}
      accessories={configuration.accessories?.(entity)}
      actions={configuration.actions?.(entity)}
      {...props}
    />
  );
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
    ListItem: EntityListItem,
  },
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
    ListItem: EntityListItem,
  },
  TypedContext: {
    namePlural: "objects",
    projection: [
      "id",
      "name",
      "link",
      "thumbnail_url",
      "status.name",
      "status.color",
      "end_date",
    ],
    order: "name",
    title: (entity) => entity.name,
    subtitle: (entity) => entity.link.map((item) => item.name).join("/"),
    thumbnail: (entity) => entity.thumbnail_url.value,
    accessories: (entity) => [
      { tag: { value: entity.status.name, color: entity.status.color } },
      {
        date: entity.end_date?.toDate(),
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
    ListItem: EntityListItem,
  },
};
