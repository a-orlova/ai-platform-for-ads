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
            <h3>{title}</h3>
            <p>{category}</p>
            <p>{price} ₽</p>
            {needsRevision && <p className="need-revision">Требует доработок</p>}
        </div>
    )
}