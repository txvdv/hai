<script setup lang="ts">
import Navigation from "../../organisms/navigation/Navigation.vue";
import ComposerEditor from "./ComposerEditor.vue";
import {ref} from "vue";

const fakeComposerState = ref({
  document: '',
})

/**
 * Then watch for route changes
 * https://router.vuejs.org/guide/essentials/dynamic-matching#Reacting-to-Params-Changes
 */

const navItems = [{
  text: 'HAI',
  link: '/'
}, {
  text: 'Dashboard',
  link: '/dashboard'
}, {
  text: 'Composer',
  link: '/composer'
}]

const saveDoc = () => {};
</script>

<template>
  <div>
    <Navigation :items="navItems" />
    <ComposerEditor
        :document-content="fakeComposerState.document"
        @save-doc="saveDoc"
    />
  </div>
</template>

<style>
</style>
