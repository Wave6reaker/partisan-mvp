import type { CollectionConfig } from 'payload';

export const Fabrics: CollectionConfig = {
  slug: 'fabrics',
  labels: {
    singular: 'Ткань',
    plural: 'Ткани',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название ткани',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория (цепная группа)',
      options: [
        { label: 'Категория 1', value: 'cat1' },
        { label: 'Категория 2', value: 'cat2' },
        { label: 'Категория 3', value: 'cat3' },
        { label: 'Категория 4', value: 'cat4' },
        { label: 'Категория 5', value: 'cat5' },
        { label: 'Категория 6', value: 'cat6' },
      ],
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      label: 'Цвет (HEX код)',
      admin: {
        placeholder: '#FFFFFF',
      },
    },
    {
      name: 'swatch',
      type: 'upload',
      relationTo: 'media',
      label: 'Свотч (картинка текстуры)',
    },
    {
      name: 'priceAdder',
      type: 'number',
      label: 'Добавочная стоимость (₽)',
      defaultValue: 0,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'composition',
      type: 'text',
      label: 'Состав',
    },
    {
      name: 'origin',
      type: 'text',
      label: 'Страна происхождения',
    },
  ],
};
