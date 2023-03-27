<template>
  <header>
      <nav>
        <RouterLink to="/">
          <img :src="home" alt="Home" title="Go home">
        </RouterLink>
        <RouterLink to="/models">
          <img :src="tune" alt="Models" title="View available models">
        </RouterLink>
        <RouterLink to="/prompts">
          <img :src="chat" alt="Prompts" title="Prompt an LLM">

        </RouterLink>
        <RouterLink to="/files">
          <img :src="doc" alt="Files" title="Upload files to fine tune or embed data">
        </RouterLink>
      </nav>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import home from '../../assets/icon-home.svg';
import doc from '../../assets/icon-document.svg';
import tune from '../../assets/icon-tune.svg';
import chat from '../../assets/icon-chat.svg';
</script>

<style>
nav {
  position: sticky;
  top: 0px;
  display: flex;
  width: 100%;
  font-size: 24px;
  text-align: center;
  border-radius: 0 0 16px 16px;
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
</style>