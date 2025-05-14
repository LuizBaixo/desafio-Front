import { describe, it, expect } from 'vitest'

const emailRule = v =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido'

describe('Validações', () => {
  it('aceita e-mails válidos', () => {
    expect(emailRule('teste@email.com')).toBe(true)
  })

  it('recusa e-mails inválidos', () => {
    expect(emailRule('errado')).toBe('E-mail inválido')
  })
})
