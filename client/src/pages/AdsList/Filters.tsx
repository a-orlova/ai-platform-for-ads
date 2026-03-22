export default function Filters() {
    return (
        <aside className="filters-block">
            <h3>Фильтры</h3>
            <p>Категория</p>
            <ul className="category-choice">
                <li>
                    <input type="checkbox" name="category-1" id="category-1"/>
                    <label htmlFor="category-1">Авто</label>
                </li>
                <li>
                    <input type="checkbox" name="category-2" id="category-2"/>
                    <label htmlFor="category-2">Электроника</label>
                </li>
                <li>
                    <input type="checkbox" name="category-3" id="category-3"/>
                    <label htmlFor="category-3">Недвижимость</label>
                </li>
            </ul>

            <input type="checkbox" id="require-revisions"/>
            <label htmlFor="require-revisions">Только требующие недоработок</label>

            <button className="reset-filters-btn" type="button">
                Сбросить фильтры
            </button>
        </aside>
    )
}