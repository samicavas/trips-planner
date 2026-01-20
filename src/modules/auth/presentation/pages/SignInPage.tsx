import { SignInFormValues, signInSchema } from '@/src/modules/auth/data/schemas/auth.schemas';
import { authStyles } from '@/src/modules/auth/presentation/styles/auth.styles';
import { signInWithGoogle, signInWithPassword } from '@/src/modules/auth/services/authService';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Validate form data with Zod
    const validateForm = (values: SignInFormValues) => {
        try {
            signInSchema.parse(values);
            return {};
        } catch (error: any) {
            const errors: Record<string, string> = {};
            if (error?.issues) {
                error.issues.forEach((issue: any) => {
                    if (issue.path[0]) {
                        errors[String(issue.path[0])] = issue.message;
                    }
                });
            }
            return errors;
        }
    };

    // Handle email + password sign-in
    const handleEmailSignIn = async (values: SignInFormValues) => {
        try {
            setLoading(true);
            const response = await signInWithPassword(values.email, values.password);

            if (response.success) {
                Alert.alert('Success', 'Signed in successfully!');
                router.replace('/screens/TripsScreen' as any);
            } else {
                Alert.alert('Error', response.error?.message || 'Sign-in failed');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during sign-in');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Google sign-in
    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            const response = await signInWithGoogle();
            if (response.success) {
                Alert.alert('Success', 'Signed in with Google successfully!');
                router.replace('/screens/TripsScreen' as any);
            } else {
                Alert.alert('Error', response.error?.message || 'Google sign-in failed');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            Alert.alert('Error', 'An error occurred during Google sign-in');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={authStyles.container}>
            <View style={authStyles.authPageContainer}>
                {/* Logo/Header */}
                <View style={authStyles.authHeaderContainer}>
                    <Text style={authStyles.authLogo}>
                        Trips Planner
                    </Text>
                    <Text style={authStyles.authSubtitle}>Plan your trips</Text>
                </View>

                {/* Email Sign In Form */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={validateForm}
                    onSubmit={handleEmailSignIn}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={authStyles.formContainer}>
                            <View style={authStyles.fieldContainer}>
                                <Text style={authStyles.fieldLabel}>
                                    Email Address
                                </Text>
                                <TextInput
                                    style={[
                                        authStyles.input,
                                        touched.email && errors.email && authStyles.inputError,
                                    ]}
                                    placeholder="example@email.com"
                                    placeholderTextColor="#999"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    editable={!loading}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {touched.email && errors.email && (
                                    <Text style={authStyles.error}>{errors.email}</Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View style={authStyles.fieldContainer}>
                                <Text style={authStyles.fieldLabel}>
                                    Password
                                </Text>
                                <View style={authStyles.passwordInputContainer}>
                                    <TextInput
                                        style={[
                                            authStyles.input,
                                            authStyles.passwordInputStyle,
                                            touched.password && errors.password && authStyles.inputError,
                                        ]}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        editable={!loading}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        style={authStyles.passwordToggleButton}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Text style={authStyles.passwordToggleIcon}>
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={authStyles.error}>{errors.password}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[authStyles.button, loading && authStyles.buttonDisabled]}
                                onPress={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={authStyles.buttonText}>Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                {/* Divider */}
                <View style={authStyles.authDividerContainer}>
                    <View style={authStyles.authDividerLine} />
                    <Text style={authStyles.authDividerText}>or</Text>
                    <View style={authStyles.authDividerLine} />
                </View>

                {/* Google Sign In Button */}
                <TouchableOpacity
                    style={[authStyles.googleButton, googleLoading && authStyles.buttonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator color="#1f2937" />
                    ) : (
                        <>
                            <Text style={authStyles.googleButtonText}>Sign in with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={authStyles.signUpLinkContainer}>
                    <Text style={authStyles.signUpLinkText}>Don't have an account yet? </Text>
                    <TouchableOpacity onPress={() => router.push('/screens/SignUpScreen' as any)}>
                        <Text style={authStyles.signUpLinkButton}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
