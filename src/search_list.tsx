// :copyright: Copyright (c) 2023 ftrack
import "cross-fetch/polyfill";
import SearchEntitiesCommand from "./SearchEntitiesCommand";

export default function SearchListCommand({ ...props }) {
  return <SearchEntitiesCommand entityType="List" {...props} />;
}
