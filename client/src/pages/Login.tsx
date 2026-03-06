import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">La Nota+</CardTitle>
          <CardDescription>Iniciar Sesión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center mb-6">
            Accede a tu cuenta para continuar
          </p>
          <Button 
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
          <Button 
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full"
          >
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
