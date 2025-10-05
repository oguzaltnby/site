<!-- src/pages/commits.vue -->
<template>
  <PageLayout
    title="Latest Updates"
    :description="['Here you can find the latest updates and commits made to the repository.']"
    class="space-y-6"
  >
    <ClientOnly>
      <draggable
        v-model="commits"
        group="commits"
        @end="onDragEnd"
        :animation="200"
        ghost-class="ghost"
        handle=".handle"
      >
        <template #item="{ element: commit }">
          <div class="flex flex-row items-center gap-4 mb-4 handle" :key="commit.sha">
            <!-- Commit Image -->
            <div class="rounded-lg h-12 w-12">
              <img
                :src="iconSrc"
                alt="commit"
                class="rounded-lg h-12 w-12 object-contain"
              />
            </div>

            <!-- Commit Details -->
            <div class="rounded-lg card-base p-4 flex flex-col space-y-2">
              <p class="text-black/50 dark:text-white/30">
                {{ commit.commit.message }}
              </p>

              <p class="text-black/50 dark:text-white/30 flex items-center">
                <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z">
                  </path>
                </svg>
                {{ commit.commit.author.name }}
              </p>

              <p class="text-black/50 dark:text-white/30 flex items-center">
                <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,6 C11.4477,6 11,6.44772 11,7 L11,12 C11,12.2652 11.1054,12.5196 11.2929,12.7071 L14.2929,15.7071 C14.6834,16.0976 15.3166,16.0976 15.7071,15.7071 C16.0976,15.3166 16.0976,14.6834 15.7071,14.2929 L13,11.5858 L13,7 C13,6.44772 12.5523,6 12,6 Z"
                    fill="currentColor"
                  />
                </svg>
                {{ formatDate(commit.commit.author.date) }}
              </p>
            </div>
          </div>
        </template>
      </draggable>
    </ClientOnly>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useHead, useFetch } from '#app'

type Commit = {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

useHead({ title: 'Commits' })

const commits = ref<Commit[]>([])
const pageLoaded = ref(false)
const isDarkMode = ref(false)

// Tek bir ikon kaynağı seçimi (mevcut base64 yerine kısa placeholder bırakıldı)
const darkIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...' // kendi base64'ünle değiştir
const lightIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...' // kendi base64'ünle değiştir
const iconSrc = computed(() => (isDarkMode.value ? darkIcon : lightIcon))

// SSR + CSR uyumlu fetch (GitHub rate-limit dikkate alın)
const { data, error } = await useFetch<Commit[]>(
  'https://api.github.com/repos/oguzaltnby/site/commits',
  { server: true, lazy: false }
)

if (!error.value && Array.isArray(data.value)) {
  commits.value = data.value
}

// Drag end (gerekirse işle)
function onDragEnd(_evt: unknown) {
  // no-op
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

// Karanlık mod izleyicisi (yalnızca istemci)
let mq: MediaQueryList | null = null
onMounted(() => {
  pageLoaded.value = true
  if (typeof window !== 'undefined' && window.matchMedia) {
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    isDarkMode.value = mq.matches
    mq.addEventListener?.('change', (e) => (isDarkMode.value = e.matches))
  }
})
onBeforeUnmount(() => {
  mq?.removeEventListener?.('change', (e) => (isDarkMode.value = (e as MediaQueryListEvent).matches))
})
</script>

<style scoped>
.ghost { opacity: 0.4; }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
</style>
