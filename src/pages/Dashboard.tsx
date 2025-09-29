// Dashboard Page - Composition + Observer patterns
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { OrdersList } from '../components/orders/OrdersList';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuthStore } from '../store/useAuthStore';
import { useOrders } from '../hooks/useOrders';
import { toast } from '@/hooks/use-toast';

// Placeholder components for unimplemented tabs
const ComingSoon = ({ feature }: { feature: string }) => (
  <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
    <div className="text-center space-y-2">
      <h3 className="text-lg font-medium text-foreground">Próximamente</h3>
      <p className="text-muted-foreground">
        {feature} estará disponible pronto
      </p>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const {
    pendingOrders,
    assignedOrders,
    isLoading,
    createOrder,
    isCreating,
  } = useOrders();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle tab change with coming soon message
  const handleTabChange = (value: string) => {
    if (value === 'automatic' || value === 'reports') {
      toast({
        title: "Próximamente",
        description: `${value === 'automatic' ? 'Asignación Automática' : 'Reporte de Asignaciones'} estará disponible pronto.`,
        variant: "default",
      });
      return;
    }
    setActiveTab(value);
  };

  const handleAssignOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate(`/select-technician?orderId=${orderId}`);
  };

  const handleReassignOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate(`/select-technician?orderId=${orderId}&isReassignment=true`);
  };

  const handleCreateOrder = () => {
    setShowCreateOrder(true);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Sistema de gestión de asignaciones técnicas
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Asignación Manual</TabsTrigger>
            <TabsTrigger value="automatic">Asignación Automática</TabsTrigger>
            <TabsTrigger value="reports">Reporte de Asignaciones</TabsTrigger>
          </TabsList>

          {/* Manual Assignment Tab */}
          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Orders */}
              <OrdersList
                title="Órdenes Pendientes"
                orders={pendingOrders}
                isLoading={isLoading}
                onAssign={handleAssignOrder}
                onCreateOrder={handleCreateOrder}
                showCreateButton={true}
                searchPlaceholder="Buscar orden pendiente..."
                emptyMessage="No hay órdenes pendientes"
                className="h-fit"
              />

              {/* Assigned Orders */}
              <OrdersList
                title="Órdenes Asignadas"
                orders={assignedOrders}
                isLoading={isLoading}
                onReassign={handleReassignOrder}
                searchPlaceholder="Buscar orden asignada..."
                emptyMessage="No hay órdenes asignadas"
                className="h-fit"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{pendingOrders.length}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success">{assignedOrders.length}</div>
                <div className="text-sm text-muted-foreground">Asignadas</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{pendingOrders.length + assignedOrders.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-warning">
                  {assignedOrders.length > 0 ? Math.round((assignedOrders.length / (pendingOrders.length + assignedOrders.length)) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Asignación</div>
              </div>
            </div>
          </TabsContent>

          {/* Automatic Assignment Tab */}
          <TabsContent value="automatic">
            <ComingSoon feature="Asignación Automática" />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ComingSoon feature="Reporte de Asignaciones" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Order Dialog */}
      {/* TODO: Implement CreateOrderForm component */}
      <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Orden</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            <p>Formulario de creación de órdenes</p>
            <p className="text-sm mt-2">Esta funcionalidad se implementará próximamente</p>
            <Button 
              onClick={() => setShowCreateOrder(false)}
              className="mt-4"
              variant="outline"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};