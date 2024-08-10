
import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save

}

const PAGE_SIZE = 9
var gBugs = utilService.readJsonFile('./data/bug.json')



function query(filterBy) {
    var filteredBugs = gBugs
    // console.log('filterBySSSSSSSSSS:', filterBy)

    // Filtering by text
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    // Filtering by minimum severity
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    // Sorting
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'title') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'severity') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'createdAt') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.createdAt - bug2.createdAt) * filterBy.sortDir)
        }
    }

    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)


    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    gBugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = gBugs.find(currBug => currBug._id === bug._id)
        // const bugToUpdate = cars.find(currCar => currCar._id === car._id)
        if (!bugToUpdate) return Promise.reject('No such bug')
        if (bugToUpdate.creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
            return Promise.reject('Not authorized update this bug')
        }
        console.log('bugToUpdateaaaaa:', bugToUpdate)

        // gBugs.splice(idx, 1, bug)
    } else {
        bug._id = utilService.makeId()
        gBugs.push(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', gBugs)
}
