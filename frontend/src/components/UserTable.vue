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
        <v-form ref="editFormRef" @submit.prevent="submitEditForm">
          <v-text-field v-model="editUser.name" label="Nome" :rules="[rules.required, rules.minName]" />
          <v-text-field v-model="editUser.email" label="E-mail" :rules="[rules.required, rules.email]" />
          <v-text-field
            v-model="editUser.cep"
            label="CEP"
            maxlength="9"
            :rules="[rules.required, rules.cep]"
            @input="applyEditCepMask"
            @blur="fetchEditAddress"
          />
          <v-text-field v-model="editUser.address" label="Endereço" :rules="[rules.required]" />
          <v-select
            v-model="editUser.origin"
            label="Origem"
            :items="['Digital', 'Físico']"
            :rules="[rules.required]"
          />
          <v-select
            v-model="editUser.state"
            label="Estado"
            :items="estados"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="editDialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="submitEditForm">Salvar</v-btn>
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

  <!-- Snackbar de feedback -->
  <v-snackbar
    v-model="snackbar.show"
    location="top right"
    color="success"
    timeout="3000"
    elevation="4"
    class="text-white"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
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

// Edição
const editDialog = ref(false)
const editFormRef = ref(null)
const editUser = reactive({
  id: null,
  name: '',
  email: '',
  cep: '',
  address: '',
  origin: '',
  state: ''
})

// Exclusão
const deleteDialog = ref(false)
const deleteTarget = ref(null)

// Snackbar
const snackbar = reactive({
  show: false,
  text: ''
})

const estados = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]

const rules = {
  required: v => !!v || 'Campo obrigatório',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
  cep: v => /^\d{5}-\d{3}$/.test(v) || 'CEP inválido (00000-000)',
  minName: v => (v?.length ?? 0) >= 3 || 'Nome muito curto'
}

const openEditDialog = (user) => {
  Object.assign(editUser, user)
  editDialog.value = true
}

const confirmDelete = (user) => {
  deleteTarget.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  await store.removeUser(deleteTarget.value.id)
  deleteDialog.value = false
  snackbar.text = 'Usuário excluído com sucesso!'
  snackbar.show = true
}

const applyEditCepMask = () => {
  let cep = editUser.cep.replace(/\D/g, '')
  if (cep.length > 8) cep = cep.slice(0, 8)
  if (cep.length > 5) {
    editUser.cep = cep.slice(0, 5) + '-' + cep.slice(5)
  } else {
    editUser.cep = cep
  }
}

const fetchEditAddress = async () => {
  const cleanCep = editUser.cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json`)
    const data = await res.json()
    if (!data.erro) {
      editUser.address = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`
      editUser.state = data.uf
    }
  } catch (err) {
    console.error('Erro ao buscar endereço:', err)
  }
}

const submitEditForm = async () => {
  const { valid } = await editFormRef.value.validate()
  if (!valid) return
  await store.editUser(editUser.id, { ...editUser })
  editDialog.value = false
  snackbar.text = 'Usuário atualizado com sucesso!'
  snackbar.show = true
}
</script>
