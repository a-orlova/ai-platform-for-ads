import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SearchIcon from '@mui/icons-material/Search'
import GridViewIcon from '@mui/icons-material/GridView'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import React from 'react'

type HeaderProps = {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  totalItems: number
}

export default function Header({ viewMode, onViewModeChange, totalItems }: HeaderProps) {

  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
      if (savedTheme) {
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
    }, [])

  function toggleTheme (){
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
  }

  return(
    <header>
      <div className="title-block">
        <div className="ads-title">
          <h1>Мои объявления</h1>
          <h2><span>{totalItems}</span> объявления</h2>
        </div>
        <button className="change-theme-btn" onClick={toggleTheme}>
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
      </div>

      <div className="functional-block">
        <div className="search-field-element">
            <input type="search" className="search-icon" placeholder="Найти объявление..."/>
            < SearchIcon />
        </div>
        <div className="change-layout-btn">
          <button
            type="button"
            className={`layout-btn grid-template-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
          >
            <GridViewIcon />
          </button>
          <button
            type="button"
            className={`layout-btn list-template-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            <FormatListBulletedIcon />
          </button>
        </div>
        <div className="select-wrapper">
          <select className="sort-ads">
            <option value="">По новизне (сначала новые)</option>
            <option value="">По новизне (сначала старые)</option>
            <option value="">По цене (сначала новые)</option>
            <option value="">По цене (сначала старые)</option>
            <option value="">По названию (А-Я)</option>
            <option value="">По названию (Я-А)</option>
          </select>

          <KeyboardArrowDownIcon className="select-icon" />
        </div>
      </div>
    </header>
  )
}