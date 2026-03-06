// Mock database functions to avoid connection errors
export async function getDb() {
  return null;
}

export async function upsertUser(user: any): Promise<void> {
  console.log("[Mock DB] Upsert user:", user.openId);
}

export async function getUserByOpenId(openId: string) {
  return undefined;
}

export async function getUserById(id: number) {
  return undefined;
}

// Publications
export async function createPublication(data: any) {
  return [];
}

export async function getPublishedPublications() {
  return [];
}

export async function getFeaturedPublications() {
  return [];
}

export async function getPublicationById(id: number) {
  return undefined;
}

export async function updatePublication(id: number, data: any) {
  return [];
}

// Authors
export async function createAuthor(data: any) {
  return [];
}

export async function getAuthorById(id: number) {
  return undefined;
}

export async function getAllAuthors() {
  return [];
}

// Quick Login Codes
export async function createQuickLoginCode(userId: number, code: string, expiresAt: Date) {
  return [];
}

export async function getQuickLoginCodeByCode(code: string) {
  return undefined;
}

// Admin Codes
export async function createAdminCode(code: string, userId: number) {
  return [];
}

export async function getAdminCodeByCode(code: string) {
  return undefined;
}

export async function getAdminCodesByUserId(userId: number) {
  return [];
}

// Notifications
export async function createNotification(data: any) {
  return [];
}

export async function getNotificationsByUserId(userId: number) {
  return [];
}

export async function markNotificationAsRead(id: number) {
  return [];
}
