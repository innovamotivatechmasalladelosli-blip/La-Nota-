import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-900">La Nota+</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Button onClick={() => setLocation("/admin")} variant="outline">
                    Panel Admin
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setLocation("/login")}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => (window.location.href = getLoginUrl())}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Semanario de Cívica y Ética
          </span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-4 text-gray-900">
            DERECHOS HUMANOS
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un espacio dedicado a la educación, reflexión y promoción de los derechos fundamentales de todas las personas.
          </p>
        </div>

        {/* Intro Section */}
        <Card className="mb-12 border-l-4 border-l-red-900">
          <CardHeader>
            <CardTitle className="text-2xl">¿Qué son los Derechos Humanos?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Los derechos humanos son el conjunto de prerrogativas sustentadas en la dignidad humana, cuya realización efectiva resulta indispensable para el desarrollo integral de la persona. Son facultades que todos tenemos por el simple hecho de existir, sin importar nuestra nacionalidad, sexo, origen étnico, color, religión, lengua, o cualquier otra condición.
            </p>
            <p className="text-gray-700 leading-relaxed">
              A diferencia de otras leyes, los derechos humanos se caracterizan por ser:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-l-red-900">
                <p className="font-bold text-gray-900">Universales</p>
                <p className="text-sm text-gray-600">Para todos, en todo lugar.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-l-red-900">
                <p className="font-bold text-gray-900">Inalienables</p>
                <p className="text-sm text-gray-600">No se pueden vender, quitar ni ceder.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-l-red-900">
                <p className="font-bold text-gray-900">Indivisibles</p>
                <p className="text-sm text-gray-600">Todos tienen la misma importancia.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-l-red-900">
                <p className="font-bold text-gray-900">Interdependientes</p>
                <p className="text-sm text-gray-600">El avance de uno facilita el avance de los demás.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        <div className="mb-12 aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/6CdyiPIfLd0?autoplay=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Derechos Destacados */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-6">Derechos Fundamentales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Derecho a la Vida",
                description: "Es el derecho fundamental que permite el goce de todos los demás.",
              },
              {
                title: "Derecho a la Educación",
                description: "Fundamental para el desarrollo de las capacidades humanas.",
              },
              {
                title: "Libertad de Expresión",
                description: "El derecho a buscar, recibir y difundir información e ideas.",
              },
              {
                title: "Derecho a la Salud",
                description: "Acceso a servicios de salud de calidad para todos.",
              },
              {
                title: "Derecho al Trabajo",
                description: "Oportunidad de trabajar en condiciones justas y equitativas.",
              },
              {
                title: "Derecho a la Justicia",
                description: "Acceso a un sistema judicial imparcial y transparente.",
              },
            ].map((derecho, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{derecho.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{derecho.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-red-900 text-white rounded-lg p-8 text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Explora Nuestro Contenido</h3>
          <p className="text-red-100 mb-6">
            Descubre artículos, análisis y reflexiones sobre derechos humanos y cívica.
          </p>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Educación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Recursos educativos para aprender sobre derechos humanos y cívica.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Únete a una comunidad comprometida con la defensa de los derechos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Participa en iniciativas para promover y proteger los derechos humanos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            La Nota+ • Portal de Derechos Humanos • Edición 2026
          </p>
          <p className="text-xs mt-2">
            Powered by Easy InnovA+ | Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
