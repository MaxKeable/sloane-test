import { cn } from "@repo/ui-kit/lib/utils";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  containerClasses?: string;
};

export default function PageWrapper({
  title,
  description,
  children,
  containerClasses,
}: Props) {
  return (
    <div className="w-full h-full">
      <div className={`${title || description ? "pb-3" : ""}`}>
        {title && <h1 className="text-3xl font-black text-white">{title}</h1>}
        {description && <p>{description}</p>}
      </div>
      <div className={cn(`flex flex-col gap-6`, containerClasses)}>
        {children}
      </div>
    </div>
  );
}
