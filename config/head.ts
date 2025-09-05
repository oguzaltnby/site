import { NuxtOptionsHead } from "@nuxt/types/config/head"

/* Define constants */
const image = "https://oguzaltnby.com/assets/icons/icon.ico"
const description =
  "Young information technologies student from Turkey, interested in languages, gaming and programming"

const Head: NuxtOptionsHead = {
  title: "Oğuzhan",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: description,
    },


    /* Others */
    {
      hid: "theme-color",
      name: "theme-color",
      content: "#171717",
    },
  ].map((i) => {
    // @ts-ignore-next-line
    if (i.name && !i.property) i.property = i.name
    return i
  }),
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "https://oguzaltnby.com/assets/icons/icon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "https://oguzaltnby.com/assets/icons/icon.png",
    },
    {
      rel: "search",
      type: "application/opensearchdescription+xml",
      title: "Oguzhan's Blog",
      href: "https://oguzaltnby.com/opensearch.xml",
    },
  ],
}

export default Head
