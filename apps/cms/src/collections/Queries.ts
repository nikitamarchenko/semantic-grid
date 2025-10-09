import type { CollectionConfig } from 'payload'

export const Queries: CollectionConfig = {
  slug: 'queries',
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
    { name: 'queryUid', type: 'text', required: true },
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
  ],
}
