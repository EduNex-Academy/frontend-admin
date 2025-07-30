/**
 * OAuth utilities for handling authentication flows
 */

export class OAuthUtils {
  /**
   * Extract OAuth parameters from URL
   */
  static extractOAuthParams(): {
    code: string | null
    state: string | null
    error: string | null
    error_description: string | null
  } {
    if (typeof window === 'undefined') {
      return { code: null, state: null, error: null, error_description: null }
    }

    const urlParams = new URLSearchParams(window.location.search)
    return {
      code: urlParams.get('code'),
      state: urlParams.get('state'),
      error: urlParams.get('error'),
      error_description: urlParams.get('error_description')
    }
  }
}
