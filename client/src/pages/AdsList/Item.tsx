import Placeholder from '../../assets/images/placeholder.jpg';

type ItemProps = {
    title: string,
    price: number,
    category: string,
    needsRevision: boolean
}

export default function Item({  title, 
                                price, 
                                category, 
                                needsRevision }: ItemProps) {

    return (
        <div className="ad-item">
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