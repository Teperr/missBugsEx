
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}



function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(bugs => {

            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)


}
function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function save(bug) {
    console.log('bug:', bug)
    if (bug._id) {
        console.log('bug in put:', bug)
        return axios.put(BASE_URL + '/' + bug._id, bug)
            .then(res => res.data)
    } else {
        console.log('bug in post:', bug)

        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }



    // console.log('bug:', bug)
    // const queryStr = `/save?title=${bug.title}&severity=${bug.severity}&_id=${bug._id || ''}&description=${bug.description || ''}`
    // return axios.get(BASE_URL + queryStr)
    //     .then(res => res.data)
}

function getDefaultFilter() {

    return { title: '', minSeverity: 0, pageIdx: 0, sortBy: '', sortDir: 1, labels: [] }

}

function getEmptyBug(title = '', severity = '', description = '') {
    return { title, severity, description }
}