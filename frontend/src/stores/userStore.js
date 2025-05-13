import { defineStore } from 'pinia'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      const response = await getUsers()
      this.users = response.data
      this.loading = false
    },
    async addUser(user) {
      const response = await createUser(user)
      this.users.push(response.data)
    },
    async editUser(id, newData) {
      const response = await updateUser(id, newData)
      const index = this.users.findIndex(u => u.id === id)
      if (index !== -1) this.users[index] = response.data
    },
    async removeUser(id) {
      await deleteUser(id)
      this.users = this.users.filter(u => u.id !== id)
    }
  },
  getters: {
    usersByState: (state) =>
      state.users.reduce((acc, user) => {
        acc[user.state] = (acc[user.state] || 0) + 1
        return acc
      }, {}),
    usersByOrigin: (state) =>
      state.users.reduce((acc, user) => {
        acc[user.origin] = (acc[user.origin] || 0) + 1
        return acc
      }, {})
  }
})
