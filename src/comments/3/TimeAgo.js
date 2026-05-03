import {parseISO, formatDistanceToNow} from "date-fns";

// Here is a component that gets a timestamp from the posts slice. It parses the timestamp with the "parseISO" method. Then, it uses the "formatDistanceToNow" method to get a time period, which it sets in the UI so that it shows how long ago the post was made.
const TimeAgo = ({timestamp}) => {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }

  return <span className="timestamp" title={timestamp}>&nbsp; <span>{timeAgo}</span></span>;
};
export default TimeAgo;