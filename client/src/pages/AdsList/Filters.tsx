import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Switch from '@mui/material/Switch'

type FiltersProps = {
    selectedCategories: Array<'auto' | 'electronics' | 'real_estate'>
    onCategoriesChange: (categories: Array<'auto' | 'electronics' | 'real_estate'>) => void
    onlyNeedsRevision: boolean
    onOnlyNeedsRevisionChange: (value: boolean) => void
    onResetFilters: () => void
}

export default function Filters({
    selectedCategories,
    onCategoriesChange,
    onlyNeedsRevision,
    onOnlyNeedsRevisionChange,
    onResetFilters,
}: FiltersProps) {

    const [isCategoryListOpen, setIsCategoryListOpen] = React.useState(true)

    function toggleCategoryList() {
        setIsCategoryListOpen((prev) => !prev)
    }

    function toggleCategory(category: 'auto' | 'electronics' | 'real_estate') {
        const isSelected = selectedCategories.includes(category)
        if (isSelected) {
            onCategoriesChange(selectedCategories.filter((item) => item !== category))
            return
        }

        onCategoriesChange([...selectedCategories, category])
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
                            <input
                                type="checkbox"
                                name="category-1"
                                id="category-1"
                                checked={selectedCategories.includes('auto')}
                                onChange={() => toggleCategory('auto')}
                            />
                            <label htmlFor="category-1">Авто</label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                name="category-2"
                                id="category-2"
                                checked={selectedCategories.includes('electronics')}
                                onChange={() => toggleCategory('electronics')}
                            />
                            <label htmlFor="category-2">Электроника</label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                name="category-3"
                                id="category-3"
                                checked={selectedCategories.includes('real_estate')}
                                onChange={() => toggleCategory('real_estate')}
                            />
                            <label htmlFor="category-3">Недвижимость</label>
                        </li>
                    </ul>)
                }
                <hr />
                
                <div className="revisions-block">
                    <p>Только требующие доработок</p>
                    <Switch
                        checked={onlyNeedsRevision}
                        onChange={(e) => onOnlyNeedsRevisionChange(e.target.checked)}
                        color="default"
                    />
                </div>
            </div>

            <button className="reset-filters-btn" type="button" onClick={onResetFilters}> Сбросить фильтры </button>
        </aside>
    )
}