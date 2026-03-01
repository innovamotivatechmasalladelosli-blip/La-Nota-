import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Streamdown } from "streamdown";

export default function PublicationDetail() {
  const [match, params] = useRoute("/publication/:id");
  const [, setLocation] = useLocation();
  const publicationId = params?.id ? parseInt(params.id) : null;

  const { data: publication, isLoading } = trpc.publications.getById.useQuery(
    { id: publicationId! },
    { enabled: !!publicationId }
  );
  const { data: authors } = trpc.authors.getAll.useQuery();

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Publicación no encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/publications")} className="w-full">
              Volver a publicaciones
            </Button>
          </CardContent>
        </Card>
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
        <Button variant="outline" onClick={() => setLocation("/publications")} className="mb-6">
          ← Volver a publicaciones
        </Button>

        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8 border-b pb-8">
            <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>
            <div className="flex flex-col gap-2 text-gray-600">
              <p>
                <strong>Por:</strong> {getAuthorNames(publication.authorIds)}
              </p>
              <p>
                <strong>Publicado:</strong> {new Date(publication.createdAt).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {publication.featured && (
                <p className="text-yellow-600">
                  <strong>⭐ Esta publicación está destacada</strong>
                </p>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <Streamdown>{publication.content}</Streamdown>
          </div>

          <footer className="mt-12 pt-8 border-t">
            <Button onClick={() => setLocation("/publications")} variant="outline" className="w-full">
              Ver más publicaciones
            </Button>
          </footer>
        </article>
      </div>
    </div>
  );
}
