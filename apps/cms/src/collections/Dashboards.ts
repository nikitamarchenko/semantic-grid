import type { CollectionConfig } from 'payload'

export const Dashboards: CollectionConfig = {
  slug: 'dashboards',
  admin: {
    useAsTitle: 'slug',
  },
  access: {
    read: () => true,
    create: ({ req: { user, headers } }) => {
      return Boolean(user) || Boolean(headers.get('x-api-key') === process.env.PAYLOAD_API_KEY)
    },
    update: ({ req: { user, headers } }) => {
      return Boolean(user) || Boolean(headers.get('x-api-key') === process.env.PAYLOAD_API_KEY)
    },
  },
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'ownerUserId', type: 'text' },
    { name: 'items', type: 'relationship', relationTo: 'dashboard_items', hasMany: true },
  ],
}
