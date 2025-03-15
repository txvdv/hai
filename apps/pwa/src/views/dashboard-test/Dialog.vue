<script setup lang="ts">
// Define props for two-way binding
defineProps({
  modelValue: {
    type: Boolean,
    required: true, // Parent must provide it
  },
});

// Emit events for `update:modelValue`, `confirm`, and `close`
const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

// Functions to handle close and confirm actions
function closeDialog() {
  emit('update:modelValue', false); // Notify parent to close
  emit('close'); // Emit 'close' event
}

function confirmAction() {
  emit('confirm'); // Emit 'confirm' event
  closeDialog(); // Optionally close the dialog
}
</script>

<template>
  <div
    v-if="modelValue"
    class="dialog dialog--visible"
    role="dialog"
    aria-label="Application Dialog"
  >
    <div class="dialog__overlay" @click="closeDialog"></div>
    <div class="dialog__content">
      <h2 class="dialog__title">
        <slot name="title">Default Title</slot>
      </h2>
      <p class="dialog__body">
        <slot name="body">Default body content for the dialog.</slot>
      </p>
      <div class="dialog__actions">
        <!-- Allow users to customize action buttons via slots -->
        <slot name="actions">
          <!-- Default actions -->
          <button
            type="button"
            class="dialog__button dialog__button--confirm"
            @click="confirmAction"
            aria-label="Confirm Action"
          >
            Confirm
          </button>
          <button
            type="button"
            class="dialog__button dialog__button--cancel"
            @click="closeDialog"
            aria-label="Close Dialog"
          >
            Cancel
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
/* Dialog Container */
.dialog {
  display: none; /* Hidden by default */
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0; /* Covers the full screen */
  z-index: 1000; /* Place above other elements */
}

.dialog--visible {
  display: flex; /* Visible when class is applied */
}

/* Overlay */
.dialog__overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
}

/* Dialog Box */
.dialog__content {
  background-color: #ffffff; /* White background for light mode */
  color: #333333; /* Dark text */
  border-radius: 8px; /* Rounded corners */
  padding: 24px; /* Padding inside the dialog */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  max-width: 400px;
  width: 90%;
  z-index: 1010; /* So that content stays above overlay */
}

/* Dialog Title */
.dialog__title {
  font-size: 1.5rem; /* Slightly larger text */
  font-weight: bold;
  margin-bottom: 16px; /* Space below the title */
  color: inherit; /* Inherit color from parent for flexibility */
}

/* Dialog Body */
.dialog__body {
  font-size: 1rem; /* Default body text size */
  margin-bottom: 24px; /* Space below the body */
  color: #555555; /* Subtle text color for readability */
}

/* Actions Section */
.dialog__actions {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 12px; /* Space between buttons */
}

/* Base Button Styles */
.dialog__button {
  padding: 8px 16px; /* Add padding inside buttons */
  border-radius: 4px; /* Slightly rounded corners */
  font-size: 1rem; /* Standard text size */
  cursor: pointer; /* Pointer cursor on hover */
  border: none; /* Remove default border */
}

/* Confirm Button */
.dialog__button--confirm {
  background-color: #007bff; /* Blue background for confirm */
  color: white; /* White text */
  transition: background-color 0.3s ease-in-out; /* Smooth transition */
}

.dialog__button--confirm:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Cancel Button */
.dialog__button--cancel {
  background-color: #6c757d; /* Gray background */
  color: white; /* White text */
  transition: background-color 0.3s ease-in-out; /* Smooth transition */
}

.dialog__button--cancel:hover {
  background-color: #5a6268; /* Darker gray on hover */
}
</style>
