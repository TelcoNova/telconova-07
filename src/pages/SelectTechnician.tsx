// Select Technician Page - Strategy Pattern for filtering + Command Pattern for assignment
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Plus, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Header } from '../components/layout/Header';
import { TechnicianCard } from '../components/technicians/TechnicianCard';
import { TechnicianFiltersComponent } from '../components/technicians/TechnicianFilters';
import { useTechnicians } from '../hooks/useTechnicians';
import { useOrders, useOrder } from '../hooks/useOrders';
import { useAuthStore } from '../store/useAuthStore';
import { TechnicianFilters } from '../models';
import { toast } from '@/hooks/use-toast';

export const SelectTechnician = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  
  const orderId = searchParams.get('orderId');
  const isReassignment = searchParams.get('isReassignment') === 'true';
  
  const [filters, setFilters] = useState<TechnicianFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Hooks
  const { order } = useOrder(orderId || '');
  const { assignOrder } = useOrders();
  const {
    technicians,
    isLoading,
    getAvailableTechnicians,
  } = useTechnicians({
    ...filters,
    searchTerm: searchTerm.trim() || undefined,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      navigate('/dashboard');
    }
  }, [orderId, navigate]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm: searchTerm.trim() || undefined }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSelectTechnician = async (technicianId: string) => {
    if (!orderId || !order) return;

    setIsAssigning(true);
    
    try {
      await assignOrder({
        orderId,
        technicianId,
        previousTechnicianId: isReassignment ? order.assignedTo || undefined : undefined,
      });

      toast({
        title: isReassignment ? "Técnico reasignado" : "Técnico asignado",
        description: `La orden ${orderId} ha sido ${isReassignment ? 'reasignada' : 'asignada'} exitosamente.`,
        variant: "default",
      });

      // Navigate back to dashboard after successful assignment
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo asignar el técnico. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateTechnician = () => {
    // TODO: Implement create technician modal/page
    toast({
      title: "Próximamente",
      description: "La funcionalidad para crear técnicos estará disponible pronto.",
      variant: "default",
    });
  };

  const availableTechnicians = getAvailableTechnicians();
  const filteredTechnicians = technicians.filter(tech => tech.carga < 5);

  const renderTechnicianSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="card-elevated">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <UserPlus className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        No hay técnicos disponibles
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchTerm || Object.keys(filters).length > 0
          ? 'No se encontraron técnicos que coincidan con los filtros aplicados. Intente ajustar los criterios de búsqueda.'
          : 'Todos los técnicos están ocupados o no hay técnicos registrados en el sistema.'
        }
      </p>
      <div className="space-y-2">
        {(searchTerm || Object.keys(filters).length > 0) && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilters({});
            }}
            className="btn-secondary"
          >
            Limpiar filtros
          </Button>
        )}
        <Button
          onClick={handleCreateTechnician}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Técnico
        </Button>
      </div>
    </div>
  );

  if (!isAuthenticated || !orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="btn-ghost"
            aria-label="Volver al dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isReassignment ? 'Reasignar Técnico' : 'Seleccionar Técnico'}
            </h1>
            <p className="text-muted-foreground">
              {order ? `Orden: ${order.id} - ${order.servicio}` : 'Cargando información de la orden...'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          
          <Button
            onClick={handleCreateTechnician}
            className="btn-secondary"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Técnico
          </Button>
        </div>

        {/* Filters and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TechnicianFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-24"
            />
          </div>

          {/* Technicians Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Cargando técnicos...'
                ) : (
                  <>
                    {filteredTechnicians.length} de {technicians.length} técnicos disponibles
                  </>
                )}
              </div>
              
              {filteredTechnicians.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Ordenado por carga de trabajo
                </div>
              )}
            </div>

            {/* Technicians List */}
            {isLoading ? (
              renderTechnicianSkeleton()
            ) : filteredTechnicians.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTechnicians.map(technician => (
                  <TechnicianCard
                    key={technician.id}
                    technician={technician}
                    onSelect={handleSelectTechnician}
                    isSelectable={!isAssigning}
                    showSelectButton={true}
                  />
                ))}
              </div>
            ) : (
              renderEmptyState()
            )}
          </div>
        </div>

        {/* Assignment Loading Overlay */}
        {isAssigning && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="card-elevated p-6">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-foreground font-medium">
                  {isReassignment ? 'Reasignando técnico...' : 'Asignando técnico...'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Por favor espere mientras procesamos la solicitud
                </p>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};