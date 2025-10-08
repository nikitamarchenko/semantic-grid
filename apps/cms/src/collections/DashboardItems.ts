import type { CollectionConfig } from 'payload'

export const DashboardItems: CollectionConfig = {
  slug: 'dashboard_items',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'query', type: 'relationship', relationTo: 'queries' },
    { name: 'type', type: 'select', options: ['chart', 'table'] },
    { name: 'itemType', type: 'select', options: ['chart', 'table'] },
    { name: 'chartType', type: 'select', options: ['bar', 'line', 'pie'] },
    { name: 'width', type: 'number', min: 1, max: 12, defaultValue: 4 },
  ],
}
