<script lang="ts">
import Vue from "vue"
import SpotifyWebApi from 'spotify-web-api-node'

/* Import types */
import type { Song, SongMetadata } from "../plugins/Firebase"

export default Vue.extend({
  data() {
    const selected: Song = {
      date: null,
      url: null,
      spotifyUrl: null,
      metadata: {
        title: null,
        artist: null,
        thumbnail: null,
      },
    }

    return {
      iframeLoaded: false,
      today: new Date(),
      selected,
      songs: [] as Song[],
      spotifyTracks: [] as any[], // Spotify'dan çekilen şarkılar için
    }
  },
  fetchOnServer: false,
  async fetch() {
    const songs = await this.$getDaily(10)

    this.selected = songs[0]
    this.songs = songs || []

    // Spotify API'den şarkı verilerini çekme
    await this.fetchSpotifyTracks()
  },
  methods: {
    async fetchSpotifyTracks() {
      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.VUE_APP_SPOTIFY_CLIENT_ID,
        clientSecret: process.env.VUE_APP_SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.VUE_APP_REDIRECT_URI
      })

      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (!code) {
        // Redirect to Spotify authorization URL
        const scopes = [
          'user-read-private',
          'user-read-email',
          'user-top-read',
          'user-read-recently-played'
        ]
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.VUE_APP_SPOTIFY_CLIENT_ID}&scope=${scopes.join('%20')}&redirect_uri=${encodeURIComponent(process.env.VUE_APP_REDIRECT_URI)}`
        window.location.href = authUrl
      } else {
        try {
          // Get access token using authorization code
          const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(`${process.env.VUE_APP_SPOTIFY_CLIENT_ID}:${process.env.VUE_APP_SPOTIFY_CLIENT_SECRET}`)
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.env.VUE_APP_REDIRECT_URI)}`
          })
          const tokenData = await tokenResponse.json()
          spotifyApi.setAccessToken(tokenData.access_token)

          // Spotify'dan belirli şarkıları çekme
          const trackIds = ['3n3Ppam7vgaVa1iaRUc9Lp', '7ouMYWpwJ422jRcDASZB7P'] // Örnek şarkı ID'leri
          const tracksResponse = await spotifyApi.getTracks(trackIds)
          this.spotifyTracks = tracksResponse.body.tracks
        } catch (error) {
          console.error('Error fetching data from Spotify API:', error)
          this.$fetchState.error = true // Hata durumunu ayarla
        }
      }
    }
  },
  head() {
    const title = "Song Recommendations"
    const description =
      "Looking for someone else's song recommendations? Here it is! I built a system just for you: Fresh, new songs every day!"
    const image = "https://oguzaltnby.com/assets/meta/images/daily.jpg"

    return {
      title,
      meta: this.$prepareMeta({
        title,
        description,
        image,
        keywords: "daily, song, recommendation",
        url: "https://oguzaltnby.com/daily",
      }),
      link: [
        {
          rel: "canonical",
          href: "https://oguzaltnby.com/daily",
        },
      ],
    }
  },
  computed: {
    /**
     * Returns the selected song's ID, if none present, returns a fireplace video ID instead.
     */
    getSelectedSong(): { youtube: string; spotify: string | null } {
      const { url, spotifyUrl } = this.selected

      return {
        youtube: url || "ZY3J3Y_OU0w",
        spotify: spotifyUrl || null,
      }
    },
    /**
     * Returns the metadata of the selected song.
     */
    getSelectedSongMetadata(): SongMetadata {
      return this.selected?.metadata
    },
    /**
     * Return boolean if there's no selected song for today.
     */
    isThereNoSongToday(): boolean {
      if (!this.songs?.[0]?.date) return false

      const today = this.$moment(this.$getTurkeyTime()).format("DD/MM/YYYY")
      const latestSongDate = this.$moment(this.songs[0]?.date)
        .utcOffset(3)
        .format("DD/MM/YYYY")

      console.log(latestSongDate)

      if (today !== latestSongDate) return true
      else return false
    },
    /**
     * Returns the selected song's title.
     */
    getSelectedTitle(): string {
      return this.selected?.metadata?.title || "Unknown"
    },
    /**
     * Returns the selected song's date in locale format.
     */
    getSelectedDateTitle(): string {
      return (
        this.$moment(this.selected?.date).utcOffset(3).format("DD/MM/YYYY") ||
        "Unknown"
      )
    },
    /**
     * Returns the array of the songs without the currently selected one in it.
     */
    getSongList(): Song[] {
      return this.songs.filter((song: Song) => song.date !== this.selected.date)
    },
  },
})
</script>

<template>
  <div class="space-y-4 my-10">
    <BlogNotification v-if="isThereNoSongToday === true" type="warning">
      There's no song for today, check back later or wait for the next day until
      I find some time to add new songs! You can listen to the older ones if you
      wish to!
    </BlogNotification>

    <div class="space-y-12">
      <div class="space-y-6 gap-6 grid-cols-2 md:space-y-0 md:grid">
        <div class="space-y-4">
          <SkeletonLoader
            type="iframe"
            :iframe-url="
              $fetchState.pending === false &&
              `https://www.youtube.com/embed/oakWgLqCwUc`
            "
            class="h-[30vh] w-full md:h-full"
          />
        </div>

        <div class="space-y-2 w-full">
          <Card>
            <Title :padding="false"> Title </Title>

            <SkeletonLoader
              v-if="$fetchState.pending || $fetchState.error"
              class="bg-gray-300 h-6 w-2/4 dark:bg-neutral-700"
            />

            <span v-else class="text-gray-700 truncate dark:text-gray-300">{{
              getSelectedTitle
            }}</span>
          </Card>

          <Card>
            <Title :padding="false"> Artist </Title>

            <SkeletonLoader
              v-if="$fetchState.pending || $fetchState.error"
              class="bg-gray-300 h-6 w-1/4 dark:bg-neutral-700"
            />

            <span v-else class="text-gray-700 truncate dark:text-gray-300">{{
              getSelectedSongMetadata.artist || "Unknown"
            }}</span>
          </Card>

          <Card>
            <Title :padding="false"> Date </ Title>

            <SkeletonLoader
              v-if="$fetchState.pending || $fetchState.error"
              class="bg-gray-300 h-6 w-2/4 dark:bg-neutral-700"
            />

            <span v-else class="text-gray-700 truncate dark:text-gray-300">{{
              getSelectedDateTitle
            }}</span>
          </Card>
        </div>
      </div>

      <div class="space-y-4">
        <Title>Older Songs</Title>

        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <template v-if="$fetchState.pending === true">
            <SkeletonLoader
              v-for="item in 9"
              :key="`skeleton-song-${item}`"
              type="song"
            />
          </template>

          <div
            v-else-if="$fetchState.error"
            class="text-black/50 dark:text-white/30 sm:col-span-2 md:col-span-3"
          >
            Something went wrong while fetching songs from Firebase.
          </div>

          <template v-else>
            <CardSong
              v-for="(song, index) in getSongList"
              :key="`song-${index}`"
              :title="song.metadata.title"
              :date="song.date"
              :thumbnail="
                song.metadata.thumbnail || 'http://via.placeholder.com/75'
              "
              class="overflow-x-hidden"
              @click.native="selected = song"
            />
          </template>
        </div>
      </div>

      <div class="space-y-4">
        <Title>Spotify Songs</Title>

        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <template v-if="$fetchState.pending === true">
            <SkeletonLoader
              v-for="item in 9"
              :key="`skeleton-spotify-song-${item}`"
              type="song"
            />
          </template>

          <div
            v-else-if="$fetchState.error"
            class="text-black/50 dark:text-white/30 sm:col-span-2 md:col-span-3"
          >
            Something went wrong while fetching songs from Spotify.
          </div>

          <template v-else>
            <CardSong
              v-for="(track, index) in spotifyTracks"
              :key="`spotify-song-${index}`"
              :title="track.name"
              :date="track.album.release_date"
              :thumbnail="track.album.images[0]?.url || 'http://via.placeholder.com/75'"
              class="overflow-x-hidden"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
