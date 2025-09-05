
<template>
  <div
    class="text-sm w-full py-4 text-black/50 dark:(bg-black/1 text-white/30)"
  >
    <div class="mx-auto w-11/12 sm:w-9/12 md:w-7/12">
      <div class="space-y-4 text-center sm:(space-y-0 space-x-6 text-left)">
        <SmartLink
          href="https://github.com/oguzaltnby/blog"
          class="text-center border-b border-transparent hover:border-black/10 dark:hover:border-white/10 transition-colors"
          blank
        >
          {{ getLocalizedNotice }}
        </SmartLink>
      </div>
    </div>
  </div>
</template>
