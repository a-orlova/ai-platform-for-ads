import BuildingPlaceholder from '../../assets/images/building.svg'
import AutoPlaceholder from '../../assets/images/shape.svg'
import ElectronicsPlaceholder from '../../assets/images/product.svg'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { ViewMode } from '../../types'

type ItemProps = {
    id: number,
    title: string,
    price: number,
    category: string,
    needsRevision: boolean,
    imageUrl?: string,
    viewMode: ViewMode
}

export default function Item({  id,
                                title, 
                                price, 
                                category, 
                                needsRevision,
                                imageUrl,
                                viewMode }: ItemProps) {

    const navigate = useNavigate()

    const categoryPlaceholder =
        category === 'real_estate'
            ? BuildingPlaceholder
            : category === 'auto'
                ? AutoPlaceholder
                : ElectronicsPlaceholder

    const [currentImageSrc, setCurrentImageSrc] = React.useState(imageUrl || categoryPlaceholder)

    React.useEffect(() => {
        setCurrentImageSrc(imageUrl || categoryPlaceholder)
    }, [imageUrl, categoryPlaceholder])

    const categoryLabel =
        category === 'electronics'
            ? 'Электроника'
            : category === 'real_estate'
                ? 'Недвижимость'
                : category === 'auto'
                    ? 'Авто'
                    : ''


    return (
        <div
            className={`ad-item ${viewMode === 'list' ? 'ad-item-list' : ''}`}
            onClick={() => navigate(`/ads/${id}`)}
        >
            <div className="ad-item-photo">
                <img
                    src={currentImageSrc}
                    alt={title}
                    onError={() => {
                        if (currentImageSrc !== categoryPlaceholder) {
                            setCurrentImageSrc(categoryPlaceholder)
                        }
                    }}
                />
                <p className={`category-txt`}>
                {categoryLabel}
                </p>
            </div>
            <div className="ad-item-info">
                {viewMode === 'list' && <p className="category-list-txt">{categoryLabel}</p>}
                <h3>{title}</h3>
                <p className="price-txt">{price} ₽</p>
                {needsRevision && <p className="need-revision">• Требует доработок</p>}
            </div>
            </div>
    )
}