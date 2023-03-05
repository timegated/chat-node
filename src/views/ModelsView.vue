<template>
  <div class="about">
    <h1>Select Available Models</h1>
    <div v-for="model in models">
      {{ model }}
    </div>
  </div>
</template>

<script lang="ts">
import { BASE_URL_PROD } from '@/utils/urlHandler';


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
  created: Date;
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
        const engines = await fetch(`${BASE_URL_PROD}/engines`).then(res => res.json());
        console.log(engines);
        this.models = engines;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  created() {
    this.getEngines();
  }
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
