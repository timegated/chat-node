<template>
  <header class="welcome-header">
    <div>
      <div>
        <h1 class="welcome-header-title">Chat Node</h1>
      </div>
      <div>
        <p class="byline">More direct and valuable answers from large language models</p>
        <section class="byline">Currently Available Models: {{ availableModels }}</section>
      </div>
    </div>
  </header>
  <section class="card-container">
    <article class="card" :key="title" v-for="{ title, info, footerInfo } of cards">
      <aside class="card-inner">
        <div class="card-front">
          <div class="card-title">
            <h2>{{ title }}</h2>
          </div>
        </div>
        <div class="card-back">
          <p>{{ info }}</p>
          <div>
            <a href="#">{{ footerInfo }}</a>
          </div>
        </div>
      </aside>
    </article>
  </section>
</template>

<script lang="ts">
import { BASE_URL_DEV } from '@/utils/urlHandler'
import axios from 'axios'

interface Cards {
  title: string
  info: string
  footerInfo: string
  link?: string
}

interface WelcomeData {
  availableModels: number
  cards: Cards[]
}
export default {
  data() {
    return {
      availableModels: 0,
      cards: [
        {
          title: 'Prompts',
          info: 'Use preset suggestions known generate better responses to speed up your workflow.',
          footerInfo: 'Learn More',
          link: ''
        },
        {
          title: 'Fine Tuning',
          info: 'Upload your data to create custom models that understand responses in greater detail.',
          footerInfo: 'Learn More',
          link: ''
        },
        {
          title: 'Embedding',
          info: 'Create custom embeddings that make it easier for the model to search for specific things about your data.',
          footerInfo: 'Learn More',
          link: ''
        }
      ]
    } as WelcomeData
  },
  methods: {
    async fetchAvailableModels() {
      try {
        const engines = await axios.get(`${BASE_URL_DEV}/engines`)
        this.availableModels = engines.data.length
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  },
  created() {
    this.fetchAvailableModels()
  }
}
</script>

<style>
.welcome-header {
  display: flex;
  justify-content: center;
}

.welcome-header-title {
  font-weight: bold;
  color: var(--main-accent-color-light);
}

.byline {
  font-weight: 500;
  color: var(--main-color-darkgreen);
}

h2 {
  font-weight: bold;
}

.card-container {
  display: flex;
  justify-content: space-evenly;
  margin-top: 5rem;
}

.card {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  display: flex;
  flex-direction: column;
  justify-content: center;  
  background-color: var(--main-accent-color-light);
  color: black;
  z-index: 2;
  border-radius: 16px;
}

.card-back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background-color: var(--main-green-one);
  color: white;
  transform: rotateY(180deg);
  border-radius: 16px;
}

.card-back > div > a {
  color: var(--code-string-accent);
  font-weight: bold;
}
</style>
