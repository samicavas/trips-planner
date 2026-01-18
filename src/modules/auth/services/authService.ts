import { supabaseClient } from '@/src/shared/services/supabase';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession()

export interface AuthError {
    message: string;
    code?: string;
}

export interface AuthResponse {
    success: boolean;
    data?: any;
    error?: AuthError;
}


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
                message: 'Error occurred during sign up',
            },
        };
    }
};

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
                message: 'Error occurred during sign in',
            },
        };
    }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
    try {
        const redirectUrl = Linking.createURL('/oauth');

        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: false,
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
                    message: 'OAuth URL not available',
                },
            };
        }
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
            {
                showInRecents: true,
                dismissButtonStyle: 'close',
            }
        );


        if (result.type === 'success') {
            const url = result.url;

            if (url) {
                try {
                    // Parse the returned URL to extract session tokens
                    const urlObj = new URL(url);
                    const fragmentParams = new URLSearchParams(urlObj.hash.substring(1));

                    const accessToken = fragmentParams.get('access_token');
                    const refreshToken = fragmentParams.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { data: sessionData, error: sessionError } =
                            await supabaseClient.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                            });

                        if (sessionError) {
                            console.error('Session error:', sessionError);
                            return {
                                success: false,
                                error: {
                                    message: 'Failed to create session',
                                },
                            };
                        }

                        if (sessionData?.session) {
                            return {
                                success: true,
                                data: {
                                    session: sessionData.session,
                                    user: sessionData.session.user
                                },
                            };
                        }
                    } else {
                        console.warn('No tokens in callback URL');
                        const { data: userData } = await supabaseClient.auth.getSession();
                        if (userData?.session) {
                            return {
                                success: true,
                                data: {
                                    session: userData.session,
                                    user: userData.session.user
                                },
                            };
                        }
                    }
                } catch (parseError) {
                    console.error('URL parse error:', parseError);
                    const { data: userData } = await supabaseClient.auth.getSession();
                    if (userData?.session) {
                        return {
                            success: true,
                            data: {
                                session: userData.session,
                                user: userData.session.user
                            },
                        };
                    }
                    return {
                        success: false,
                        error: {
                            message: 'Error processing authentication',
                        },
                    };
                }
            }
        } else if (result.type === 'cancel' || result.type === 'dismiss') {
            return {
                success: false,
                error: {
                    message: 'Google sign-in cancelled',
                },
            };
        }

        return {
            success: false,
            error: {
                message: 'Unknown error occurred during Google sign-in',
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: 'Error occurred during Google sign-in',
            },
        };
    }
};

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
                message: 'Session could not be retrieved',
            },
        };
    }
};

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
                message: 'Error occurred during sign out',
            },
        };
    }
};
