<script setup lang="ts">
import { ref } from 'vue';
import AppIcon from '../../atoms/icon/Icon.vue'
import { FakeLibraryViewState, LibraryViewState } from "./Library.state";

const libraryState = ref<LibraryViewState>(FakeLibraryViewState);
</script>

<template>
  <nav class="library" aria-label="File library">
    <ul class="tree-list" role="tree">
      <li role="treeitem" aria-expanded="true">
        <div class="folder-label">
          <AppIcon name="library" />
          Library
        </div>

        <!-- This is the actual library, i.e. a group of folders with their snippets -->
        <ul class="tree-list" role="group">
          <!-- Folder (Inbox) Section -->
          <li v-if="libraryState.library.inbox.length" class="library__inbox" role="treeitem" aria-expanded="true">
            <div class="folder-label library__inbox-header">
              <AppIcon name="inbox" />
              Inbox
            </div>
            <ul class="tree-list" role="group">
              <li v-for="item in libraryState.library.inbox"
                  :key="item.id"
                  class=" library__snippet"
                  role="treeitem">

                <div class="folder-label library__snippet-header">
                  <AppIcon name="text" />
                  {{ item.title }} ({{ item.trigger }})
                  <div class="folder-actions">
                    <AppIcon name="dots-vertical" />
                    <AppIcon name="blank" />
                  </div>
                </div>

                <div class="folder-item-info library__snippet-info">
                  <AppIcon name="information-outline" />
                  {{ item.note }}
                </div>

                <ul class="tree-list library__snippet-texts" role="group">
                  <li v-for="text in item.texts"
                      :key="text.id"
                      class="library__snippet-text"
                      role="treeitem">
                    <div class="folder-label">
                      <AppIcon name="circle-small" />
                      {{ text.text }}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <!-- Folders Section -->
          <li v-for="folder in libraryState.library.folders"
              :key="folder.id"
              class="library__folder"
              role="treeitem"
              aria-expanded="true">

            <div class="folder-label library__folder-header">
              <AppIcon name="folder-outline" />
              {{ folder.name }}
              <div class="folder-actions">
                <AppIcon name="dots-vertical" />
                <AppIcon name="drag" />
              </div>
            </div>

            <ul class="library__folder-snippets" role="group">
              <li v-for="item in folder.items"
                  :key="item.id"
                  class="library__snippet"
                  role="treeitem">

                <div class="folder-label library__snippet-header">
                  <AppIcon name="text" />
                  {{ item.title }} ({{ item.trigger }})
                  <div class="folder-actions">
                    <AppIcon name="dots-vertical" />
                    <AppIcon name="drag" />
                  </div>
                </div>

                <div class="folder-item-info library__snippet-info">
                  <AppIcon name="information-outline" />
                  {{ item.note }}
                </div>

                <ul class="tree-list library__snippet-texts" role="group">
                  <li v-for="text in item.texts"
                      :key="text.id"
                      class="library__snippet-text"
                      role="treeitem">
                    <div class="folder-label">
                      <AppIcon name="circle-small" />
                      {{ text.text }}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style>
.library {
  max-width: 600px;
  border: 1px solid #ddd;
}

.tree-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree-list .tree-list {
  padding: 0;
}

.folder-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.folder-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem; /* Optional: to add spacing between the icons */
}

.folder-item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
