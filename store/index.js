export const state = () => ({
  counter: 0,
  db: [],
  filter: '',
  currentView: '',
  error: ''
})

export const mutations = {
  increment (state) {
    state.counter++
  },
  set_db (state, db) {
    state.db = db
  },
  updateFilter (state, strToFilter) {
    state.filter = strToFilter
  },
  getCurrentView (state, value) {
    state.currentView = value
  },
  writeError (state, error) {
    state.error = error
  }
}

export const actions = {
  async nuxtServerInit ({ commit }) {
    await fetch('http://afs.alt-point.com:8080/notes')
      .then((response) => {
        if (!response.ok) { throw new Error('Response was not ok') }
        return response.json()
      })
      .then((res) => {
        // console.log('result', res)
        commit('set_db', res)
      })
      .catch((error) => {
        console.error('Error:', error)
        commit('writeError', error)
      })
  },
  async addNote ({ dispatch }, data) {
    await fetch('http://afs.alt-point.com:8080/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) { throw new Error('Add error') }
      })
      .catch((error) => { console.error('Error:', error) })
    dispatch('nuxtServerInit')
  },
  async deleteNote ({ dispatch }, id) {
    await fetch('http://afs.alt-point.com:8080/notes/' + id, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) { throw new Error('Delete error') }
      })
      .catch((error) => { console.error('Error:', error) })

    dispatch('nuxtServerInit')
  },
  async editNote ({ dispatch }, data) {
    await fetch('http://afs.alt-point.com:8080/notes/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) { throw new Error('Edit error') }
      })
      .catch((error) => { console.error('Error:', error) })

    dispatch('nuxtServerInit')
  },
  async getNote ({ commit }, id) {
    const body = await fetch('http://afs.alt-point.com:8080/notes/' + id)
      .then((response) => {
        if (!response.ok) { throw new Error('Edit error') }
        return response.json()
      })
      .catch((error) => { console.error('Error:', error) })
    commit('getCurrentView', body)
  },
  filterNotes ({ commit }, strToFilter) {
    // debugger
    commit('updateFilter', strToFilter)
  }
}

export const getters = {
  get_note_byID: (state, getters) => (id) => {
    const array = getters.getAllNotes
    console.log(id)
    return array.find(el => el.id === id)
  },
  filter: s => s.filter,
  getAllNotes (state, getters) {
    return state.db.filter(({ title, text }) => getters.filter ? (() => {
      // console.log(title, text, getters.filter, title.startsWith(getters.filter))
      return title.toLowerCase().startsWith(getters.filter.toLowerCase()) || text.toLowerCase().startsWith(getters.filter.toLowerCase())
    })() : true)
      .sort((a, b) => b.date_create - a.date_create)
  },
  getNodeForView: (state) => {
    return state.currentView
  },
  getErrorMessage (state) {
    return state.error
  }
}
