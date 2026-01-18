import { supabaseClient } from '@/src/shared/services/supabase';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: AuthError;
}

/**
 * Sign in with email OTP (Magic Link)
 */
export const signInWithEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const redirectUrl = Linking.createURL('/');
    
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      data: { email },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Email giriş işlemi sırasında bir hata oluştu',
      },
    };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: Linking.createURL('/'),
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Kayıt işlemi sırasında bir hata oluştu',
      },
    };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Giriş işlemi sırasında bir hata oluştu',
      },
    };
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const redirectUrl = Linking.createURL('/');
    console.log('Redirect URL:', redirectUrl);

    // Sign in with OAuth
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    if (!data?.url) {
      return {
        success: false,
        error: {
          message: 'OAuth URL alınamadı',
        },
      };
    }

    console.log('OAuth URL:', data.url);

    // Open the URL in web browser
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    console.log('WebBrowser result:', result);

    if (result.type === 'success') {
      // Extract the URL from the result
      const url = result.url;
      console.log('Callback URL:', url);

      if (url) {
        try {
          // Parse the URL to get the token data
          const urlObj = new URL(url);
          const fragmentParams = new URLSearchParams(
            urlObj.hash.substring(1)
          );
          const accessToken = fragmentParams.get('access_token');
          const refreshToken = fragmentParams.get('refresh_token');

          if (accessToken) {
            // Create session from tokens
            const { data: sessionData, error: sessionError } =
              await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

            if (sessionError) {
              console.error('Session error:', sessionError);
              return {
                success: false,
                error: {
                  message: 'Oturum oluşturulamadı',
                },
              };
            }

            if (sessionData?.session) {
              console.log('Session created:', sessionData.session.user.email);
              return {
                success: true,
                data: { session: sessionData.session },
              };
            }
          }
        } catch (parseError) {
          console.error('URL parse error:', parseError);
          return {
            success: false,
            error: {
              message: 'Callback URL işlenirken hata oluştu',
            },
          };
        }
      }
    } else if (result.type === 'cancel' || result.type === 'dismiss') {
      console.log('OAuth cancelled');
      return {
        success: false,
        error: {
          message: 'Google giriş iptal edildi',
        },
      };
    }

    return {
      success: false,
      error: {
        message: 'Bilinmeyen hata oluştu',
      },
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: {
        message: 'Google giriş işlemi sırasında bir hata oluştu',
      },
    };
  }
};

/**
 * Get current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    return {
      success: true,
      data: data.session,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Session alınamadı',
      },
    };
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Çıkış işlemi sırasında hata oluştu',
      },
    };
  }
};
