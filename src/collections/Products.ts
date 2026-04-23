import type { CollectionConfig, FieldHook } from 'payload';

const formatSlug = (val: string): string => {
  const ru: { [key: string]: string } = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
    я: 'ya',
  };
  let str = val.toLowerCase();
  str = str.replace(/[а-яё]/g, (match) => ru[match] || match);
  return str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
};

const generateSlug: FieldHook = ({ data, operation, originalDoc }) => {
  if (typeof data?.name === 'string') {
    return formatSlug(data.name);
  }
  if (operation === 'update' && typeof originalDoc?.name === 'string') {
    return formatSlug(originalDoc.name);
  }
  return data?.slug || '';
};

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товары',
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
      label: 'Название',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'ЧПУ (Слаг)',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [generateSlug],
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      defaultValue: 'sofas',
      options: [
        { label: 'Диваны', value: 'sofas' },
        { label: 'Кровати', value: 'beds' },
        { label: 'Столы', value: 'tables' },
        { label: 'Стулья', value: 'chairs' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Полное описание',
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Размеры',
      labels: {
        singular: 'Размер',
        plural: 'Размеры',
      },
      fields: [
        { name: 'label', type: 'text', label: 'Название (Например: Двухместный)' },
        { name: 'dimensions', type: 'text', label: 'Габариты (Например: 200x90x80)' },
        { name: 'basePrice', type: 'number', label: 'Базовая цена (₽)' },
      ],
    },
    {
      name: 'renders',
      type: 'array',
      label: 'Рендеры для конфигуратора',
      fields: [
        { name: 'fabric', type: 'relationship', relationTo: 'fabrics', label: 'Ткань' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение для этой ткани' },
      ],
    },
    {
      name: 'defaultImages',
      type: 'array',
      label: 'Галерея по умолчанию',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
      ],
    },
    {
      name: 'materialSeat',
      type: 'text',
      label: 'Материал сиденья',
      defaultValue: 'Высокоэластичный ППУ, независимый пружинный блок',
    },
    {
      name: 'materialFrame',
      type: 'text',
      label: 'Материал каркаса',
      defaultValue: 'Березовая фанера, массив хвойных пород',
    },
    {
      name: 'materialLegs',
      type: 'text',
      label: 'Материал ножек',
      defaultValue: 'Металл / Массив дуба',
    },
    {
      name: 'warranty',
      type: 'text',
      label: 'Гарантия',
      defaultValue: '2 года',
    },
    {
      name: 'leadTime',
      type: 'text',
      label: 'Срок изготовления',
      defaultValue: 'до 8 недель',
    },
    {
      name: 'hasOrientation',
      type: 'checkbox',
      label: 'Есть выбор угла (левый/правый)',
      defaultValue: false,
      admin: {
        description: 'Включи если товар бывает с левым и правым углом',
      },
    },
    {
      name: 'inShowroom',
      type: 'checkbox',
      label: 'В шоуруме',
      defaultValue: false,
    },
    {
      name: 'availableFabrics',
      type: 'relationship',
      relationTo: 'fabrics',
      hasMany: true,
      label: 'Доступные ткани',
    },
  ],
};
