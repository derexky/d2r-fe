import client from './client';

export const api = {
  // Items
  getItems: (params?: Record<string, string>) =>
    client.get('/items', { params }).then((r) => r.data.data),
  getItem: (id: number) =>
    client.get(`/items/${id}`).then((r) => r.data.data),

  // Sets
  getSets: () =>
    client.get('/sets').then((r) => r.data.data),
  getSet: (id: number) =>
    client.get(`/sets/${id}`).then((r) => r.data.data),

  // Runewords
  getRunewords: (params?: Record<string, string>) =>
    client.get('/runewords', { params }).then((r) => r.data.data),

  // Builds
  getBuilds: (params?: Record<string, string>) =>
    client.get('/builds', { params }).then((r) => r.data.data),
  getBuild: (id: number) =>
    client.get(`/builds/${id}`).then((r) => r.data.data),

  // IAS
  getIasWeapons: (merc: string) =>
    client.get('/ias/weapons', { params: { merc } }).then((r) => r.data.data),
  getIasTable: (merc: string, weapon?: string) =>
    client.get('/ias/table', { params: { merc, weapon } }).then((r) => r.data.data),
  calculateIas: (merc: string, weapon: string, ias: number) =>
    client.get('/ias/calculate', { params: { merc, weapon, ias } }).then((r) => r.data.data),

  // Announcements
  getAnnouncements: () =>
    client.get('/announcements').then((r) => r.data.data),
};
