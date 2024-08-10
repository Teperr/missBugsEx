import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugEdit } from '../pages/BugEdit.jsx'

const { Link } = ReactRouterDOM

const { useState, useEffect } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())


  useEffect(() => {
    // loadBugs()

    bugService.query(filterBy)
      .then(bugs => setBugs(bugs))
      .catch(err => console.log('err:', err))
    console.log('filterBy:', filterBy)
  }, [filterBy])

  // function loadBugs() {
  //   bugService.query().then(setBugs)
  // }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  // function onAddBug() {
  //   const bug = {
  //     title: prompt('Bug title?'),
  //     severity: +prompt('Bug severity?'),
  //     description: prompt('Bug description?'),
  //   }
  //   bugService
  //     .save(bug)
  //     .then((savedBug) => {
  //       console.log('Added Bug', savedBug)
  //       setBugs(prevBugs => [...prevBugs, savedBug])
  //       showSuccessMsg('Bug added')
  //     })
  //     .catch((err) => {
  //       console.log('Error from onAddBug ->', err)
  //       showErrorMsg('Cannot add bug')
  //     })
  // }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log('Updated Bug:', savedBug)
        setBugs(prevBugs => prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        ))
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        {/* <button onClick={onAddBug}>Add Bug ⛐</button> */}
        {/* <Link to="/bug/edit" >Add Bug</Link> */}
        <button><Link to={`/bug/edit`}>Add Bug</Link></button>
        {/* <Link to={{ pathname: "/bug/edit", state: { setBugs } }}>Add Bug</Link> */}
        {/* <BugEdit setBugs={setBugs} /> */}
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
