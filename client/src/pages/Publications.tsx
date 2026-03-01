import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Publications() {
  const [, setLocation] = useLocation();
  const { data: publications, isLoading } = trpc.publications.getPublished.useQuery();
  const { data: authors } = trpc.authors.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getAuthorNames = (authorIds: string) => {
    try {
      const ids = JSON.parse(authorIds) as number[];
      return authors
        ?.filter((a) => ids.includes(a.id))
        .map((a) => a.name)
        .join(", ");
    } catch {
      return "Desconocido";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Publicaciones</h1>
          <p className="text-gray-600">Artículos sobre Derechos Humanos y Cívica</p>
        </div>

        {publications && publications.length > 0 ? (
          <div className="space-y-4">
            {publications.map((pub) => (
              <Card key={pub.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => setLocation(`/publication/${pub.id}`)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{pub.title}</CardTitle>
                      <CardDescription>
                        Por {getAuthorNames(pub.authorIds)} • {new Date(pub.createdAt).toLocaleDateString("es-ES")}
                      </CardDescription>
                    </div>
                    {pub.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-medium whitespace-nowrap ml-4">
                        ⭐ Destacado
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent onClick={() => setLocation(`/publication/${pub.id}`)}>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {pub.excerpt || pub.content.substring(0, 200)}...
                  </p>
                  <Button variant="outline">Leer más</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">No hay publicaciones disponibles</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
