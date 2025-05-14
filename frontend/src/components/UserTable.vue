<template>
  <v-card class="mt-6">
    <v-card-title class="d-flex justify-space-between align-center">
      Usuários Cadastrados
      <v-text-field
        v-model="searchTerm"
        label="Buscar por nome, e-mail ou estado"
        clearable
        hide-details
        density="compact"
        style="max-width: 300px;"
      />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :items-per-page="5"
      class="elevation-1"
    >
      <!-- Cabeçalho manual -->
      <template #body.prepend>
        <tr class="text-subtitle-2 font-weight-bold">
          <td>ID</td>
          <td>Nome</td>
          <td>E-mail</td>
          <td>Origem</td>
          <td>Endereço</td>
          <td>Estado</td>
          <td>Ações</td>
        </tr>
      </template>

      <template #item.index="{ item }">
        {{ item.id }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center gap-2">
          <v-btn icon density="compact" @click="openEditDialog(item)">
            <v-icon size="18" class="text-white">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon density="compact" @click="confirmDelete(item)">
            <v-icon size="18" class="text-white">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-alert v-if="!filteredUsers.length && !store.loading" type="info" class="ma-4">
      Nenhum usuário encontrado.
    </v-alert>
  </v-card>

  <!-- Modal de edição -->
  <v-dialog v-model="editDialog" max-width="600px">
    <v-card>
      <v-card-title>Editar Usuário</v-card-title>
      <v-card-text>
        <p>Formulário de edição aqui...</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="editDialog = false">Cancelar</v-btn>
        <v-btn color="primary">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmação de exclusão -->
  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title>Confirmar Exclusão</v-card-title>
      <v-card-text>
        Tem certeza que deseja excluir <strong>{{ deleteTarget?.name }}</strong>?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
        <v-btn color="red" text @click="deleteUser">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const store = useUserStore()
const users = computed(() => store.users)

const searchTerm = ref('')

const filteredUsers = computed(() => {
  if (!searchTerm.value.trim()) return users.value
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.state.toLowerCase().includes(term)
  )
})

const headers = [
  { text: 'ID', value: 'index' },
  { text: 'Nome', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Origem', value: 'origin' },
  { text: 'Endereço', value: 'address' },
  { text: 'Estado', value: 'state' },
  { text: 'Ações', value: 'actions', sortable: false }
]

const editDialog = ref(false)
const deleteDialog = ref(false)
const editUser = ref({})
const deleteTarget = ref(null)

const openEditDialog = (user) => {
  editUser.value = { ...user }
  editDialog.value = true
}

const confirmDelete = (user) => {
  deleteTarget.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  await store.removeUser(deleteTarget.value.id)
  deleteDialog.value = false
}
</script>
