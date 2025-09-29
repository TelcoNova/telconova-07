// Technician Filters Component - Strategy Pattern for filters
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { TechnicianFilters, Zone, Specialty, TimeSlot } from '../../models';

interface TechnicianFiltersProps {
  filters: TechnicianFilters;
  onFiltersChange: (filters: TechnicianFilters) => void;
  className?: string;
}

const ZONES: Zone[] = ['zona centro', 'zona sur', 'zona norte', 'zona oeste', 'zona este'];
const SPECIALTIES: Specialty[] = ['Eléctrico', 'Plomería', 'HVAC', 'Redes'];
const TIME_SLOTS: TimeSlot[] = ['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-00:00'];

export const TechnicianFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  className 
}: TechnicianFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<TechnicianFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleZoneChange = (zone: Zone, checked: boolean) => {
    const currentZones = filters.zonas || [];
    const newZones = checked
      ? [...currentZones, zone]
      : currentZones.filter(z => z !== zone);
    
    updateFilters({ zonas: newZones.length > 0 ? newZones : undefined });
  };

  const handleSpecialtyChange = (specialty: Specialty, checked: boolean) => {
    const currentSpecialties = filters.especialidades || [];
    const newSpecialties = checked
      ? [...currentSpecialties, specialty]
      : currentSpecialties.filter(s => s !== specialty);
    
    updateFilters({ especialidades: newSpecialties.length > 0 ? newSpecialties : undefined });
  };

  const handleTimeSlotChange = (timeSlot: TimeSlot, checked: boolean) => {
    const currentSlots = filters.disponibilidad || [];
    const newSlots = checked
      ? [...currentSlots, timeSlot]
      : currentSlots.filter(s => s !== timeSlot);
    
    updateFilters({ disponibilidad: newSlots.length > 0 ? newSlots : undefined });
  };

  const handleWorkloadChange = (value: number[]) => {
    updateFilters({ maxCarga: value[0] });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.zonas?.length) count++;
    if (filters.especialidades?.length) count++;
    if (filters.disponibilidad?.length) count++;
    if (filters.maxCarga !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={`${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Zone Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Zonas</Label>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map(zone => (
                  <div key={zone} className="flex items-center space-x-2">
                    <Checkbox
                      id={`zone-${zone}`}
                      checked={filters.zonas?.includes(zone) || false}
                      onCheckedChange={(checked) => handleZoneChange(zone, !!checked)}
                    />
                    <Label 
                      htmlFor={`zone-${zone}`} 
                      className="text-xs font-normal capitalize cursor-pointer"
                    >
                      {zone}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialty Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Especialidades</Label>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALTIES.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={filters.especialidades?.includes(specialty) || false}
                      onCheckedChange={(checked) => handleSpecialtyChange(specialty, !!checked)}
                    />
                    <Label 
                      htmlFor={`specialty-${specialty}`} 
                      className="text-xs font-normal cursor-pointer"
                    >
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Workload Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Carga máxima: {filters.maxCarga ?? 5}/5
              </Label>
              <Slider
                value={[filters.maxCarga ?? 5]}
                onValueChange={handleWorkloadChange}
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Availability Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Disponibilidad horaria</Label>
              <div className="space-y-2">
                {TIME_SLOTS.map(slot => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={`slot-${slot}`}
                      checked={filters.disponibilidad?.includes(slot) || false}
                      onCheckedChange={(checked) => handleTimeSlotChange(slot, !!checked)}
                    />
                    <Label 
                      htmlFor={`slot-${slot}`} 
                      className="text-xs font-normal cursor-pointer"
                    >
                      {slot}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};