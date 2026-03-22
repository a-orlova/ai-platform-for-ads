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
            <img src="./assets/images/placeholder.jpg" alt="placeholder photo" />
            <h3>{title}</h3>
            <p className="category-txt">{category === 'electronics' ? 'Электроника' : 
                                         category === 'real_estate' ? 'Недвижимость' :
                                         category === 'auto' ? 'Авто' : ''}</p>
            <p className="price-txt">{price} ₽</p>
            {needsRevision && <p className="need-revision">• Требует доработок</p>}
        </div>
    )
}