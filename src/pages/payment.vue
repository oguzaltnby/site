<script lang="ts">
import Vue from "vue"

/* Interfaces */
import type { SponsorLinks } from "~/@types/runtimeConfig"
import type { ISponsor } from "@/types/Response/Sponsors"

export default Vue.extend({
  data() {
    return {
      sponsors: [] as ISponsor[],
      accounts: [

        {
          image: "/assets/icons/binance.png",
          name: "Binance",
          iban: "956635175",
          revealed: false,
        },
        {
          image: "/assets/icons/garanti.png",
          name: "Garanti",
          iban: "TR12 0006 2001 1510 0006 8787 43",
          revealed: false,
        },
        {
          image: "/assets/icons/isbankasi.png",
          name: "İş Bankasıı",
          iban: "TR33 0006 4000 0011 2430 3857 28",
          revealed: false,
        },
      ],
    }
  },
  fetchOnServer: false,

  head() {
    const title = "Payment"
    const description =
      "You can make your payments to me through the following banks"

    return {
      title,
      meta: this.$prepareMeta({
        title,
        description,
        keywords: "payment",
        url: "https://oguzaltnby.com/me/payment",
      }),
      link: [
        {
          rel: "canonical",
          href: "https://oguzaltnby.com/me/payment",
        },
      ],
    }
  },

})
</script>

<template>
  <PageLayout title="Payment" :description="[
    `P.S. Use 'Oğuzhan ALTUNBEY' as the name of your transactions.`,
  ]" class="space-y-12">
    <!-- <section class="space-y-4">
      <Title>Support Me On</Title>

      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <Button  blank>
          <template #icon>
            <IconBrand brand="github" class="h-5 w-5" />
          </template>

GitHub Sponsors
</Button>
</div>
</section>

<section class="space-y-4">
  <Title :padding="false">Sponsors</Title>

  <div>
    <transition name="fade" mode="out-in">
      <SkeletonLoader v-if="$fetchState.pending" type="spinner" class="w-full py-4" />

      <p v-else-if="$fetchState.error !== null">An error occured.</p>
      <p v-else-if="
              !$fetchState.pending &&
              !$fetchState.error &&
              sponsors.length === 0
            ">
        No sponsors yet :(
      </p>

      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <CardSponsor v-for="(item, index) in getSortedSponsors.monthly" :key="`sponsor-monthly-${index}`"
          :sponsor="item.sponsor" monthly />

        <CardSponsor v-for="(item, index) in getSortedSponsors.oneTime" :key="`sponsor-oneTime-${index}`"
          :sponsor="item.sponsor" />
      </div>
    </transition>
  </div>
</section> -->

    <section class="space-y-4">
      <Title>Bank Accounts</Title>

      <div class="grid gap-4">
        <div v-for="(account, index) in accounts" :key="`account-${index}`"
          class="flex h-full space-x-4 items-center rounded-lg card-base">
          <div class="rounded-lg">
            <img :src="account.image" class="rounded-lg h-12 w-12" />
          </div>

          <div class="rounded-tr rounded-br flex h-full">
            <div>
              <h3 class="font-medium text-lg">
                {{ account.name }}
              </h3>

              <span class="text-black/30 dark:text-white/30" :class="!account.revealed &&
                'hover:underline cursor-pointer select-none'
                " @click="account.revealed = true">
                {{ account.revealed ? account.iban : "Click to Reveal" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>
