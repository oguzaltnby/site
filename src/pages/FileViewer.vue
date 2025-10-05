<template>
  <PageLayout
    title="Files"
    :description="['You can view and download files from here']"
    class="space-y-6"
  >
    <draggable
      v-model="files"
      group="files"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-4 gap-2"
      @end="onDragEnd"
      :animation="200"
      ghost-class="ghost"
      handle=".handle"
    >
      <div v-for="file in files" :key="file" class="handle">
        <div class="rounded-lg card-base p-2 flex flex-row items-center h-14">
          <div class="rounded-lg p-2 flex items-center justify-center mr-4">
            <img
              :src="getFileIcon(file)"
              class="h-8 w-8 object-contain"
              alt="Dosya İkonu"
            />
          </div>
          <div class="flex flex-row items-center justify-between w-full">
            <p class="text-gray-700 dark:text-gray-300 text-sm font-medium truncate">
              {{ file }}
            </p>
            <template v-if="!requiresPassword(file)">
              <a
                :href="`/.netlify/functions/downloadFile?filename=${file}`"
                class="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold ml-4 whitespace-nowrap"
                download
              >
                İndir
              </a>
            </template>
            <template v-else>
              <a
                href="#"
                @click.prevent="openPasswordModal(file)"
                class="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold ml-4 whitespace-nowrap"
              >
                İndir
              </a>
            </template>
          </div>
        </div>
      </div>
    </draggable>

    <div
      v-if="showPasswordModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
    <div class="relative card-base p-6 rounded-lg max-w-sm w-full shadow-lg border bg-white/30 dark:bg-black/30 before:absolute before:inset-0 before:backdrop-blur-md before:-z-10">


        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
          Protected File
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          Password Required
        </p>
        <input
          type="password"
          v-model="enteredPassword"
          class="border border-gray-300 dark:border-gray-600 p-3 mb-4 w-full rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Password"
        />
        <div class="flex justify-between mt-4">
          <button
            @click="closePasswordModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            @click="submitPassword"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { VueDraggableNext as draggable } from 'vue-draggable-next';

export default defineComponent({
  components: {
    draggable,
  },
  head() {
    return {
      title: "Dosya Listesi",
    };
  },
  data() {
    return {
      files: [] as string[],
      protectedPassword: "secret",
      showPasswordModal: false,
      currentProtectedFile: "",
      enteredPassword: "",
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      try {
        const res = await fetch("/.netlify/functions/listFiles");
        const data = await res.json();
        this.files = data.files;
      } catch (error) {
        console.error("Dosya listesi alınamadı:", error);
      }
    },
    getFileIcon(filename: string) {
      const extension = filename.split(".").pop()?.toLowerCase() || "default";
      const icons: Record<string, string> = {
        pdf: "https://img.icons8.com/?size=100&id=zGrV8SMoAvHE&format=png&color=000000",
        doc: "https://img.icons8.com/?size=100&id=pGHcje298xSl&format=png&color=000000",
        docx: "https://img.icons8.com/?size=100&id=pGHcje298xSl&format=png&color=000000",
        xls: "https://img.icons8.com/?size=100&id=117561&format=png&color=000000",
        xlsx: "https://img.icons8.com/?size=100&id=117561&format=png&color=000000",
        ppt: "https://img.icons8.com/?size=100&id=ifP93G7BXUhU&format=png&color=000000",
        pptx: "https://img.icons8.com/?size=100&id=ifP93G7BXUhU&format=png&color=000000",
        jpg: "https://img.icons8.com/?size=100&id=13917&format=png&color=000000",
        jpeg: "https://img.icons8.com/?size=100&id=13917&format=png&color=000000",
        png: "https://img.icons8.com/?size=100&id=13917&format=png&color=000000",
        gif: "https://img.icons8.com/?size=100&id=5oUGM6NBLyWf&format=png&color=000000",
        txt: "https://img.icons8.com/?size=100&id=50nDvbuc0xFF&format=png&color=000000",
        zip: "https://img.icons8.com/?size=100&id=PLvn50bVGAlA&format=png&color=000000",
        rar: "https://img.icons8.com/?size=100&id=PLvn50bVGAlA&format=png&color=000000",
        mp3: "https://img.icons8.com/?size=100&id=p6vT9rfwUGw6&format=png&color=000000",
        mp4: "https://img.icons8.com/?size=100&id=1FE2HGszFS4w&format=png&color=000000",
        default: "https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/file.svg",
      };
      return icons[extension] || icons.default;
    },
    requiresPassword(file: string): boolean {
      return file.includes("!");
    },
    openPasswordModal(file: string) {
      this.currentProtectedFile = file;
      this.enteredPassword = "";
      this.showPasswordModal = true;
    },
    closePasswordModal() {
      this.showPasswordModal = false;
    },
    submitPassword() {
      if (this.enteredPassword === this.protectedPassword) {
        window.location.href = `/.netlify/functions/downloadFile?filename=${this.currentProtectedFile}&password=${encodeURIComponent(
          this.enteredPassword
        )}`;
        this.closePasswordModal();
      } else {
        alert("Hatalı şifre!");
      }
    },
    onDragEnd() {
      console.log("Drag ended");
    },
  },
});
</script>

<style scoped>
.ghost {
  opacity: 0.4;
}
.handle {
  cursor: grab;
}
.handle:active {
  cursor: grabbing;
}
</style>
