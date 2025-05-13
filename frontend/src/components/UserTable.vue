<template>
  <v-card class="mt-6">
    <v-card-title>Usuários Cadastrados</v-card-title>

    <!-- Spinner de carregamento -->
    <v-container v-if="store.loading" class="text-center py-6">
      <v-progress-circular color="primary" indeterminate size="40" />
    </v-container>

    <!-- Tabela visível somente quando carregado -->
    <v-data-table
      v-else
      :headers="headers"
      :items="users"
      class="elevation-1"
      :items-per-page="5"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
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
  </v-card>

  <!-- Diálogo de edição -->
  <v-dialog v-model="editDialog" max-width="600px">
    <v-card>
      <v-card-title>Editar Usuário</v-card-title>
      <v-card-text>
        <v-form ref="editFormRef">
          <v-text-field label="Nome" v-model="editUser.name" />
          <v-text-field label="E-mail" v-model="editUser.email" />
          <v-text-field label="Endereço" v-model="editUser.address" />
          <v-select
            label="Origem"
            :items="['Digital', 'Físico']"
            v-model="editUser.origin"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="editDialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="submitEdit">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmação antes de deletar -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirmar exclusão</v-card-title>
      <v-card-text>
        Tem certeza que deseja excluir o usuário
        <strong>{{ deleteTarget?.name }}</strong>?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
        <v-btn color="red" text @click="deleteUser">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar de feedback -->
  <v-snackbar
    v-model="snackbar.visible"
    location="top right"
    :color="snackbar.color"
    timeout="3000"
    elevation="4"
    class="text-white"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const store = useUserStore()
const users = computed(() => store.users)

const headers = [
  { text: '#', value: 'index', width: 50 },
  { text: 'Nome', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Origem', value: 'origin' },
  { text: 'Endereço', value: 'address' },
  { text: 'Estado', value: 'state' },
  { text: 'Ações', value: 'actions', sortable: false }
]

// Editar
const editDialog = ref(false)
const editUser = ref({})
const editFormRef = ref(null)

const openEditDialog = (user) => {
  editUser.value = { ...user }
  editDialog.value = true
}

const submitEdit = async () => {
  if (!editUser.value.id) return
  await store.editUser(editUser.value.id, editUser.value)
  snackbar.message = 'Usuário atualizado com sucesso!'
  snackbar.color = 'success'
  snackbar.visible = true
  editDialog.value = false
}

// Deletar
const deleteDialog = ref(false)
const deleteTarget = ref(null)

const confirmDelete = (user) => {
  deleteTarget.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  await store.removeUser(deleteTarget.value.id)
  deleteDialog.value = false
  deleteTarget.value = null
  snackbar.message = 'Usuário excluído com sucesso!'
  snackbar.color = 'success'
  snackbar.visible = true
}

// Snackbar
const snackbar = ref({
  visible: false,
  message: '',
  color: 'success'
})
</script>
