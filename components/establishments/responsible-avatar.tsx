import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initialsFromName } from "@/lib/utils";

interface ResponsibleAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ResponsibleAvatar({
  name,
  className,
  size = "md",
}: ResponsibleAvatarProps) {
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }[size];

  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarFallback className="text-inherit">
        {initialsFromName(name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
