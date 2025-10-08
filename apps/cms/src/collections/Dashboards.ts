import type { CollectionConfig } from 'payload'

export const Dashboards: CollectionConfig = {
  slug: 'dashboards',
  admin: {
    useAsTitle: 'slug',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'ownerUserId', type: 'text' },
    { name: 'items', type: 'relationship', relationTo: 'dashboard_items', hasMany: true },
  ],
}
