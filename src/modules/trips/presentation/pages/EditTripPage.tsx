import { EditTripFormValues, editTripSchema } from '@/src/modules/trips/data/schemas/trip.schemas';
import TripNotesPage from '@/src/modules/trips/presentation/pages/TripNotesPage';
import { tripsStyles } from '@/src/modules/trips/presentation/styles/trips.styles';
import { updateTrip } from '@/src/modules/trips/services/tripsService';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type TabType = 'details' | 'notes';

export default function EditTripPage() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
    const startDatePickerRef = useRef<BottomSheetModal>(null);
    const endDatePickerRef = useRef<BottomSheetModal>(null);
    const formikRef = useRef<any>(null);

    const tripId = params.id as string;
    const tripData = params.data ? JSON.parse(params.data as string) : null;

    const validateForm = (values: EditTripFormValues) => {
        try {
            editTripSchema.parse(values);
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

    const handleUpdateTrip = async (values: EditTripFormValues) => {
        try {
            setLoading(true);

            const response = await updateTrip(tripId, {
                title: values.title,
                destination: values.destination,
                description: values.description || '',
                start_date: values.startDate,
                end_date: values.endDate,
            });

            if (response.success) {
                Alert.alert('Success', 'Trip updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]);
            } else {
                Alert.alert('Error', response.error || 'Trip could not be updated');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while updating the trip');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!tripData) {
        return (
            <View style={tripsStyles.errorContainer}>
                <Text style={tripsStyles.errorText}>Trip verisi bulunamadı</Text>
            </View>
        );
    }

    // Tab Header
    const renderTabHeader = () => (
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <TouchableOpacity
                style={{
                    flex: 1,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderBottomWidth: activeTab === 'details' ? 3 : 0,
                    borderBottomColor: '#3b82f6',
                }}
                onPress={() => setActiveTab('details')}
            >
                <Text style={{ fontSize: 16, fontWeight: activeTab === 'details' ? '700' : '600', color: activeTab === 'details' ? '#3b82f6' : '#6b7280' }}>
                    Trip Details
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flex: 1,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderBottomWidth: activeTab === 'notes' ? 3 : 0,
                    borderBottomColor: '#3b82f6',
                }}
                onPress={() => setActiveTab('notes')}
            >
                <Text style={{ fontSize: 16, fontWeight: activeTab === 'notes' ? '700' : '600', color: activeTab === 'notes' ? '#3b82f6' : '#6b7280' }}>
                    Daily Notes
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Trip Details Tab Content
    const renderDetailsTab = () => (
        <ScrollView contentContainerStyle={tripsStyles.scrollViewContainer}>
            <View style={tripsStyles.pageContainer}>
                {/* Header */}
                <View style={tripsStyles.editTripHeaderContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={tripsStyles.headerBackButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={tripsStyles.editTripHeaderTitle}>Trip Details</Text>
                    <View style={tripsStyles.headerSpacer} />
                </View>

                {/* Form */}
                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        title: tripData.title || '',
                        destination: tripData.destination || '',
                        description: tripData.description || '',
                        startDate: tripData.start_date || new Date().toISOString().split('T')[0],
                        endDate: tripData.end_date || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                    }}
                    validate={validateForm}
                    onSubmit={handleUpdateTrip}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
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
                                    placeholder="E.g.: Summer Vacation"
                                    placeholderTextColor="#999"
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                    editable={!loading}
                                />
                                {touched.title && errors.title && (
                                    <Text style={tripsStyles.error}>{String(errors.title)}</Text>
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
                                    placeholder="E.g.: Paris, France"
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
                                    <Text style={tripsStyles.error}>{String(errors.description)}</Text>
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
                                    onPress={() => {
                                        setTempStartDate(new Date(values.startDate));
                                        startDatePickerRef.current?.present();
                                    }}
                                    disabled={loading}
                                >
                                    <Text style={tripsStyles.datePickerText}>
                                        {new Date(values.startDate).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <Text style={tripsStyles.datePickerIcon}>📅</Text>
                                </TouchableOpacity>
                                {touched.startDate && errors.startDate && (
                                    <Text style={tripsStyles.error}>{String(errors.startDate)}</Text>
                                )}
                            </View>

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
                                    onPress={() => {
                                        setTempEndDate(new Date(values.endDate));
                                        endDatePickerRef.current?.present();
                                    }}
                                    disabled={loading}
                                >
                                    <Text style={tripsStyles.datePickerText}>
                                        {new Date(values.endDate).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <Text style={tripsStyles.datePickerIcon}>📅</Text>
                                </TouchableOpacity>
                                {touched.endDate && errors.endDate && (
                                    <Text style={tripsStyles.error}>{String(errors.endDate)}</Text>
                                )}
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[tripsStyles.button, loading && tripsStyles.buttonDisabled]}
                                onPress={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={tripsStyles.buttonText}>Update</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
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
                    {tempStartDate && (
                        <DateTimePicker
                            value={tempStartDate}
                            mode="date"
                            display="spinner"
                            onChange={(event: any, date?: Date) => {
                                if (date) {
                                    setTempStartDate(date);
                                }
                            }}
                        />
                    )}
                    <TouchableOpacity
                        style={tripsStyles.doneButton}
                        onPress={() => {
                            if (tempStartDate && formikRef.current) {
                                const dateString = tempStartDate.toISOString().split('T')[0];
                                formikRef.current.setFieldValue('startDate', dateString);
                            }
                            startDatePickerRef.current?.close();
                        }}
                    >
                        <Text style={tripsStyles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>

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
                    {tempEndDate && (
                        <DateTimePicker
                            value={tempEndDate}
                            mode="date"
                            display="spinner"
                            onChange={(event: any, date?: Date) => {
                                if (date) {
                                    setTempEndDate(date);
                                }
                            }}
                        />
                    )}
                    <TouchableOpacity
                        style={tripsStyles.doneButton}
                        onPress={() => {
                            if (tempEndDate && formikRef.current) {
                                const dateString = tempEndDate.toISOString().split('T')[0];
                                formikRef.current.setFieldValue('endDate', dateString);
                            }
                            endDatePickerRef.current?.close();
                        }}
                    >
                        <Text style={tripsStyles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>
        </ScrollView>
    );

    // Main render
    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            {renderTabHeader()}
            {activeTab === 'details' ? renderDetailsTab() : null}
            {activeTab === 'notes' ? (
                <TripNotesListTab tripId={tripId} startDate={tripData.start_date} endDate={tripData.end_date} />
            ) : null}
        </View>
    );
}

// Trip Notes List Component
function TripNotesListTab({ tripId, startDate, endDate }: any) {
    return (
        <TripNotesPage tripId={tripId} startDate={startDate} endDate={endDate} />
    );
}
