// Technician Card Component - Single Responsibility
import { Phone, Mail, MapPin, Wrench, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { WorkloadIndicator } from '../ui/workload-indicator';
import { Technician } from '../../models';

interface TechnicianCardProps {
  technician: Technician;
  onSelect?: (technicianId: string) => void;
  isSelectable?: boolean;
  showSelectButton?: boolean;
  className?: string;
}

export const TechnicianCard = ({ 
  technician, 
  onSelect, 
  isSelectable = true,
  showSelectButton = true,
  className 
}: TechnicianCardProps) => {
  const isAvailable = technician.carga < 5;
  const isFullyLoaded = technician.carga >= 5;

  const handleSelect = () => {
    if (isSelectable && isAvailable && onSelect) {
      onSelect(technician.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`card-elevated ${!isAvailable ? 'opacity-60' : ''} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {technician.fotoUrl ? (
              <img
                src={technician.fotoUrl}
                alt={`Foto de ${technician.nombre}`}
                className="h-12 w-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-border flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {getInitials(technician.nombre)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground truncate">
                  {technician.nombre}
                </h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {technician.especialidad}
                </Badge>
              </div>
              
              {!isAvailable && (
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`tel:${technician.telefono}`}
              className="text-foreground hover:text-primary transition-colors"
            >
              {technician.telefono}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`mailto:${technician.email}`}
              className="text-foreground hover:text-primary transition-colors truncate"
            >
              {technician.email}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground capitalize">{technician.zona}</span>
          </div>
        </div>

        {/* Workload */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Carga de trabajo</span>
          </div>
          <WorkloadIndicator 
            current={technician.carga} 
            max={5} 
            size="md"
            showLabel={true}
          />
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Disponibilidad</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {technician.disponibilidad.map(slot => (
              <Badge key={slot} variant="outline" className="text-xs">
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        {/* Select Button */}
        {showSelectButton && (
          <Button
            onClick={handleSelect}
            disabled={!isSelectable || !isAvailable}
            className={`w-full ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
            aria-label={`Seleccionar técnico ${technician.nombre}`}
          >
            {isFullyLoaded ? 'No Disponible' : 'Seleccionar'}
          </Button>
        )}

        {/* Status Message */}
        {isFullyLoaded && (
          <p className="text-xs text-destructive text-center">
            Técnico con carga máxima (5/5)
          </p>
        )}
      </CardContent>
    </Card>
  );
};