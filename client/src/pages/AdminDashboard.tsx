import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TRPCError } from "@trpc/server";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [showNewPublication, setShowNewPublication] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    authorIds: [] as number[],
  });

  // Queries
  const { data: notifications } = trpc.admin.getNotifications.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: adminCodes } = trpc.admin.getAdminCodes.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: publications } = trpc.publications.getPublished.useQuery();
  const { data: authors } = trpc.authors.getAll.useQuery();

  // Mutations
  const createPublicationMutation = trpc.publications.create.useMutation({
    onSuccess: () => {
      toast.success("Publicación creada exitosamente");
      setFormData({ title: "", content: "", excerpt: "", authorIds: [] });
      setShowNewPublication(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear publicación");
    },
  });

  const deletePublicationMutation = trpc.publications.delete.useMutation({
    onSuccess: () => {
      toast.success("Publicación eliminada");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar publicación");
    },
  });

  const featurePublicationMutation = trpc.publications.feature.useMutation({
    onSuccess: () => {
      toast.success("Publicación destacada");
    },
    onError: (error) => {
      toast.error(error.message || "Error al destacar publicación");
    },
  });

  const generateAdminCodesMutation = trpc.admin.generateAdminCodes.useMutation({
    onSuccess: (data) => {
      toast.success("10 códigos de administrador generados");
      console.log("Códigos:", data.codes);
    },
    onError: (error) => {
      toast.error(error.message || "Error al generar códigos");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso denegado</CardTitle>
            <CardDescription>No tienes permisos para acceder a esta página</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Título y contenido son requeridos");
      return;
    }
    await createPublicationMutation.mutateAsync(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Bienvenido, {user.name}</p>
        </div>

        <Tabs defaultValue="publications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="publications">Publicaciones</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="codes">Códigos Admin</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab de Publicaciones */}
          <TabsContent value="publications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Publicaciones</h2>
              <Button onClick={() => setShowNewPublication(!showNewPublication)}>
                {showNewPublication ? "Cancelar" : "Nueva Publicación"}
              </Button>
            </div>

            {showNewPublication && (
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Publicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePublication} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Título</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Título de la publicación"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contenido</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Contenido de la publicación"
                        rows={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Resumen (opcional)</label>
                      <Input
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Resumen breve"
                      />
                    </div>
                    <Button type="submit" disabled={createPublicationMutation.isPending}>
                      {createPublicationMutation.isPending ? "Creando..." : "Crear Publicación"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {publications?.map((pub) => (
                <Card key={pub.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pub.title}</CardTitle>
                        <CardDescription>
                          Creado el {new Date(pub.createdAt).toLocaleDateString("es-ES")}
                        </CardDescription>
                      </div>
                      {pub.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-medium">
                          Destacado
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{pub.excerpt || pub.content}</p>
                    <div className="flex gap-2">
                      {!pub.featured && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => featurePublicationMutation.mutateAsync({ id: pub.id })}
                        >
                          Destacar
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePublicationMutation.mutateAsync({ id: pub.id })}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab de Notificaciones */}
          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-2xl font-bold">Notificaciones</h2>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <Card key={notif.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{notif.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString("es-ES")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay notificaciones</p>
            )}
          </TabsContent>

          {/* Tab de Códigos de Administrador */}
          <TabsContent value="codes" className="space-y-4">
            <h2 className="text-2xl font-bold">Códigos de Administrador</h2>
            <Button onClick={() => generateAdminCodesMutation.mutate()}>
              Generar 10 Códigos Nuevos
            </Button>
            {adminCodes && adminCodes.length > 0 && (
              <div className="space-y-2">
                {adminCodes.map((code) => (
                  <Card key={code.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <code className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                          {code.code}
                        </code>
                        <span className={`text-xs font-medium ${code.isActive ? "text-green-600" : "text-gray-400"}`}>
                          {code.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab de Configuración */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-bold">Configuración</h2>
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> Administrador</p>
                <p><strong>Miembro desde:</strong> {new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
