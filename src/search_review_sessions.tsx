// :copyright: Copyright (c) 2023 ftrack
import "cross-fetch/polyfill";
import SearchEntitiesCommand from "./SearchEntitiesCommand";

export default function SearchReviewSessionsCommand({ ...props }) {
  return <SearchEntitiesCommand entityType="ReviewSession" {...props} />;
}
