<script lang="ts">
import { defineComponent } from 'vue'

/* Interfaces */
import type { Repository } from "../types/Response/GitHub"

interface Project {
  title: string
  description: string
  href?: string
  to?: string
  icon?: string
}

interface Experience {
  title: string
  url: string
  position: string
  date: string
  isHidden?: boolean
}

interface ExperienceObject {
  jobs: Experience[]
  education: Experience[]
}

export default defineComponent({
  data() {
    return {
      showModal: false,
      showExtra: {
        jobs: false,
        education: false,
      },
      repos: [] as Repository[],
      experiences: {
        jobs: [
          {
            title: "Kumport Port Services Inc.",
            url: "https://kumport.com.tr",
            position: "IT Intern",
            date: "2023-2024",
          },

        ],
        education: [
          {
            title: "Borusan Asım Kocabıyık Vocational and Technical Anatolian High School",
            url: "https://borusan.meb.k12.tr",
            position: "Informatics",
            date: "2020-2024",
          },
          {
            title: "Istanbul Arel University",
            url: "https://arel.edu.tr",
            position: "Computer Engineering",
            date: "2024-",
          },
        ],

      } as ExperienceObject,
      cards: {
        me: [
          {
            title: "Repositories",
            description:
              "Want to see and/or contribute to my code and public repositories?",
            href: "/me/repos",
          },
          {
            title: "Songs",
            description:
              "Trust your taste? Compare your favourite songs and artists with mine!",
            href: "/me/songs",
          },
          {
            title: "Contact",
            description:
              "Need help with anything? Want to get in touch? Send me a message!",
            href: "/me/contact",
          },
        ],
        pages: [
          {
            title: "Blog",
            description:
              "My thoughts, experiences, and learnings in the form of blog posts.",
            href: "/blog",
          },
          {
            title: "Projects",
            description:
              "My projects and contributions to the open-source community.",
            href: "/projects",
          },
          {
            title: "Payment",
            description:
              "You can make your payments to me through the following banks",
            href: "/payment",
          },
          {
            title: "Commits",
            description:
              "My latest commits and contributions to the open-source community.",
              href: "/commits",
          },
          {
            title: "Documents",
            description:
              "My latest commits and contributions to the open-source community.",
              href: "/fileviewer",
          }

        ],
      },
      skills: [
        {
          title: "Development",
          items: [
            "TypeScript",
            "Javascript",
            "C#",
            "Vue.js",
            "React.js",
            "Node.js",
            "Python",
            "PHP",

            //"Sass",
          ],
        },
        {
          title: "Frameworks",
          items: [
            "Nuxt",
            "Angular",
          ],
        },
        {
          title: "Apps",
          items: [
            {
              title: "VS Code",
              iconPack: "IconBrand",
            },
            {
              title: "Illustrator",
            },
            {
              title: "Photoshop",
            },
          ],
        },
        {
          title: "Services",
          items: [
            {
              title: "GitHub",
              iconPack: "IconBrand",
            },
            {
              title: "Postman"
            },
            {
              title: "MySQL",
            },
            {
              title: "Discord"
            },
            {
              title: "Firebase",
            },
            {
              title: "Netlify",
              iconPack: "IconBrand",
            },
          ],
        },
      ],
    }
  },
  head: {
    title: "Home",
  },
  methods: {
    async scrollToSection(id: string) {
      if (this.$route.hash === id)
        await this.$router.replace({
          hash: "",
        })

      await this.$router.replace({
        hash: id,
      })
    },
  },
})
</script>

<template>
  <div class="space-y-24 mb-10">
    <header
      class="rounded-md flex flex-col-reverse my-16 py-10 md:(flex-row items-center justify-between) justify-center">
      <div class="md:w-8/12">
        <div class="space-y-8">
          <div class="lg:space-y-4">
            <Status class="mt-4 flex justify-center md:justify-start" />
            <h1 class="font-semibold text-center text-lg md:(text-xl text-left) text-black/50 dark:text-white/50  mt-3 md:mt-0">
              Oğuzhan
              <span class="text-black/90 dark:text-white/90">ALTUNBEY</span>
            </h1>

            <!-- <h1
              class="md:(text-xl text-left) font-semibold text-center text-lg text-black/50 dark:text-white/50 md:text-xl mt-3 md:mt-0"
            >
              <span
                class="text-black/60 select-none dark:text-white/60 transition-colors bg-zinc-200 dark:bg-zinc-800 rounded-full align-middle py-2.5 pl-3 pr-4 gap-1 inline-flex items-center w-max font-medium"
              >
                <SmartImage
                  src="/assets/icons/gir-photoaidcom-cropped-min.png"
                  class="object-cover h-7 w-7"
                />
                oguzhan</span
              >
            </h1> -->


            <h1
              class="font-semibold text-center text-4xl md:(text-6xl text-left) text-black/90 leading-normal dark:text-white/90">
              Full-stack web<br />developer.
            </h1>
          </div>

          <div class="flex items-center justify-center md:justify-start gap-x-3 gap-y-2 flex-wrap">
            <Button v-for="item in ['TypeScript', 'Vue.js', 'React.js']" :key="item" class="inline-block" v-tippy="{
              content: item, placement: 'bottom',
            }">
              <IconDev :brand="item" class="h-5 w-5" />
            </Button>

            <Button v-tippy="{ content: 'More', placement: 'bottom' }" @click.native="scrollToSection('#technologies')">
              <IconEllipsis class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div class="rounded-full mx-auto mb-4 md:mb-0">
        <img src="src/static/assets/icons/memoji.png" class="rounded-full h-50 w-50" />
      </div>
    </header>

    <section id="pages">
      <Title>Pages</Title>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <Card v-for="(card, index) in cards.pages" :key="`card-p-${index}`" :title="card.title" :href="card.href">
          {{ card.description }}
        </Card>
      </div>
    </section>

    <section id="me">
      <Title>Me</Title>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <Card v-for="(card, index) in cards.me" :key="`card-m-${index}`" :title="card.title" :href="card.href">
          {{ card.description }}
        </Card>
      </div>
    </section>

    <section id="experiences" class="grid gap-x-8 gap-y-24 md:grid-cols-2">
      <div>
        <div class="flex items-center gap-4 justify-between">
          <Title>Experience</Title>
          <button type="button" class="text-black/50 text-sm hover:underline dark:text-white/30"
            @click="showExtra.jobs = !showExtra.jobs">
            {{ showExtra.jobs ? "show less" : "show more" }}
          </button>
        </div>

        <div class="mt-4 grid gap-2">
          <CardExperience v-for="(experience, index) in experiences.jobs"
            v-show="experience.isHidden ? showExtra.jobs : true" :key="`experience-job-${index}`"
            :title="experience.title" :url="experience.url" :hidden-badge="experience.isHidden" :date="experience.date"
            :position="experience.position" />
        </div>
      </div>

      <div>
        <div class="flex items-center gap-4 justify-between">
          <Title>Education</Title>
          <button type="button" class="text-black/50 text-sm hover:underline dark:text-white/30"
            @click="showExtra.education = !showExtra.education">
            {{ showExtra.education ? "show less" : "show more" }}
          </button>
        </div>

        <div class="mt-4 grid gap-2">
          <CardExperience v-for="(experience, index) in experiences.education"
            v-show="experience.isHidden ? showExtra.education : true" :key="`experience-education-${index}`"
            :title="experience.title" :url="experience.url" :hidden-badge="experience.isHidden" :date="experience.date"
            :position="experience.position" />
        </div>
      </div>
    </section>

    <section id="technologies">
      <Title>Technologies I use</Title>

      <div class="flex flex-col space-y-6 mt-8">
        <section v-for="category in skills" :key="category.title">
          <h5
            class="text-sm uppercase text-black/50 pb-2 mb-4 border-b border-black/5 dark:(text-white/30 border-white/5)">
            {{ category.title }}
          </h5>

          <div class="grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 gap-x-2 gap-y-2">
            <CardSkill v-for="(skill, index) in category.items" :key="`skill-${index}`"
              v-bind="typeof skill === 'object' ? skill : { title: skill }" />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.description-link {
  @apply border-neutral-500 border-b-2 border-opacity-50 hover:border-opacity-75;
}
</style>
