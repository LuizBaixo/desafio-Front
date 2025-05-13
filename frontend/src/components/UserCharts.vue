<template>
  <v-row class="mt-6" dense>
    <!-- Gráfico por estado e origem -->
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Usuários por Estado e Origem</v-card-title>
        <apexchart
          type="bar"
          height="300"
          :options="stackedOptions"
          :series="stackedSeries"
        />
      </v-card>
    </v-col>

    <!-- Gráfico por origem -->
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Distribuição por Origem</v-card-title>
        <apexchart
          type="pie"
          height="300"
          :options="originChartOptions"
          :series="originChartSeries"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const store = useUserStore()
const users = computed(() => store.users)

// Obter lista única de estados
const estados = computed(() => {
  const set = new Set()
  users.value.forEach((u) => set.add(u.state))
  return Array.from(set)
})

// Contar usuários por estado e origem
const getUsersByOriginAndState = (origin) => {
  return estados.value.map((estado) =>
    users.value.filter((u) => u.origin === origin && u.state === estado).length
  )
}

// Série empilhada
const stackedSeries = computed(() => [
  {
    name: 'Digital',
    data: getUsersByOriginAndState('Digital')
  },
  {
    name: 'Físico',
    data: getUsersByOriginAndState('Físico')
  }
])

// Opções do gráfico estado e origem
const stackedOptions = computed(() => ({
  chart: {
    id: 'users-bar',
    stacked: true,
    toolbar: {
      show: false 
    }
  },
  xaxis: {
    categories: estados.value,
    labels: {
      style: {
        colors: Array(estados.value.length).fill('#ffffff'),
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#ffffff'],
        fontSize: '12px'
      }
    }
  },
  legend: {
    position: 'top',
    labels: {
      colors: '#ffffff' 
    }
  },
  tooltip: {
    theme: 'dark'
  },
  colors: ['#36A2EB', '#FF6384'],
  plotOptions: {
    bar: {
      horizontal: false
    }
  },
  grid: {
    borderColor: '#444'
  }
}))

// Gráfico por origem
const originChartData = computed(() => store.usersByOrigin)
const originChartOptions = computed(() => ({
  labels: Object.keys(originChartData.value || {}),
  colors: ['#36A2EB', '#FF6384'],
  legend: {
    labels: {
      colors: '#ffffff'
    }
  },
  tooltip: {
    theme: 'dark'
  }
}))
const originChartSeries = computed(() => Object.values(originChartData.value || {}))
</script>
