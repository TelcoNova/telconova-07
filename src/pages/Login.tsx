// Login Page - Clean Architecture + Form Validation
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { useAuthStore } from '../store/useAuthStore';
import { AuthService } from '../services/auth/AuthService';
import telconovaLogo from '../assets/telconova-logo.png';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    // Clear auth message
    setAuthMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if account is blocked
    const blockStatus = AuthService.isAccountBlocked(formData.email);
    if (blockStatus.blocked) {
      setAuthMessage({
        type: 'error',
        text: `Cuenta temporalmente bloqueada. Intente de nuevo a las ${AuthService.formatBlockedUntilTime(blockStatus.blockedUntil!)}`,
      });
      return;
    }

    setIsLoading(true);
    setAuthMessage(null);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setAuthMessage({
          type: 'success',
          text: result.message,
        });
        
        // Navigate after brief delay to show success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setAuthMessage({
          type: 'error',
          text: result.message,
        });
      }
    } catch (error) {
      setAuthMessage({
        type: 'error',
        text: 'Error de conexión. Intente nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={telconovaLogo} 
              alt="TelcoNova" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
            <CardDescription className="mt-2">
              Inicie sesión en el Sistema de Asignaciones TelcoNova
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Auth Message */}
            {authMessage && (
              <Alert variant={authMessage.type === 'error' ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authMessage.text}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`input-field pl-10 ${formErrors.email ? 'border-destructive' : ''}`}
                  placeholder="supervisor@example.com"
                  disabled={isLoading}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                />
              </div>
              {formErrors.email && (
                <p id="email-error" className="text-destructive text-sm" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`input-field pl-10 pr-10 ${formErrors.password ? 'border-destructive' : ''}`}
                  placeholder="Ingrese su contraseña"
                  disabled={isLoading}
                  aria-describedby={formErrors.password ? 'password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formErrors.password && (
                <p id="password-error" className="text-destructive text-sm" role="alert">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Credentials Helper */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Credenciales de prueba:</p>
            <div className="text-xs font-mono">
              <p>Email: <span className="text-foreground">supervisor@example.com</span></p>
              <p>Password: <span className="text-foreground">Admin123.</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};