// Order Card Component - Single Responsibility
import { Clock, MapPin, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../ui/status-badge';
import { Order } from '../../models';
import { useTechnician } from '../../hooks/useTechnicians';

interface OrderCardProps {
  order: Order;
  onAssign?: (orderId: string) => void;
  onReassign?: (orderId: string) => void;
  className?: string;
}

export const OrderCard = ({ order, onAssign, onReassign, className }: OrderCardProps) => {
  const { technician } = useTechnician(order.assignedTo || '');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAction = () => {
    if (order.assignedTo && onReassign) {
      onReassign(order.id);
    } else if (!order.assignedTo && onAssign) {
      onAssign(order.id);
    }
  };

  return (
    <Card className={`card-elevated ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{order.id}</h3>
            <StatusBadge status={order.status} className="mt-1" />
          </div>
          <Button
            variant={order.assignedTo ? "outline" : "default"}
            size="sm"
            onClick={handleAction}
            className={order.assignedTo ? "btn-secondary" : "btn-primary"}
          >
            {order.assignedTo ? 'Reasignar' : 'Asignar'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Service Info */}
        <div>
          <h4 className="font-medium text-foreground mb-1">{order.servicio}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{order.descripcion}</p>
        </div>

        {/* Order Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{order.zona}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(order.creadoEn)}</span>
          </div>

          {order.assignedTo && technician && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{technician.nombre}</span>
            </div>
          )}
        </div>

        {/* Assigned Technician Info */}
        {order.assignedTo && technician && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Técnico: <span className="text-foreground font-medium">{technician.nombre}</span></p>
              <p>Especialidad: <span className="text-foreground">{technician.especialidad}</span></p>
              <p>Teléfono: <span className="text-foreground">{technician.telefono}</span></p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};