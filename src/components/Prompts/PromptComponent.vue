<template>
  <span :style="{ fontSize: '24px'}">Choose a Topic</span>
  <div class="topics">
    <button
      :key="topic.topicid"
      :class="{ isActive: topic.topicname === currentTopic }"
      v-for="topic in store.topics"
      @click="pushTopic"
    >
      {{ topic.topicname }}
    </button>
  </div>
  <span v-if="store.prompts.length" class="prompt-titles">Base Prompts</span>
       <div class="text-container" :style="{overflow: 'scroll', maxHeight: '10vw', textAlign: 'left'}">
        <div>
          <span
            :key="index"
            :class="{ isActive: prompttext === currentPrompt }"
            v-for="{ prompttext }, index in store.prompts"
            @click="pushPrompt"
            class="text"
          >
            {{ prompttext }}
          </span>
        </div>
        </div>
</template>

<script lang="ts">
import { BASE_API_URL } from '@/utils/urlHandler'
import { store } from '@/store/store'
import axios from 'axios'


export default {
  data() {
    return {
      currentTopic: '',
      currentPrompt: '',
      store
    }
  },
  methods: {
    pushTopic(e: any) {
      this.currentTopic = e.target.textContent;
    },
    pushPrompt(e: any) {
      this.currentPrompt = e.target.textContent;
      this.store.currentPrompt = e.target.textContent;
    },
    async getPrompts () {
      if (this.currentTopic) {
        const id = this.store.topics.filter((t) => t.topicname === this.currentTopic)[0].topicid;
        const prompts = await axios.get(`${BASE_API_URL}/topics/prompts?topicid=${id}&type=prompts`);
        this.store.prompts = prompts.data;
      }
    }
  },
  async created() {
    const topics = await axios.get(`${BASE_API_URL}/topics`)
    console.log(topics.data)
    this.store.topics = topics.data
  },
  watch: {
    currentTopic: {
      immediate: true,
      handler() {
        this.getPrompts();
      }
    }
  }
}
</script>
<style scoped>
.topics {
  display: grid;
  grid-template-columns: repeat(5, minmax(50px, 1fr));
  grid-gap: 5px;
  margin-bottom: 4rem;
}

.topic-title {
  font-weight: bold;
  font-size: 18px;
  margin-right: 1rem;
}

.topics > button {
  max-width: 150px;
  padding: 1rem;
  font-weight: bold;
  font-size: 18px;
  border-radius: none !important;
}


.text-container > div {
  display: grid;
  grid-template-columns: 1fr;
}

.text-container > div > span:hover {
  cursor: pointer;
  background-color: var(--main-green-one);
  transition: background-color 0.25s ease;
  color: #ffffff;
}

.text {
  text-overflow: ellipsis;
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px;
}

.isActive {
  background-color: var(--main-green-one);
  color: #ffffff;
}
</style>
