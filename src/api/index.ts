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

  // Base items
  getBaseItems: (params?: Record<string, string>) =>
    client.get('/base-items', { params }).then((r) => r.data.data),

  // OCR
  ocrImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return client.post<{ text: string }>('/ocr', form).then((r) => r.data.text);
  },

  // Trades
  getTrades: (params?: Record<string, string>) =>
    client.get('/trades', { params }).then((r) => r.data.data),
  createTrade: (body: {
    item_name: string;
    item_stats_raw?: string;
    price: string;
    contact: string;
    category?: string;
  }) => client.post('/trades', body).then((r) => r.data.data),

  // Price stats
  priceTrackedItems: (): Promise<string[]> =>
    client.get('/prices/items').then((r) => r.data),
  priceLatest: (item: string, ladder: boolean, mode: 'sc' | 'hc') =>
    client.get('/prices/latest', { params: { item, ladder, mode } }).then((r) => r.data),

};
