import React from 'react'
import type { Category } from '../../../types'
import BuildingPlaceholder from '../../../assets/images/building.svg'
import AutoPlaceholder from '../../../assets/images/shape.svg'
import ElectronicsPlaceholder from '../../../assets/images/product.svg'

type ImageGalleryProps = {
  title: string
  imageUrls: string[]
  category: Category
}

const getCategoryPlaceholder = (category: Category) => {
  if (category === 'real_estate') return BuildingPlaceholder
  if (category === 'auto') return AutoPlaceholder
  return ElectronicsPlaceholder
}

export default function ImageGallery({ title, imageUrls, category }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [brokenImageUrls, setBrokenImageUrls] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    setSelectedImageIndex(0)
    setBrokenImageUrls(new Set())
  }, [imageUrls, category, title])

  const visibleImageUrls = React.useMemo(
    () => imageUrls.filter((url) => !brokenImageUrls.has(url)),
    [imageUrls, brokenImageUrls],
  )

  React.useEffect(() => {
    if (!visibleImageUrls.length || selectedImageIndex >= visibleImageUrls.length) {
      setSelectedImageIndex(0)
    }
  }, [visibleImageUrls, selectedImageIndex])

  const categoryPlaceholder = getCategoryPlaceholder(category)
  const mainImageSrc = visibleImageUrls[selectedImageIndex] ?? categoryPlaceholder

  return (
    <div className="ad-view-gallery">
      <div className="ad-view-main-image">
        <img
          src={mainImageSrc}
          alt={title}
          onError={() => {
            const brokenMainUrl = visibleImageUrls[selectedImageIndex]
            if (!brokenMainUrl) return
            setBrokenImageUrls((prev) => {
              const next = new Set(prev)
              next.add(brokenMainUrl)
              return next
            })
          }}
        />
      </div>

      {visibleImageUrls.length > 1 && (
        <div className="ad-view-thumbnails" role="list">
          {visibleImageUrls.map((imageUrl, index) => (
            <button
              key={`${imageUrl}-${index}`}
              type="button"
              className={`ad-view-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={imageUrl}
                alt={`${title} ${index + 1}`}
                onError={() => {
                  setBrokenImageUrls((prev) => {
                    const next = new Set(prev)
                    next.add(imageUrl)
                    return next
                  })
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
