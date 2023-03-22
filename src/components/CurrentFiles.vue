<script lang="ts">
import { BASE_API_URL } from '@/utils/urlHandler';
import axios from 'axios';


interface OpenAIFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
  status: string;
  status_details: string;
}

interface FileData {
  files?: OpenAIFile[];
  fileId: string;
}

export default {
  data(): FileData {
    return {
      files: [],
      fileId: ''
    }
  },
  methods: {
    async createFineTune (): Promise<void> {
      try {
        const id = this.fileId;
        const post = await axios.post(`${BASE_API_URL}/fine-tune`, { id });
        console.log(post);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async retrieveStatus(): Promise<void> {
      try {
        const id = this.fileId;
        const getStatus = await axios.get(`${BASE_API_URL}/fine-tune/status/${id}`);
        console.log(getStatus);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    setFileId (e: any) {
      const text = e.target.firstChild.textContent.replace(/File Id: /g, '').trim();
      console.log(text);
      this.fileId = text;
    }
  },
  async created() {
    const available = await axios.get(`${BASE_API_URL}/files/list`);
    this.files = available.data.data;
  }
}
</script>


<template lang="">
  <section class="file-card__container">
    <article @click="setFileId" class="file-card" :key="file.id" v-for="file of files">
      <div class="file-card__id">
        <h3 title="Use this ID for other actions">
          <span>File Id:</span> {{ file.id }}
        </h3>
      </div>
      <div class="file-card__filename">
        <span>File Name:</span> {{ file.filename }}
      </div>
      <div>
        <span>Object:</span> {{ file.object }}
      </div>
      <div>
        <span>Bytes:</span> {{ file.bytes }}
      </div>
      <div>
        <span>Purpose: </span> {{ file.purpose }}
      </div>
      <article>
        <div style="display:none" v-if="fileId === ''"></div>
        <button v-else-if="true" @click="createFineTune" >Fine-Tune</button>
        <button @click="retrieveStatus">Status</button>
      </article>
    </article>
  </section>
</template>


<style>
.file-card__container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: .25rem;
  margin-left: .25rem;
  margin-top: 2.5rem;
}

.file-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 0 1 25%;
  border: 1px solid var(--main-green-one);
  padding: 1rem;
  margin-top: 1.25rem;
  cursor: pointer;
}

.file-card > div > span, h3 > span {
  font-weight: bold;
}
</style>