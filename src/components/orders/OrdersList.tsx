// Orders List Component - Composition Pattern
import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { OrderCard } from './OrderCard';
import { Order } from '../../models';

interface OrdersListProps {
  title: string;
  orders: Order[];
  isLoading?: boolean;
  onAssign?: (orderId: string) => void;
  onReassign?: (orderId: string) => void;
  onCreateOrder?: () => void;
  showCreateButton?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export const OrdersList = ({
  title,
  orders,
  isLoading = false,
  onAssign,
  onReassign,
  onCreateOrder,
  showCreateButton = false,
  searchPlaceholder = "Buscar por número de orden...",
  emptyMessage = "No hay órdenes disponibles",
  className,
}: OrdersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOrderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card-elevated p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-2">
        <Filter className="h-12 w-12 mx-auto opacity-50" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">
        {searchTerm ? 'No se encontraron resultados' : emptyMessage}
      </h3>
      <p className="text-xs text-muted-foreground">
        {searchTerm ? 'Intente con otros términos de búsqueda' : 'Las órdenes aparecerán aquí cuando estén disponibles'}
      </p>
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
            </span>
            {showCreateButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateOrder}
                className="btn-secondary"
                aria-label="Crear nueva orden"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nueva
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto space-y-3">
        {isLoading ? (
          renderOrderSkeleton()
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAssign={onAssign}
              onReassign={onReassign}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};