import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'phone', 'product', 'size', 'fabric', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      label: 'Имя клиента',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Товар',
    },
    {
      name: 'productName',
      type: 'text',
      label: 'Название товара (snapshot)',
      admin: { readOnly: true },
    },
    {
      name: 'size',
      type: 'text',
      label: 'Размер',
    },
    {
      name: 'fabric',
      type: 'text',
      label: 'Ткань',
    },
    {
      name: 'fabricCategory',
      type: 'text',
      label: 'Категория ткани',
    },
    {
      name: 'filling',
      type: 'text',
      label: 'Наполнение',
    },
    {
      name: 'orientation',
      type: 'text',
      label: 'Угол',
    },
    {
      name: 'totalPrice',
      type: 'number',
      label: 'Итоговая цена (₽)',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В обработке', value: 'processing' },
        { label: 'Подтверждена', value: 'confirmed' },
        { label: 'Выполнена', value: 'done' },
        { label: 'Отменена', value: 'cancelled' },
      ],
    },
  ],
  timestamps: true,
};
