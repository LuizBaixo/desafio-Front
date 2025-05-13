import axios from 'axios'

export const getAddressByCep = async (cep) => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
  return data
}
