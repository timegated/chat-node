<template>
  <section class="about">
  <h1>Select A Model</h1>
    <section class="models-container">
      <article class="model-cards" :key="model.id" v-for="model in textModels">
        <aside class="model-basic-info">
          <span class="title">{{ model.id }}</span>
        </aside>
        <button @click="toggleMoreInfo">{{ toggleText }}</button>
        <aside class="permission-info hidden" :key="perm.id" v-for="perm in model.permission">
          <div>permission id:{{ perm.id }}</div>
          <div>permission object: {{ perm.object }}</div>
          <div>created: {{ perm.created }}</div>
          <div>allow create engine: {{ perm.allow_create_engine }}</div>
          <div>allow sampling: {{ perm.allow_sampling }}</div>
          <div>allow logprobs: {{ perm.allow_logprobs }}</div>
          <div>allow view: {{ perm.allow_view }}</div>
          <div>allow fine tuning: {{ perm.allow_fine_tuning }}</div>
          <div>organization: {{ perm.organization }}</div>
          <div>group: {{ perm.group ?? 'null' }}</div>
          <div>is blocking: {{ perm.is_blocking }}</div>
        </aside>
        <button @click="store.setModelParam">Select Model</button>
      </article>
    </section>
  </section>
</template>

<script lang="ts">
import { store } from '../store/store';
import { BASE_URL_DEV } from '@/utils/urlHandler';


interface Permission {
  id: string;
  object: string;
  created: Date;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: string;
  group: null | string;
  is_blocking: boolean;
}

interface Models {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  permission: Permission[];
  root: string;
  parent: null | any;
}

interface Data {
  models: Models[];
  textModels: Models[];
  toggleInfo: boolean;
  toggleText: string;
  store: any;
}
const completionModels: string[] = [
  'text-davinci-003',
  'text-davinci-002',
  'text-davinci-001',
  'text-ada-001',
  'text-davinci:001'
]
export default {
  data(): Data {
    return {
      models: [],
      textModels: [],
      toggleInfo: false,
      toggleText: 'More Info',
      store
    }
  },
  methods: {
    async getEngines(): Promise<any> {
      try {
        const engines = await fetch(`${BASE_URL_DEV}/engines`).then(res => res.json());
        this.textModels = engines.filter((item: Models) => completionModels.includes(item.id));
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    formatDate(dateNum: number) {
      return dateNum;
    },
    toggleMoreInfo(e: any) {
      this.toggleInfo = !this.toggleInfo;
      this.toggleInfo ? e.target.textContent = 'Less Info' : e.target.textContent = 'More Info';
      this.toggleInfo ? e.target.nextElementSibling.classList.remove('hidden') : e.target.nextElementSibling.classList.add('hidden');
    }
  },
  created() {
    this.getEngines();
  },
};
</script>

<style>
.about {
  overflow: scroll;
  height: 100vh;
}

.models-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.model-cards {
  display: flex;
  border: 1px solid var(--main-accent-color-light);
  flex-direction: column;
  padding: 1.25rem;
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
