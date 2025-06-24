import api from './api'

const typesService = {
  getTypes() {
    return api.get('/types/')
  },
}

export default typesService;