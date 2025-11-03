import { StatItemProps } from "./types";
import { format, parseISO } from "date-fns";

const StatisticItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  lastUpdate,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon && <span className="text-brand-green text-xl">{icon}</span>}
        <h3 className="text-gray-600 font-medium">{label}</h3>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-brand-green">{value}</p>
        {lastUpdate && (
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {format(parseISO(lastUpdate), "MMM d, yyyy")}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatisticItem;
