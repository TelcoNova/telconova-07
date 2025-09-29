// Workload Indicator Component - Single Responsibility
import { cn } from "@/lib/utils";

interface WorkloadIndicatorProps {
  current: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const WorkloadIndicator = ({ 
  current, 
  max, 
  size = 'md',
  showLabel = true,
  className 
}: WorkloadIndicatorProps) => {
  const percentage = (current / max) * 100;
  const isFull = current >= max;
  
  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base',
  };

  const getColorClass = () => {
    if (isFull) return 'bg-destructive';
    if (percentage > 75) return 'bg-warning';
    if (percentage > 50) return 'bg-warning/70';
    return 'bg-success';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'w-full bg-muted rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            'h-full transition-all duration-300',
            getColorClass()
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          'font-medium whitespace-nowrap',
          isFull ? 'text-destructive' : 'text-muted-foreground',
          sizeClasses[size].split(' ')[1]
        )}>
          {current}/{max}
        </span>
      )}
    </div>
  );
};