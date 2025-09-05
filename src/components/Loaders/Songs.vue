<template>
  <main class="space-y-20">
    <div>
      <Title class="mb-4">Details</Title>

      <div class="grid gap-x-0 gap-y-4 md:gap-x-12 md:grid-cols-2">
        <div class="flex space-x-4 items-center">
          <span>Profile</span>

          <div class="flex space-x-2 w-full justify-end items-center">
            <SkeletonLoader v-if="!user" class="h-5 w-1/2" />
            <span v-else>{{ user.display_name }}</span>
            <SkeletonLoader v-if="!user" class="h-6 w-6 !rounded-full" />
            <img v-else :src="user.images[0]?.url" class="h-6 w-6 rounded-full" />
          </div>
        </div>

        <!-- Play count -->
        <div class="flex space-x-4 items-center justify-between">
          <span class="flex-shrink-0">Total Plays</span>

          <div class="flex space-x-2 w-full justify-end items-center">
            <SkeletonLoader v-if="!totalPlays" class="h-5 w-1/3" />
            <span v-else>{{ totalPlays }}</span>
          </div>
        </div>

        <!-- Registered -->
        <div class="flex space-x-4 items-center justify-between">
          <span class="flex-shrink-0">Account Age</span>

          <div class="flex space-x-2 w-full justify-end items-center">
            <SkeletonLoader v-if="!accountAge" class="h-5 w-1/4" />
            <span v-else>{{ accountAge }} years</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <Title class="mb-4">Top Songs (last 7 days)</Title>

      <div class="grid gap-2 md:grid-cols-2">
        <SkeletonLoader v-if="!topTracks.length" v-for="top in 6" :key="top" type="lastfm" />
        <div v-else v-for="track in topTracks" :key="track.id" class="flex items-center space-x-4">
          <img :src="track.album.images[0]?.url" class="h-12 w-12 rounded" />
          <div>
            <div>{{ track.name }}</div>
            <div class="text-sm text-gray-500">{{ track.artists.map(artist => artist.name).join(', ') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <Title class="mb-4">Top Artists (last 7 days)</Title>

      <div class="grid gap-2 md:grid-cols-2">
        <SkeletonLoader v-if="!topArtists.length" v-for="top in 4" :key="top" type="lastfm" />
        <div v-else v-for="artist in topArtists" :key="artist.id" class="flex items-center space-x-4">
          <img :src="artist.images[0]?.url" class="h-12 w-12 rounded" />
          <div>{{ artist.name }}</div>
        </div>
      </div>
    </div>

    <div>
      <Title class="mb-4">Recent Songs</Title>

      <div class="grid gap-2 md:grid-cols-2">
        <SkeletonLoader v-if="!recentTracks.length" v-for="recent in 15" :key="recent" type="lastfm" />
        <div v-else v-for="track in recentTracks" :key="track.id" class="flex items-center space-x-4">
          <img :src="track.album.images[0]?.url" class="h-12 w-12 rounded" />
          <div>
            <div>{{ track.name }}</div>
            <div class="text-sm text-gray-500">{{ track.artists.map(artist => artist.name).join(', ') }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import SpotifyWebApi from 'spotify-web-api-node'

export default {
  data() {
    return {
      user: null,
      totalPlays: null,
      accountAge: null,
      topTracks: [],
      topArtists: [],
      recentTracks: [],
    }
  },
  async created() {
    console.log('Client ID:', process.env.VUE_APP_SPOTIFY_CLIENT_ID)
    console.log('Redirect URI:', process.env.VUE_APP_REDIRECT_URI)

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
      console.log('Auth URL:', authUrl)
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

        const [userInfo, topTracks, topArtists, recentTracks] = await Promise.all([
          spotifyApi.getMe(),
          spotifyApi.getMyTopTracks({ limit: 6, time_range: 'short_term' }),
          spotifyApi.getMyTopArtists({ limit: 4, time_range: 'short_term' }),
          spotifyApi.getMyRecentlyPlayedTracks({ limit: 15 }),
        ])

        console.log('User Info:', userInfo.body)
        console.log('Top Tracks:', topTracks.body.items)
        console.log('Top Artists:', topArtists.body.items)
        console.log('Recent Tracks:', recentTracks.body.items)

        this.user = userInfo.body
        this.totalPlays = userInfo.body.followers.total
        this.accountAge = new Date().getFullYear() - new Date(userInfo.body.birthdate).getFullYear()
        this.topTracks = topTracks.body.items
        this.topArtists = topArtists.body.items
        this.recentTracks = recentTracks.body.items.map(item => item.track)
      } catch (error) {
        console.error('Error fetching data from Spotify API:', error)
      }
    }
  },
}
</script>

<style scoped>
/* Add your styles here */
</style>
