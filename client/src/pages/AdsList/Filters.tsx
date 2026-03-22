import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Switch from '@mui/material/Switch'

export default function Filters() {

    const [isCategoryListOpen, setIsCategoryListOpen] = React.useState(true)
    const [requireRevisions, setRequireRevisions] = React.useState(false)

    function toggleCategoryList() {
        setIsCategoryListOpen((prev) => !prev)
    }

    return (
        <aside className="filters-block">
            <div className="all-filters-block">
                <h3>Фильтры</h3>
                <div className="choose-category-block">
                    <p>Категория</p>
                    <button
                        className={`open-categories-btn ${isCategoryListOpen ? "rotated" : ""}`}
                        onClick={toggleCategoryList}
                    >
                        <KeyboardArrowDownIcon />
                    </button>
                </div>
                {isCategoryListOpen && (
                    <ul className={`category-list ${isCategoryListOpen ? "open" : ""}`}>
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
                    </ul>)
                }
                <hr />
                
                <div className="revisions-block">
                    <p>Только требующие доработок</p>
                    <Switch
                        checked={requireRevisions}
                        onChange={(e) => setRequireRevisions(e.target.checked)}
                        color="default"
                    />
                </div>
            </div>

            <button className="reset-filters-btn" type="button"> Сбросить фильтры </button>
        </aside>
    )
}