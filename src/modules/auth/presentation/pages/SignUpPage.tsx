import { SignUpFormValues, signUpSchema } from '@/src/modules/auth/data/schemas/auth.schemas';
import { authStyles } from '@/src/modules/auth/presentation/styles/auth.styles';
import { signUpWithEmail } from '@/src/modules/auth/services/authService';
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

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate form data with Zod
    const validateForm = (values: SignUpFormValues) => {
        try {
            signUpSchema.parse(values);
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

    // Handle sign-up
    const handleSignUp = async (values: SignUpFormValues) => {
        try {
            setLoading(true);
            const response = await signUpWithEmail(values.email, values.password);

            if (response.success) {
                Alert.alert(
                    'Success',
                    'Registration successful! Please check your email.',
                    [
                        {
                            text: 'Back to Sign In',
                            onPress: () => router.back(),
                        },
                    ]
                );
            } else {
                Alert.alert('Hata', response.error?.message || 'Kayıt işlemi başarısız');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during registration');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={authStyles.container}>
            <View style={authStyles.authPageContainer}>
                {/* Logo/Header */}
                <View style={authStyles.signInHeaderContainer}>
                    <Text style={authStyles.authLogo}>
                        Trips Planner
                    </Text>
                    <Text style={authStyles.authSubtitle}>Create Account</Text>
                </View>

                {/* Sign Up Form */}
                <Formik
                    initialValues={{ email: '', password: '', confirmPassword: '' }}
                    validate={validateForm}
                    onSubmit={handleSignUp}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={authStyles.signUpFormContainer}>
                            {/* Email Input */}
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

                            {/* Confirm Password Input */}
                            <View style={authStyles.fieldContainer}>
                                <Text style={authStyles.fieldLabel}>
                                    Confirm Password
                                </Text>
                                <View style={authStyles.passwordInputContainer}>
                                    <TextInput
                                        style={[
                                            authStyles.input,
                                            authStyles.passwordInputStyle,
                                            touched.confirmPassword && errors.confirmPassword && authStyles.inputError,
                                        ]}
                                        placeholder="Re-enter your password"
                                        placeholderTextColor="#999"
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                        editable={!loading}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        style={authStyles.passwordToggleButton}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Text style={authStyles.passwordToggleIcon}>
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={authStyles.error}>{errors.confirmPassword}</Text>
                                )}
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[authStyles.button, loading && authStyles.buttonDisabled]}
                                onPress={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={authStyles.buttonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>

                            {/* Sign In Link */}
                            <View style={authStyles.signUpLinkContainer}>
                                <Text style={authStyles.signUpLinkText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text style={authStyles.signUpLinkButton}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>

            </View>
        </ScrollView>
    );
}
