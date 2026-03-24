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
