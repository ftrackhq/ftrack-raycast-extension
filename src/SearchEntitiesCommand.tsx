// :copyright: Copyright (c) 2023 ftrack
import "cross-fetch/polyfill";
import { Icon, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { buildExpression } from "./util/buildExpression";
import { configuration, EntityListItem } from "./EntityListItem";
import { session } from "./util/session";
import { useState } from "react";
import { SearchableEntity } from "./types";

type SearchableEntityTypes = keyof typeof configuration;

const searchRegex = new RegExp("(?:context_id:([\\w-]+))?(.*)");
async function searchEntities(
  entityType: SearchableEntityTypes,
  searchText = ""
) {
  console.debug(`Searching ${entityType}: ${searchText}`);
  const expression = buildExpression({
    entityType,
    projection: configuration[entityType].projection,
    order: configuration[entityType].order,
    filter: "",
    limit: 100,
    offset: 0,
  });

  const matches = searchText.match(searchRegex);
  const contextId = matches?.[1];
  const terms = (matches?.[2] ?? '').split(" ") ?? [];
  console.debug(
    `contextId=${contextId}, terms=${terms}`
  );

  const response = await session.search({
    expression,
    entityType,
    terms,
    contextId,
  });

  console.debug(`Found ${response.data.length} items`);
  return response.data as SearchableEntity[];
}

export default function SearchEntitiesCommand({
  entityType = "Project",
  defaultSearchText = "",
}: {
  entityType: SearchableEntityTypes;
  defaultSearchText?: string;
}) {
  const [searchText, setSearchText] = useState(defaultSearchText);
  const { data, isLoading, revalidate } = usePromise(searchEntities, [
    entityType,
    searchText,
  ]);

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearchText}
      searchText={searchText}
      isLoading={isLoading}
    >
      {data?.map((entity) => {
        const entityConfig = configuration[entityType];
        return (
          <EntityListItem
            key={entity.id}
            configuration={entityConfig}
            entity={entity}
            revalidate={revalidate}
          />
        );
      })}
      {data?.length === 0 ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title={`No ${configuration[entityType].namePlural} found`}
        />
      ) : null}
    </List>
  );
}
