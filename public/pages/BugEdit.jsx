import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
// import { useLocation } from '../lib/react-router-dom.js';

const { useState, useEffect } = React
const { useNavigate, useParams} = ReactRouterDOM





export function BugEdit() {
    // const location = useLocation();
    // const setBugs = location.state?.setBugs;

    
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
            console.log('params.bugId:', params.bugId)
    }, [])


    function loadBug() {
        bugService.getById(params.bugId)
            .then(setBugToEdit)
            .catch(err => showErrorMsg('Cannot load bug'))
    }


    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setBugToEdit(prevBugToEdit => ({ ...prevBugToEdit, [field]: value }))
    }



    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit)
            .then(() => navigate('/bug'))
            .catch(err => {
                showErrorMsg('Cannot save bug')
                navigate('/')
            })
        console.log('bugToEdit:', bugToEdit)

        // bugService
        //     .save(bugToEdit)
        //     .then((savedBug) => {
        //         console.log('Added Bug', savedBug)
        //         setBugs(prevBugs => [...prevBugs, savedBug])
        //         showSuccessMsg('Bug added')
        //     })
        //     .catch((err) => {
        //         console.log('Error from onAddBug ->', err)
        //         showErrorMsg('Cannot add bug')
        //     })

    }

    const { title, severity, description } = bugToEdit

    return (
        <section className="bug-edit">
            <form onSubmit={onSaveBug} >
                <label htmlFor="title">Title:</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />

                <label htmlFor="severity">Severity:</label>
                <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />

                <label htmlFor="description">Description:</label>
                <input onChange={handleChange} value={description} type="text" name="description" id="description" />

                <button>Save</button>
            </form>
        </section>
    )
}