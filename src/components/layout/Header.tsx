// Header Component - Single Responsibility + Composition
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuthStore } from "../../store/useAuthStore";
import telconovaLogo from "../../assets/telconova-logo.png";

export const Header = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img 
            src={telconovaLogo} 
            alt="TelcoNova" 
            className="h-8 w-8 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground">TelcoNova</h1>
            <span className="text-xs text-muted-foreground">Sistema de Asignaciones</span>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user && (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{user.name}</span>
                <span className="text-muted-foreground">({user.role})</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="btn-ghost text-destructive hover:text-destructive"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-2">Salir</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};