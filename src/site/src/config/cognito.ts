// Cognito設定（環境変数から取得）
export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  domain: import.meta.env.VITE_COGNITO_DOMAIN,
  redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin,
  region: import.meta.env.VITE_COGNITO_REGION || 'ap-northeast-1',
}

// Cognito Hosted UI URLs
export const getGoogleLoginUrl = () => {
  const { domain, clientId, redirectUri } = cognitoConfig
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: redirectUri,
    identity_provider: 'Google',
  })
  return `https://${domain}/oauth2/authorize?${params.toString()}`
}

export const getLogoutUrl = () => {
  const { domain, clientId } = cognitoConfig
  const logoutRedirectUri = import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin + import.meta.env.BASE_URL + 'login'
  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutRedirectUri,
  })
  return `https://${domain}/logout?${params.toString()}`
}

export const getTokenUrl = () => {
  return `https://${cognitoConfig.domain}/oauth2/token`
}
