export default function Header() {
  return(
    <header>
      <div className="title-block">
        <div className="ads-title">
          <h1>Мои объявления</h1>
          <h2><span>42</span> объявления</h2>
        </div>
        <button className="change-theme-btn">light/dark</button>
      </div>

      <div className="functional-block">
        <div className="search-field-element">
            <input type="search" placeholder="Найти объявление..."/>
            {/* иконка поиска */}
        </div>
        <div className="change-layout-btn">
          <button className="grid-template">grid</button>
          <button className="list-template">list</button>
        </div>
        <select name="" id="" className="sort-ads">
            <option value="">По новизне (сначала новые)</option>
            <option value="">По новизне (сначала старые)</option>
            <option value="">По цене (сначала новые)</option>
            <option value="">По цене (сначала старые)</option>
        </select>
      </div>
    </header>
  )
}