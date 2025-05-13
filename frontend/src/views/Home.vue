<template>
  <v-container>
    <UserForm />
    <UserCharts />
    <UserTable />
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'

import UserForm from '../components/UserForm.vue'
import UserCharts from '../components/UserCharts.vue'
import UserTable from '../components/UserTable.vue'

const store = useUserStore()

onMounted(() => {
  store.fetchUsers()
})
</script>
