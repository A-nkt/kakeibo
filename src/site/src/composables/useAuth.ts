import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cognitoConfig, getGoogleLoginUrl, getLogoutUrl, getTokenUrl } from '@/config/cognito'

interface UserInfo {
  email: string
  name?: string
  picture?: string
}

const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
const idToken = ref<string | null>(localStorage.getItem('idToken'))
const userInfo = ref<UserInfo | null>(null)
const isLoading = ref(false)

// 初期化時にユーザー情報を復元
const storedUserInfo = localStorage.getItem('userInfo')
if (storedUserInfo) {
  try {
    userInfo.value = JSON.parse(storedUserInfo)
  } catch {
    localStorage.removeItem('userInfo')
  }
}

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!accessToken.value)
  const currentUser = computed(() => userInfo.value)

  // Google認証ページへリダイレクト
  const loginWithGoogle = () => {
    window.location.href = getGoogleLoginUrl()
  }

  // 認証コードをトークンに交換
  const handleAuthCallback = async (code: string) => {
    isLoading.value = true

    try {
      const response = await fetch(getTokenUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: cognitoConfig.clientId,
          code,
          redirect_uri: cognitoConfig.redirectUri,
        }),
      })

      if (!response.ok) {
        throw new Error('Token exchange failed')
      }

      const tokens = await response.json()

      // トークンを保存
      accessToken.value = tokens.access_token
      idToken.value = tokens.id_token
      localStorage.setItem('accessToken', tokens.access_token)
      localStorage.setItem('idToken', tokens.id_token)
      localStorage.setItem('isLoggedIn', 'true')

      // IDトークンからユーザー情報を取得
      const payload = parseJwt(tokens.id_token)
      console.log(payload)
      const email = payload.email ?? ''
      userInfo.value = {
        email,
        name: payload.name,
        picture: payload.picture,
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      localStorage.setItem('userEmail', email)

      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Auth callback error:', error)
      return { success: false, error }
    } finally {
      isLoading.value = false
    }
  }

  // ログアウト
  const logout = () => {
    accessToken.value = null
    idToken.value = null
    userInfo.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')

    // ログインページにリダイレクト
    router.push('/login')
  }

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    loginWithGoogle,
    handleAuthCallback,
    logout,
  }
}

// JWTをパース
function parseJwt(token: string): Record<string, string> {
  const base64Url = token.split('.')[1] ?? ''
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}
