// :copyright: Copyright (c) 2023 ftrack
import "cross-fetch/polyfill";
import SearchEntitiesCommand from "./SearchEntitiesCommand";

export default function SearchVersionsCommand({ ...props }) {
  return <SearchEntitiesCommand entityType="AssetVersion" {...props} />;
}
