import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  createAdminCode, 
  getAdminCodeByCode, 
  getAdminCodesByUserId, 
  createQuickLoginCode, 
  getQuickLoginCodeByCode, 
  getUserById, 
  createNotification, 
  getNotificationsByUserId, 
  createAuthor, 
  getAllAuthors, 
  createPublication, 
  getPublishedPublications, 
  getFeaturedPublications, 
  getPublicationById, 
  updatePublication 
} from "./db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Generar códigos de inicio rápido
    generateQuickLoginCode: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      const code = crypto.randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días
      await createQuickLoginCode(ctx.user.id, code, expiresAt);
      return { code, expiresAt };
    }),
  }),

  // Admin procedures
  admin: router({
    // Generar códigos de administrador (solo para admin)
    generateAdminCodes: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const codes = [];
      for (let i = 0; i < 10; i++) {
        const code = crypto.randomBytes(16).toString("hex");
        await createAdminCode(code, ctx.user.id);
        codes.push(code);
      }
      return { codes };
    }),

    // Obtener códigos de administrador
    getAdminCodes: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getAdminCodesByUserId(ctx.user.id);
    }),

    // Obtener notificaciones
    getNotifications: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getNotificationsByUserId(ctx.user.id);
    }),
  }),

  // Publications
  publications: router({
    // Obtener todas las publicaciones publicadas
    getPublished: publicProcedure.query(async () => {
      return await getPublishedPublications();
    }),

    // Obtener publicaciones destacadas
    getFeatured: publicProcedure.query(async () => {
      return await getFeaturedPublications();
    }),

    // Obtener una publicación por ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getPublicationById(input.id);
      }),

    // Crear publicación (solo admin)
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        authorIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await createPublication({
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          authorIds: JSON.stringify(input.authorIds),
          createdBy: ctx.user.id,
          status: "published",
        });
        // Notificar a otros admins
        await createNotification({
          userId: ctx.user.id,
          type: "new_publication",
          title: "Nueva publicación",
          message: `Se ha creado la publicación: ${input.title}`,
        });
        return result;
      }),

    // Destacar publicación (solo admin)
    feature: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await updatePublication(input.id, { featured: true });
        return { success: true };
      }),

    // Eliminar publicación (solo admin)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await updatePublication(input.id, { status: "archived" });
        return { success: true };
      }),
  }),

  // Authors
  authors: router({
    // Obtener todos los autores
    getAll: publicProcedure.query(async () => {
      return await getAllAuthors();
    }),

    // Crear autor (solo admin)
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await createAuthor(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
