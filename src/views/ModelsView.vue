<template>
  <section class="about">
    <h1>Select A Model</h1>
    <div>
      <button class="get-all" @click="getAllEngines">Get All Engines</button>
    </div>
    <div class="filter-container">
      <button @click="filterCodeEngines">Code Models</button>
      <button @click="filterTextEngines">Text Models</button>
      <button @click="filterGPT">GPT</button>
    </div>
    <section class="models-container">
      <article class="model-cards" :key="model.id" v-for="model in parseDates">
        <aside class="model-basic-info">
          <span class="title">{{ model.id }}</span>
        </aside>
        <div>
          <button @click="toggleMoreInfo">{{ toggleText }}</button>
          <aside class="permission-info hidden" :key="perm.id" v-for="perm in model.permission">
            <span>permission id:{{ perm.id }}</span>
            <span>permission object: {{ perm.object }}</span>
            <span>created: {{ perm.created }}</span>
            <span>allow create engine: {{ perm.allow_create_engine }}</span>
            <span>allow sampling: {{ perm.allow_sampling }}</span>
            <span>allow logprobs: {{ perm.allow_logprobs }}</span>
            <span>allow view: {{ perm.allow_view }}</span>
            <span>allow fine tuning: {{ perm.allow_fine_tuning }}</span>
            <span>organization: {{ perm.organization }}</span>
            <span>group: {{ perm.group ?? 'null' }}</span>
            <span>is blocking: {{ perm.is_blocking }}</span>
          </aside>
        </div>
          <button class="btn-select" @click="store.setModelParam">Select Model</button>
      </article>
    </section>
  </section>
</template>

<script lang="ts">
import { store } from '../store/store'
import { BASE_URL_DEV } from '@/utils/urlHandler'
import axios from 'axios'

interface Permission {
  id: string
  object: string
  created: Date
  allow_create_engine: boolean
  allow_sampling: boolean
  allow_logprobs: boolean
  allow_search_indices: boolean
  allow_view: boolean
  allow_fine_tuning: boolean
  organization: string
  group: null | string
  is_blocking: boolean
}

interface Models {
  id: string
  object: string
  created: number
  owned_by: string
  permission: Permission[]
  root: string
  parent: null | any
}

interface Data {
  models: Models[]
  toggleInfo: boolean
  toggleText: string
  store: any
}

export default {
  data(): Data {
    return {
      models: [],
      toggleInfo: false,
      toggleText: 'More Info',
      store
    }
  },
  computed: {
    parseDates() {
      return this.models.map((model) => {
        return {
          ...model,
          permission: model.permission.map((perm) => {
            return {
              ...perm,
              created: new Date(Number(perm.created) * 1000).toString().substring(0, 15)
            }
          })
        }
      })
    }
  },
  methods: {
    filterCodeEngines() {
      this.models = this.models.filter((model: Models) => {
        console.log(model)
        return model.id.substring(0, 5).includes('code')
      })
    },
    filterTextEngines() {
      this.models = this.models.filter((model) => {
        return model.id.includes('text-davinci')
      })
    },
    filterGPT() {
      this.models = this.models.filter((model) => {
        return model.id.includes('gpt')
      })
    },
    async getAllEngines(): Promise<void> {
      try {
        const engines = await axios.get(`${BASE_URL_DEV}/engines`)
        this.models = engines.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    formatDate(dateNum: number) {
      return dateNum
    },
    toggleMoreInfo(e: any) {
      this.toggleInfo = !this.toggleInfo
      this.toggleInfo ? (e.target.textContent = 'Less Info') : (e.target.textContent = 'More Info')
      this.toggleInfo
        ? e.target.nextElementSibling.classList.remove('hidden')
        : e.target.nextElementSibling.classList.add('hidden')
    }
  },
  created() {
    this.getAllEngines()
  }
}
</script>

<style>
h1 {
  font-weight: bold;
  color: var(--main-accent-color-light);
  margin-bottom: 1rem;
}

.about {
  overflow: scroll;
  height: 100vh;
}

.models-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  max-width: 50vw;
}

.get-all {
  font-size: 24px;
  font-weight: bold;
}

.filter-container {
  display: flex;
  margin: 1rem 0 1rem 0;
}

.filter-container > button {
  font-size: 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.model-cards {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--main-accent-color-light);
  padding: 1.25rem;
  border-radius: 16px;
}

.btn-select {
  font-size: 24px;
  font-weight: bold;
  border: none;
}

.model-basic-info {
  display: flex;
  flex-direction: column;
}

.permission-info {
  display: flex;
  flex-direction: column;
}

.hidden {
  display: none;
}
</style>
