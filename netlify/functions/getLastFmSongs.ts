import { Handler } from "@netlify/functions"
import SpotifyWebApi from "spotify-web-api-node"

// Set through Netlify environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  refreshToken: SPOTIFY_REFRESH_TOKEN,
})

const handler: Handler = async () => {
  try {
    // Refresh access token
    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])

    // Fetch user info, top tracks, and recent tracks
    const [userInfo, topTracks, recentTracks] = await Promise.all([
      spotifyApi.getMe(),
      spotifyApi.getMyTopTracks({ limit: 6, time_range: 'short_term' }),
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 15 }),
    ])

    // Origin for CORS
    const origin =
      process.env.NODE_ENV === "production"
        ? "oguzaltnby.com"
        : "http://localhost:3000"

    // Map track function
    const mapTrack = (track: any) => {
      const object: any = {
        artist: track.artists.map((artist: any) => artist.name).join(", "),
        name: track.name,
        image: track.album.images.find((image: any) => image.width === 300)?.url,
        url: track.external_urls.spotify,
        date: track.added_at,
      }

      return object
    }

    // Formatted user info
    const formattedUserInfo = {
      name: userInfo.body.display_name,
      image: userInfo.body.images?.find((image: any) => image.width === 300)?.url ?? '',
      url: userInfo.body.external_urls.spotify,
    }

    // Return
    return {
      statusCode: 200,
      error: false,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify({
        user: formattedUserInfo,
        recentTracks: recentTracks.body.items.map((item: any) => mapTrack(item.track)) || [],
        topTracks: topTracks.body.items.map(mapTrack) || [],
      }),
    }
  } catch (error: any) {
    console.log(error)

    return {
      error: true,
      statusCode: error.statusCode || 500,
      message: error.message,
    }
  }
}

export { handler }
