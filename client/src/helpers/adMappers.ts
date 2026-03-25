import type { AdDetails, AdEditFormState, ApiItemDetails } from '../types'

export const getFallbackTitle = (id: number) => `Объявление #${id}`

export const pickImageUrls = (item: ApiItemDetails): string[] => {
  const candidates = [
    ...(Array.isArray(item.imageUrls) ? item.imageUrls : []),
    ...(Array.isArray(item.images) ? item.images : []),
    ...(Array.isArray(item.photoUrls) ? item.photoUrls : []),
    ...(Array.isArray(item.photos) ? item.photos : []),
    item.imageUrl,
    item.image,
    item.photoUrl,
    item.photo,
  ]

  return Array.from(
    new Set(
      candidates.filter((value): value is string => typeof value === 'string' && value.trim().length > 0),
    ),
  )
}

export const getInitialAdEditFormState = (): AdEditFormState => ({
  category: 'electronics',
  title: '',
  price: '',
  description: '',
  autoParams: {
    brand: '',
    model: '',
    yearOfManufacture: '',
    transmission: '',
    mileage: '',
    enginePower: '',
  },
  realEstateParams: {
    type: '',
    address: '',
    area: '',
    floor: '',
  },
  electronicsParams: {
    type: '',
    brand: '',
    model: '',
    condition: '',
    color: '',
  },
})

export const mapAdDetailsToEditForm = (ad: AdDetails): AdEditFormState => {
  const params = ad.params ?? {}

  return {
    category: ad.category,
    title: ad.title ?? '',
    price: ad.price === null ? '' : String(ad.price),
    description: ad.description ?? '',
    autoParams: {
      brand: typeof params.brand === 'string' ? params.brand : '',
      model: typeof params.model === 'string' ? params.model : '',
      yearOfManufacture: typeof params.yearOfManufacture === 'number' ? String(params.yearOfManufacture) : '',
      transmission: params.transmission === 'automatic' || params.transmission === 'manual' ? params.transmission : '',
      mileage: typeof params.mileage === 'number' ? String(params.mileage) : '',
      enginePower: typeof params.enginePower === 'number' ? String(params.enginePower) : '',
    },
    realEstateParams: {
      type: params.type === 'flat' || params.type === 'house' || params.type === 'room' ? params.type : '',
      address: typeof params.address === 'string' ? params.address : '',
      area: typeof params.area === 'number' ? String(params.area) : '',
      floor: typeof params.floor === 'number' ? String(params.floor) : '',
    },
    electronicsParams: {
      type: params.type === 'phone' || params.type === 'laptop' || params.type === 'misc' ? params.type : '',
      brand: typeof params.brand === 'string' ? params.brand : '',
      model: typeof params.model === 'string' ? params.model : '',
      condition: params.condition === 'new' || params.condition === 'used' ? params.condition : '',
      color: typeof params.color === 'string' ? params.color : '',
    },
  }
}

const toTrimmedOrUndefined = (value: string) => {
  const v = value.trim()
  return v.length ? v : undefined
}

const toPositiveIntOrUndefined = (value: string) => {
  const v = value.trim()
  if (!v.length) return undefined
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

const toPositiveNumberOrUndefined = (value: string) => {
  const v = value.trim()
  if (!v.length) return undefined
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export const mapAdEditFormToUpdateIn = (form: AdEditFormState) => {
  const description = toTrimmedOrUndefined(form.description)
  const price = Number(form.price)

  if (form.category === 'auto') {
    return {
      category: form.category,
      title: form.title.trim(),
      description,
      price,
      params: {
        brand: toTrimmedOrUndefined(form.autoParams.brand),
        model: toTrimmedOrUndefined(form.autoParams.model),
        yearOfManufacture: toPositiveIntOrUndefined(form.autoParams.yearOfManufacture),
        transmission:
          form.autoParams.transmission === 'automatic' || form.autoParams.transmission === 'manual'
            ? form.autoParams.transmission
            : undefined,
        mileage: toPositiveNumberOrUndefined(form.autoParams.mileage),
        enginePower: toPositiveIntOrUndefined(form.autoParams.enginePower),
      },
    } as const
  }

  if (form.category === 'real_estate') {
    return {
      category: form.category,
      title: form.title.trim(),
      description,
      price,
      params: {
        type:
          form.realEstateParams.type === 'flat' ||
          form.realEstateParams.type === 'house' ||
          form.realEstateParams.type === 'room'
            ? form.realEstateParams.type
            : undefined,
        address: toTrimmedOrUndefined(form.realEstateParams.address),
        area: toPositiveNumberOrUndefined(form.realEstateParams.area),
        floor: toPositiveIntOrUndefined(form.realEstateParams.floor),
      },
    } as const
  }

  return {
    category: form.category,
    title: form.title.trim(),
    description,
    price,
    params: {
      type:
        form.electronicsParams.type === 'phone' ||
        form.electronicsParams.type === 'laptop' ||
        form.electronicsParams.type === 'misc'
          ? form.electronicsParams.type
          : undefined,
      brand: toTrimmedOrUndefined(form.electronicsParams.brand),
      model: toTrimmedOrUndefined(form.electronicsParams.model),
      condition:
        form.electronicsParams.condition === 'new' || form.electronicsParams.condition === 'used'
          ? form.electronicsParams.condition
          : undefined,
      color: toTrimmedOrUndefined(form.electronicsParams.color),
    },
  } as const
}
