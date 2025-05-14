import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import { createTestingPinia } from '@pinia/testing'
import UserForm from '@/components/UserForm.vue'

import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})

describe('UserForm.vue', () => {
  it('renderiza os campos esperados', () => {
    const { getByTestId } = render(UserForm, {
      global: {
        plugins: [vuetify, createTestingPinia()]
      }
    })

    expect(getByTestId('input-nome')).toBeTruthy()
    expect(getByTestId('input-email')).toBeTruthy()
    expect(getByTestId('input-cep')).toBeTruthy()
  })
})
