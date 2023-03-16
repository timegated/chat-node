<script lang="ts">
import { BASE_URL_DEV } from '@/utils/urlHandler';
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      uploading: false,
      uploaded: false,
    };
  },
  methods: {
    onFileChange(event: any) {
      this.file = event.target.files[0];
    },
    async submitForm() {
      if (!this.file) return;

      this.uploading = true;

      const formData = new FormData();
      formData.append('file', this.file);
      
      console.log(formData)
      try {
        // Replace this URL with the third-party API URL
        const apiUrl = `${BASE_URL_DEV}/files/upload`;
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          this.uploaded = true;
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <label for="file-upload" class="custom-file-upload">
        Choose File
      </label>
      <input id="file-upload" type="file" @change="onFileChange" />
      <button type="submit" :disabled="!file">Upload</button>
    </form>
    <p v-if="uploading">Uploading...</p>
    <p v-if="uploaded">File uploaded successfully!</p>
  </div>
</template>

<style>
</style>