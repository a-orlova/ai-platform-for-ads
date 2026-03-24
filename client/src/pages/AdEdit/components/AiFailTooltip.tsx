export default function AiFailTooltip() {
    return (
        <div className="ai-fail-tooltip">
            <h5>Произошла ошибка при запросе к AI</h5>
            <p>Попробуйте повторить запрос или закройте уведомление</p>
            <button type="button" className="ai-fail-tooltip-close-btn">Закрыть</button>
        </div>
    )
}