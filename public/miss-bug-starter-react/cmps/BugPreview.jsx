

export function BugPreview({bug}) {
    // console.log('bug:', bug)

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>description: <span>{bug.description}</span></p>
        
    </article>
}