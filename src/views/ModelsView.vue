<template>
  <section class="about">
  <h1>Select A Model</h1>
    <section class="models-container">
      <article class="model-cards" :key="model.id" v-for="model in models">
        <aside class="model-basic-info">
          <span class="title">{{ model.id }}</span>
          <div>created: {{ formatDate(model.created) }}</div>
        </aside>
        <aside class="permission-info" :key="perm.id" v-for="perm in model.permission">
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
      </article>
    </section>
  </section>
</template>

<script lang="ts">
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
  models: Models[]
}
export default {
  data(): Data {
    return {
      models: []
    }
  },
  methods: {
    async getEngines(): Promise<any> {
      try {
        const engines = await fetch(`${BASE_URL_DEV}/engines`).then(res => res.json());
        console.log(engines);
        this.models = engines;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    formatDate(dateNum: number) {
      return dateNum;
    }
  },
  created() {
    this.getEngines();
  }
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
</style>
