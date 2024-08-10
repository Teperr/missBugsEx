const { Link } = ReactRouterDOM


import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const user = userService.getLoggedinUser()


  function isOwner(bug) {
    if (!user) return false
    if (!bug.creator) return true
    return user.isAdmin || bug.creator._id === user._id
  }


  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />

          <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
          <button><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
          {
            isOwner(bug) &&
            <div>
              <button className='remove-bug' onClick={() => { onRemoveBug(bug._id) }}>x</button>
              {/* <button onClick={() => { onEditBug(bug) }}>Edit</button> */}
              <button><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
            </div>
          }

        </li>
      ))}
    </ul>
  )
}
