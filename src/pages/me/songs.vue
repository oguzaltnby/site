<script lang="ts">
import Vue from "vue"
import axios from "axios"

/* Interfaces */
import type { SponsorLinks } from "~/@types/runtimeConfig"
import type { ISponsor } from "@/types/Response/Sponsors"

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  id: string;
  duration_ms: number;
}

interface SpotifyArtist {
  name: string;
  images: { url: string }[];
  id: string;
  genres: string[];
}

interface SpotifyUser {
  display_name: string;
  images: { url: string }[];
  birthdate?: string;
  email?: string;
  country?: string;
  followers: { total: number };
}

export default Vue.extend({
  data() {
    return {
      spotifyData: [] as SpotifyTrack[], // En çok dinlenen şarkı bilgilerini tutacak
      topArtists: [] as SpotifyArtist[], // En çok dinlenen sanatçı bilgilerini tutacak
      userProfile: null as SpotifyUser | null, // Kullanıcı profil bilgilerini tutacak
      currentlyPlaying: null as SpotifyTrack | null, // Şu anda dinlenen şarkı bilgilerini tutacak
      progressMs: 0, // Şu anda dinlenen şarkının ilerleme süresi
      loading: true, // Yüklenme durumu
      error: null, // Hata durumu
      intervalId: null as number | null, // Zamanlayıcı ID'si
      fetchIntervalId: null as number | null, // API sorgulama zamanlayıcı ID'si
      isPlaying: false, // Şarkının çalıp çalmadığını takip eder
    };
  },
  async mounted() {
    const code = this.getCodeFromRedirect();
    if (code) {
      try {
        const token = await this.getAccessToken(code);
        await Promise.all([
          this.fetchTopTracks(token),
          this.fetchTopArtists(token),
          this.fetchUserProfile(token),
          this.fetchCurrentlyPlaying(token),
        ]);
        this.startProgressTimer();
        this.startFetchTimer(token);
      } catch (error) {
        this.error = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        console.error("Error fetching Spotify data:", error);
      } finally {
        this.loading = false;
      }
    } else {
      this.redirectToSpotify();
    }
  },
  beforeDestroy() {
    this.stopProgressTimer();
    this.stopFetchTimer();
  },
  methods: {
    redirectToSpotify() {
      const clientId = "757572ca119c49fdac93aa5a8398985c";
      const redirectUri = "https://oguzaltnby.com/me/songs";
      const scopes = "user-top-read user-read-private user-read-currently-playing";
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(scopes)}`;
      window.location.href = authUrl;
    },

    getCodeFromRedirect() {
      const params = new URLSearchParams(window.location.search);
      return params.get("code");
    },

    async getAccessToken(code: string) {
      const clientId = "757572ca119c49fdac93aa5a8398985c";
      const clientSecret = "1a887fadb2a942f985ca9136064e882e";
      const redirectUri = "https://oguzaltnby.com/me/songs";

      const tokenResponse = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      return tokenResponse.data.access_token;
    },

    async fetchTopTracks(token: string) {
      const response = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/top/tracks?limit=8&time_range=short_term",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.spotifyData = response.data.items; // En çok dinlenen şarkıları sakla
    },

    async fetchTopArtists(token: string) {
      const response = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/top/artists?limit=8&time_range=short_term",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.topArtists = response.data.items; // En çok dinlenen sanatçıları sakla
    },

    async fetchUserProfile(token: string) {
      const response = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.userProfile = response.data; // Kullanıcı profil bilgilerini sakla
    },

    async fetchCurrentlyPlaying(token: string) {
      const response = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.item) {
        this.currentlyPlaying = response.data.item; // Şu anda dinlenen şarkıyı sakla
        this.progressMs = response.data.progress_ms; // Şu anda dinlenen şarkının ilerleme süresini sakla
        this.isPlaying = !response.data.is_playing; // Şarkının çalıp çalmadığını sakla
        if (this.isPlaying) {
          this.startProgressTimer();
        } else {
          this.stopProgressTimer();
        }
      }
    },

    startProgressTimer() {
      this.intervalId = window.setInterval(() => {
        if (this.currentlyPlaying && this.progressMs < this.currentlyPlaying.duration_ms) {
          this.progressMs += 1000;
        }
      }, 1000);
    },

    stopProgressTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    startFetchTimer(token: string) {
      this.fetchIntervalId = window.setInterval(async () => {
        await this.fetchCurrentlyPlaying(token);
      }, 5000); // Her 5 saniyede bir API'yi sorgula
    },

    stopFetchTimer() {
      if (this.fetchIntervalId) {
        clearInterval(this.fetchIntervalId);
        this.fetchIntervalId = null;
      }
    },

    formatTime(ms: number) {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds.padStart(2, '0')}`;
    },
  },
});
</script>

<template>
  <PageLayout
    title="Songs"
    description="My most listened songs from Spotify"
    class="space-y-12"
  >
    <div v-if="loading" class="text-center py-4">Şarkılar yükleniyor...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <div v-else>
      <section class="mb-12">
        <Title class="mb-4">Details</Title>

        <div class="grid gap-x-0 gap-y-4 md:gap-x-12 md:grid-cols-2">
          <!-- Profile -->
          <div class="flex space-x-4 items-center justify-between">
            <span>Profile</span>

            <div class="flex space-x-2 items-center">
              <SmartLink href="https://open.spotify.com/user/312wvb5u6ucb63mxsuugcdrutvbq" class="flex-shrink-0" blank>@{{
                userProfile?.display_name }}
              </SmartLink>

              <SmartImage v-if="userProfile && userProfile.images.length" :src="userProfile.images[0].url"
                class="rounded-full h-6 w-6" />
            </div>
          </div>
          <div class="flex space-x-4 items-center justify-between">
            <span>Followers</span>
            <div class="flex space-x-2 items-center">
              <span class="flex-shrink-0">{{ userProfile?.followers.total }}</span>
              <IconFire class="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      <section v-if="currentlyPlaying" id="current-playing" class="mb-12">
        <Title class="mb-4">Currently Playing</Title>
        <div class="grid gap-x-4 gap-y-2 md:grid-cols-2">
          <div class="relative flex items-center">
            <CardLastFm
              v-if="currentlyPlaying"
              :name="currentlyPlaying?.name"
              :key="currentlyPlaying?.id"
              :artist="currentlyPlaying.artists[0].name"
              :image="currentlyPlaying?.album.images[0].url"
              :url="'https://open.spotify.com/track/' + currentlyPlaying?.id"
              class="flex-grow"
            />
            <!-- Sağ tarafa eklenen oynatma animasyonu -->
            <div class="playing-bars absolute right-4">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
            <!-- Şarkının ilerleme süresi -->
            <div class="absolute right-16 text-sm text-gray-500">
              {{ formatTime(progressMs) }} / {{ formatTime(currentlyPlaying?.duration_ms) }}
            </div>
          </div>
        </div>
      </section>

      <section id="top-songs">
        <Title class="mb-4">Top Songs (last 7 days)</Title>

        <div class="grid gap-x-4 gap-y-2 md:grid-cols-2">
          <CardLastFm
            v-for="track in spotifyData.slice(0, 8)"
            :name="track.name"
            :key="track.id"
            :artist="track.artists[0].name"
            :image="track.album.images[0].url"
            :url="'https://open.spotify.com/track/' + track.id"
            class="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </section>

      <section id="top-artists" class="mt-12">
        <Title class="mb-4">Top Artists (last 7 days)</Title>

        <div class="grid gap-x-4 gap-y-2 md:grid-cols-2">
          <CardLastFm
            v-for="artist in topArtists.slice(0, 8)"
            :name="artist.name"
            :key="artist.id"
            :image="artist.images[0].url"
            :url="'https://open.spotify.com/artist/' + artist.id"
            class="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
.playing-bars {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.bar {
  width: 4px;
  height: 10px;
  background-color: #1db954;
  margin: 0 2px;
  animation: bounce 1s infinite;
}

.bar:nth-child(2) {
  animation-delay: 0.2s;
}

.bar:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}
</style>
