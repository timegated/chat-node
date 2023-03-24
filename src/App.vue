<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/models">Models</RouterLink>
        <RouterLink to="/prompts">Prompts</RouterLink>
        <RouterLink to="/files">Files</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
}

nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  font-size: 24px;
  text-align: center;
  height: 100vh;
  border-radius: 0 16px 16px 0;
  background-color: var(--main-color-darkgreen);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media screen and (max-width: 1600px) {
  header {
    max-height: auto;
    max-width: 100%;
  }

  nav {
  position: static;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 24px;
  text-align: center;
  border-radius: 0 0 0 0;
  background-color: var(--main-color-darkgreen);
  height: 100px;
}
}
</style>
