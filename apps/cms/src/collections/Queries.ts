import type { CollectionConfig } from 'payload'

export const Queries: CollectionConfig = {
  slug: 'queries',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'queryUid', type: 'text', required: true },
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
  ],
}
