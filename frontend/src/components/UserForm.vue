<template>
  <v-card class="pa-4" color="surface" elevation="3">
    <v-form v-model="valid" ref="formRef" @submit.prevent="handleSubmit">
      <v-text-field
        label="Nome"
        v-model="form.name"
        :rules="[required]"
        variant="underlined"
        color="primary"
        class="mb-3"
        required
      />
      <v-text-field
        label="E-mail"
        v-model="form.email"
        :rules="[required, emailRule]"
        variant="underlined"
        color="primary"
        type="email"
        class="mb-3"
        required
      />
      <v-text-field
        label="CEP"
        v-model="form.cep"
        :rules="[required]"
        variant="underlined"
        color="primary"
        class="mb-3"
        @blur="fetchAddress"
        placeholder="00000-000"
        maxlength="9"
      />
      <v-text-field
        label="Endereço"
        v-model="form.address"
        :rules="[required]"
        variant="underlined"
        color="primary"
        class="mb-3"
        readonly
      />
      <v-select
        label="Estado"
        v-model="form.state"
        :rules="[required]"
        :items="estados"
        variant="underlined"
        color="primary"
        class="mb-3"
      />
      <v-select
        label="Origem"
        v-model="form.origin"
        :rules="[required]"
        :items="['Digital', 'Físico']"
        variant="underlined"
        color="primary"
        class="mb-4"
        required
      />

      <div class="d-flex justify-center">
        <v-btn type="submit" color="accent" class="text-white">Cadastrar</v-btn>
      </div>
    </v-form>
  </v-card>

  <v-snackbar
    v-model="showSnackbar"
    location="top right"
    color="success"
    timeout="3000"
    elevation="4"
    class="text-white"
  >
    Usuário cadastrado com sucesso!
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { getAddressByCep } from '../services/cepService'

const store = useUserStore()

const form = ref({
  name: '',
  email: '',
  cep: '',
  address: '',
  origin: '',
  state: ''
})

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
  'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
  'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
]

const valid = ref(false)
const formRef = ref(null)
const showSnackbar = ref(false)

const required = (v) => !!v || 'Campo obrigatório'
const emailRule = (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido'

const fetchAddress = async () => {
  const cleanCep = form.value.cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return
  const data = await getAddressByCep(cleanCep)
  if (!data.erro) {
    form.value.address = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`
    form.value.state = data.uf
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  await store.addUser({ ...form.value })
  formRef.value.reset()
  showSnackbar.value = true
}
</script>
