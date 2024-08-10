const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])


    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked ? -1 : 1
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))

    }

    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     console.log('filterByToEdit:', filterByToEdit)
    //     onSetFilterBy(filterByToEdit)
    // }


    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }

    const { title, minSeverity, sortBy, sortDir, labels } = filterByToEdit
    return (<section className="bug-filter-container">


        <fieldset className="bug-filter">
            <legend>Filter & Sorting</legend>

            <label htmlFor="title">Title: </label>
            <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

            <label htmlFor="minSeverity">Min Severity: </label>
            <input value={minSeverity} onChange={handleChange} type="number" placeholder="minSeverity" id="severitminSeverityy" name="minSeverity" />

            <label htmlFor="sortBy">Sort by:</label>
            <select name="sortBy" value={sortBy} onChange={handleChange}>
                <option value="">Select Sorting</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>

            <label htmlFor="sortDir">Sort descending:</label>
            <input
                type="checkbox"
                name="sortDir"
                id="sortDir"
                checked={sortDir === -1}
                onChange={handleChange}
            />

            <button onClick={() => onGetPage(-1)}>-</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => onGetPage(1)}>+</button>

        </fieldset>
    </section>
    )
}