import { AddTripFormValues, addTripSchema } from '@/src/modules/trips/data/schemas/trip.schemas';
import { tripsStyles } from '@/src/modules/trips/presentation/styles/trips.styles';
import { insertTrip } from '@/src/modules/trips/services/tripsService';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddTripPage() {
    const [loading, setLoading] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
    const startDatePickerRef = useRef<BottomSheetModal>(null);
    const endDatePickerRef = useRef<BottomSheetModal>(null);
    const router = useRouter();

    const handleOpenStartDatePicker = useCallback((currentDate: string) => {
        setTempStartDate(new Date(currentDate));
        startDatePickerRef.current?.present();
    }, []);

    const handleOpenEndDatePicker = useCallback((currentDate: string) => {
        setTempEndDate(new Date(currentDate));
        endDatePickerRef.current?.present();
    }, []);

    const validateForm = (values: AddTripFormValues) => {
        try {
            addTripSchema.parse(values);
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

    const handleAddTrip = async (values: AddTripFormValues) => {
        try {
            setLoading(true);
            const response = await insertTrip({
                title: values.title,
                destination: values.destination,
                description: values.description,
                start_date: values.startDate,
                end_date: values.endDate,
            });

            if (response.success) {
                Alert.alert('Success', 'Trip plan created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]);
            } else {
                Alert.alert('Error', response.error || 'Trip could not be added');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while adding the trip');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={tripsStyles.scrollViewContainer}>
            <View style={tripsStyles.pageContainer}>
                {/* Header */}
                <View style={tripsStyles.addTripHeaderContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={tripsStyles.headerBackButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={tripsStyles.addTripHeaderTitle}>New Trip Plan</Text>
                    <View style={tripsStyles.headerSpacer} />
                </View>

                {/* Form */}
                <Formik
                    initialValues={{
                        title: '',
                        destination: '',
                        description: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                    }}
                    validate={validateForm}
                    onSubmit={handleAddTrip}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                    }) => (
                        <View style={tripsStyles.formContainer}>
                            {/* Title Input */}
                            <View style={tripsStyles.fieldContainer}>
                                <Text style={tripsStyles.fieldLabel}>
                                    Title *
                                </Text>
                                <TextInput
                                    style={[
                                        tripsStyles.input,
                                        touched.title && errors.title && tripsStyles.inputError,
                                    ]}
                                    placeholder="e.g., Summer Vacation"
                                    placeholderTextColor="#999"
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                    editable={!loading}
                                />
                                {touched.title && errors.title && (
                                    <Text style={tripsStyles.error}>{errors.title}</Text>
                                )}
                            </View>

                            {/* Destination Input */}
                            <View style={tripsStyles.fieldContainer}>
                                <Text style={tripsStyles.fieldLabel}>
                                    Destination *
                                </Text>
                                <TextInput
                                    style={[
                                        tripsStyles.input,
                                        touched.destination && errors.destination && tripsStyles.inputError,
                                    ]}
                                    placeholder="e.g., Paris, France"
                                    placeholderTextColor="#999"
                                    onChangeText={handleChange('destination')}
                                    onBlur={handleBlur('destination')}
                                    value={values.destination}
                                    editable={!loading}
                                />
                                {touched.destination && errors.destination && (
                                    <Text style={tripsStyles.error}>{String(errors.destination)}</Text>
                                )}
                            </View>

                            {/* Description Input */}
                            <View style={tripsStyles.fieldContainer}>
                                <Text style={tripsStyles.fieldLabel}>
                                    Description
                                </Text>
                                <TextInput
                                    style={[
                                        tripsStyles.input,
                                        tripsStyles.descriptionInput,
                                        touched.description && errors.description && tripsStyles.inputError,
                                    ]}
                                    placeholder="Add notes about the trip..."
                                    placeholderTextColor="#999"
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                    editable={!loading}
                                    multiline
                                    numberOfLines={4}
                                />
                                {touched.description && errors.description && (
                                    <Text style={tripsStyles.error}>{errors.description}</Text>
                                )}
                            </View>

                            {/* Start Date Picker */}
                            <View style={tripsStyles.fieldContainer}>
                                <Text style={tripsStyles.fieldLabel}>
                                    Start Date *
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        tripsStyles.datePickerButton,
                                        touched.startDate && errors.startDate && tripsStyles.datePickerButtonError,
                                    ]}
                                    onPress={() => handleOpenStartDatePicker(values.startDate)}
                                    disabled={loading}
                                >
                                    <Text style={tripsStyles.datePickerText}>
                                        {new Date(values.startDate).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <Text style={tripsStyles.datePickerIcon}>📅</Text>
                                </TouchableOpacity>
                                {touched.startDate && errors.startDate && (
                                    <Text style={tripsStyles.error}>{errors.startDate}</Text>
                                )}
                            </View>

                            {/* Start Date Picker Modal */}
                            <BottomSheetModal
                                ref={startDatePickerRef}
                                snapPoints={[350]}
                                enablePanDownToClose
                                backgroundStyle={{ backgroundColor: '#fff' }}
                                handleIndicatorStyle={{ backgroundColor: '#1f2937' }}
                                backdropComponent={(p) => (
                                    <BottomSheetBackdrop
                                        {...p}
                                        appearsOnIndex={0}
                                        disappearsOnIndex={-1}
                                        opacity={0.8}
                                    />
                                )}
                            >
                                <BottomSheetView style={tripsStyles.bottomSheetContent}>
                                    <Text style={tripsStyles.bottomSheetTitle}>
                                        Select Start Date
                                    </Text>
                                    <DateTimePicker
                                        value={tempStartDate || new Date(values.startDate)}
                                        mode="date"
                                        display="spinner"
                                        onChange={(event: any, date?: Date) => {
                                            if (date) {
                                                setTempStartDate(date);
                                            }
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={tripsStyles.doneButton}
                                        onPress={() => {
                                            if (tempStartDate) {
                                                const dateString = tempStartDate.toISOString().split('T')[0];
                                                setFieldValue('startDate', dateString);
                                            }
                                            startDatePickerRef.current?.close();
                                        }}
                                    >
                                        <Text style={tripsStyles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </BottomSheetView>
                            </BottomSheetModal>

                            {/* End Date Picker */}
                            <View style={tripsStyles.fieldContainer}>
                                <Text style={tripsStyles.fieldLabel}>
                                    End Date *
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        tripsStyles.datePickerButton,
                                        touched.endDate && errors.endDate && tripsStyles.datePickerButtonError,
                                    ]}
                                    onPress={() => handleOpenEndDatePicker(values.endDate)}
                                    disabled={loading}
                                >
                                    <Text style={tripsStyles.datePickerText}>
                                        {new Date(values.endDate).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <Text style={tripsStyles.datePickerIcon}>📅</Text>
                                </TouchableOpacity>
                                {touched.endDate && errors.endDate && (
                                    <Text style={tripsStyles.error}>{errors.endDate}</Text>
                                )}
                            </View>

                            {/* End Date Picker Modal */}
                            <BottomSheetModal
                                ref={endDatePickerRef}
                                snapPoints={[350]}
                                enablePanDownToClose
                                backgroundStyle={{ backgroundColor: '#fff' }}
                                handleIndicatorStyle={{ backgroundColor: '#1f2937' }}
                                backdropComponent={(p) => (
                                    <BottomSheetBackdrop
                                        {...p}
                                        appearsOnIndex={0}
                                        disappearsOnIndex={-1}
                                        opacity={0.8}
                                    />
                                )}
                            >
                                <BottomSheetView style={tripsStyles.bottomSheetContent}>
                                    <Text style={tripsStyles.bottomSheetTitle}>
                                        Select End Date
                                    </Text>
                                    <DateTimePicker
                                        value={tempEndDate || new Date(values.endDate)}
                                        mode="date"
                                        display="spinner"
                                        onChange={(event: any, date?: Date) => {
                                            if (date) {
                                                setTempEndDate(date);
                                            }
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={tripsStyles.doneButton}
                                        onPress={() => {
                                            if (tempEndDate) {
                                                const dateString = tempEndDate.toISOString().split('T')[0];
                                                setFieldValue('endDate', dateString);
                                            }
                                            endDatePickerRef.current?.close();
                                        }}
                                    >
                                        <Text style={tripsStyles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </BottomSheetView>
                            </BottomSheetModal>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[tripsStyles.button, loading && tripsStyles.buttonDisabled]}
                                onPress={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={tripsStyles.buttonText}>Create</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    );
}
