// Status Badge Component - Single Responsibility
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { OrderStatus } from "../../models";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    className: 'status-pending',
  },
  assigned: {
    label: 'Asignada',
    className: 'status-assigned',
  },
  completed: {
    label: 'Completada',
    className: 'status-assigned',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'status-blocked',
  },
} as const;

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={cn(config.className, className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
};