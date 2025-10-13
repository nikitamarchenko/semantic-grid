import type { CollectionConfig } from 'payload'

export const DashboardItems: CollectionConfig = {
  slug: 'dashboard_items',
  admin: {
    useAsTitle: 'name',
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
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'query', type: 'relationship', relationTo: 'queries' },
    { name: 'type', type: 'select', options: ['chart', 'table'] },
    { name: 'itemType', type: 'select', options: ['chart', 'table'] },
    { name: 'chartType', type: 'select', options: ['bar', 'line', 'pie'] },
    { name: 'width', type: 'number', min: 1, max: 12, defaultValue: 4 },
    { name: 'height', type: 'number', min: 1, max: 12, defaultValue: 4 },
  ],
}
