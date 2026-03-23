import Placeholder from '../../assets/images/placeholder.jpg'
import { useNavigate } from 'react-router-dom'

type ItemProps = {
    id: number,
    title: string,
    price: number,
    category: string,
    needsRevision: boolean
}

export default function Item({  id,
                                title, 
                                price, 
                                category, 
                                needsRevision }: ItemProps) {

    const navigate = useNavigate()


    return (
        <div className="ad-item" onClick={() => navigate(`/ads/${id}`)}>
            <div className="ad-item-photo">
                <img src={Placeholder} alt="placeholder photo" />
                <p className={`category-txt`}>
                {category === 'electronics' ? 'Электроника' : 
                category === 'real_estate' ? 'Недвижимость' :
                category === 'auto' ? 'Авто' : ''}
                </p>
            </div>
            <div className="ad-item-info">
                <h3>{title}</h3>
                <p className="price-txt">{price} ₽</p>
                {needsRevision && <p className="need-revision">• Требует доработок</p>}
            </div>
            </div>
    )
}