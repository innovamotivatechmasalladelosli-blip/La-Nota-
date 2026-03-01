import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Login() {
  const { user, loading } = useAuth();
  const [adminCode, setAdminCode] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bienvenido a La Nota+</CardTitle>
            <CardDescription>Ya estás autenticado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Hola, <strong>{user.name}</strong>
            </p>
            {user.role === "admin" && (
              <p className="text-sm text-green-600 mb-4">
                ✓ Acceso de administrador
              </p>
            )}
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Ir al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    
    try {
      // Aquí irá la lógica de login de administrador
      // Por ahora, mostrar un mensaje
      toast.info("Función de login de administrador en desarrollo");
    } catch (error) {
      toast.error("Error al iniciar sesión como administrador");
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">La Nota+</CardTitle>
          <CardDescription>Portal de Derechos Humanos - Easy InnovA+</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Usuario</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
            </TabsList>

            {/* Tab de Usuario */}
            <TabsContent value="user" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Inicia sesión con tu cuenta Easy InnovA+ para acceder al portal.
              </p>
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Iniciar sesión con Easy InnovA+
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Autenticación segura y encriptada
              </p>
            </TabsContent>

            {/* Tab de Administrador */}
            <TabsContent value="admin" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Ingresa tu código de administrador para acceder al panel de control.
              </p>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Código de administrador"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="font-mono"
                />
                <Button
                  type="submit"
                  disabled={!adminCode || isAdminLoading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isAdminLoading ? "Verificando..." : "Acceder como Administrador"}
                </Button>
              </form>
              <p className="text-xs text-gray-500 text-center">
                Código de 32 caracteres hexadecimales
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
