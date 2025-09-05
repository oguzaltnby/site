<script lang="ts">
import Vue from "vue"

// Types
import type { Post } from "~/src/types/Post"
import type { FetchReturn } from "@nuxt/content/types/query-builder"

export default Vue.extend({
  data() {
    return {
      posts: [] as (Post[] & FetchReturn) | (Post[] & FetchReturn)[],
    }
  },
  fetchOnServer: false,
  async fetch() {
    const posts = await this.$content("blog")
      .sortBy("createdAt", "desc")
      .only(["title", "slug"])
      .fetch<Post[]>()

    this.posts = posts
  },
  head() {
    let string = "Oguzhan"
    if (this.routeIsBlog) string = "Oguzhan - blog"

    return {
      titleTemplate: `%s - ${string}`,
      htmlAttrs: {
        class: `min-h-screen ${this.$colorMode.value}`,
      },
      meta: [
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: string,
        },
      ],
    }
  },
  computed: {
    menuActions() {
      return [
        /* Navigation */
        {
          section: "Navigation",
          text: "Home",
          icon: "IconHome",
          action: () => {
            this.$router.push("/")
          },
        },
        {
          section: "Navigation",
          text: "Blog",
          tag: "Search a blog post",
          icon: "IconDocument",
          keybindings: ["b"],
          childActions: [
            {
              text: "All Posts",
              icon: "IconEye",
              action: () => {
                this.$router.push("/blog")
              },
            },
            ...this.posts.map((post: Post) => ({
              text: post.title,
              icon: "IconDocument",
              action: () => {
                this.$router.push(`/blog/${post.slug}`)
              },
            })),
          ],
        },


        /* Me */
        {
          section: "Me",
          text: "Repositories",
          icon: "IconBranch",
          action: () => {
            this.$router.push("/me/repos")
          },
        },
        {
          section: "Me",
          text: "Songs",
          icon: "IconStar",
          action: () => {
            this.$router.push("/me/songs")
          },
        },
        {
          section: "Me",
          text: "Contact",
          icon: "IconInbox",
          action: () => {
            this.$router.push("/me/contact")
          },
        },
        {
          section: "Me",
          text: "Payment",
          icon: "IconDollar",
          action: () => {
            this.$router.push("/me/payment")
          },
        },


        /* Quick Links */
        {
          section: "Quick Links",
          text: "GitHub",
          icon: "IconBrand:github",
          action: () => {
            window.open(this.$config.social.github, "_blank")?.focus()
          },
        },
        {
          section: "Quick Links",
          text: "Instagram",
          icon: "IconBrand:instagram",
          action: () => {
            window.open(this.$config.social.instagram, "_blank")?.focus()
          },
        },
        {
          section: "Quick Links",
          text: "Reddit",
          icon: "IconBrand:reddit",
          action: () => {
            window.open(this.$config.social.reddit, "_blank")?.focus()
          },
        },

        /* Controls */
        {
          section: "Controls",
          text: "Toggle Color Mode",
          icon: "IconSun",
          action: () => {
            this.$colorMode.preference =
              this.$colorMode.value === "dark" ? "light" : "dark"
          },
        },
      ]
    },
  },
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <Navbar class="pt-10" />

    <!-- Nuxt component -->
    <main class="responsive-screen min-h-screen pb-8">
      <Nuxt class="container mx-auto min-h-screen pb-8 w-11/12 sm:(pb-10 w-9/12) md:w-7/12" />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Command Palette -->
    <CommandMenu :actions="menuActions" :theme="$colorMode.value" class="bg-white dark:bg-neutral-900 text-black dark:text-white">
      <template v-slot:icon="{ icon }">
        <component :is="icon.split(':')[0]" :brand="icon.split(':')[1]" class="w-4 h-4" />
      </template>
    </CommandMenu>

    <!-- Go to top button -->
    <GoTop />

    <!-- Sponsor Popup -->
    <SponsorPopup />
  </div>
</template>
