import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { TripNote } from '@/src/modules/trips/data/dto/tripNotes.dto';
import {
  CreateTripNoteFormValues,
  createTripNoteSchema,
  UpdateTripNoteFormValues,
  updateTripNoteSchema,
} from '@/src/modules/trips/data/schemas/tripNotes.schemas';
import { TripNoteCard } from '@/src/modules/trips/presentation/components/tripNoteCard';
import { tripNotesStyles } from '@/src/modules/trips/presentation/styles/tripNotes.styles';
import {
  createTripNote,
  deleteTripNote,
  fetchTripNotes,
  updateTripNote,
} from '@/src/modules/trips/services/tripNotesService';

interface TripNotesPageProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

export default function TripNotesPage({ tripId, startDate, endDate }: TripNotesPageProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<TripNote | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const datePickerRef = useRef<BottomSheetModal>(null);
  const formikRef = useRef<any>(null);

  useEffect(() => {
    loadNotes();
  }, [tripId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await fetchTripNotes(tripId);

      if (response.success && Array.isArray(response.data)) {
        setNotes(response.data as TripNote[]);
      } else {
        console.error('Failed to fetch notes:', response.error);
      }
    } catch (error) {
      console.error('Notes load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (values: CreateTripNoteFormValues | UpdateTripNoteFormValues) => {
    try {
      isCreating ? createTripNoteSchema.parse(values) : updateTripNoteSchema.parse(values);
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

  const handleAddNote = async (values: CreateTripNoteFormValues) => {
    try {
      const response = await createTripNote(tripId, {
        trip_id: tripId,
        note_date: values.noteDate,
        title: values.title,
        content: values.content,
      });

      if (response.success) {
        Alert.alert('Success', 'Note created successfully!');
        await loadNotes();
        setIsCreating(false);
        formikRef.current?.resetForm();
      } else {
        Alert.alert('Error', response.error || 'Note could not be created');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the note');
      console.error(error);
    }
  };

  const handleUpdateNote = async (values: UpdateTripNoteFormValues) => {
    if (!editingNote?.id) return;

    try {
      const response = await updateTripNote(editingNote.id, {
        title: values.title,
        content: values.content,
        note_date: values.noteDate,
      });

      if (response.success) {
        Alert.alert('Success', 'Note updated successfully!');
        await loadNotes();
        setEditingNote(null);
        formikRef.current?.resetForm();
      } else {
        Alert.alert('Error', response.error || 'Note could not be updated');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the note');
      console.error(error);
    }
  };

  const handleDeleteNote = (noteId: string | undefined) => {
    if (!noteId) return;

    Alert.alert('Delete', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await deleteTripNote(noteId);
            if (response.success) {
              setNotes(notes.filter((note) => note.id !== noteId));
              Alert.alert('Success', 'Note deleted');
            } else {
              Alert.alert('Error', response.error || 'Error occurred while deleting');
            }
          } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting');
          }
        },
      },
    ]);
  };

  const handleEditNote = (note: TripNote) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingNote(null);
    formikRef.current?.resetForm();
  };

  if (loading) {
    return (
      <View style={tripNotesStyles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Show form if creating or editing
  if (isCreating || editingNote) {
    const initialValues = editingNote
      ? {
          title: editingNote.title,
          content: editingNote.content,
          noteDate: editingNote.note_date,
        }
      : {
          title: '',
          content: '',
          noteDate: new Date().toISOString().split('T')[0],
        };

    const onSubmit = editingNote ? handleUpdateNote : handleAddNote;

    return (
      <ScrollView style={tripNotesStyles.formContainer}>
        <View style={tripNotesStyles.pageHeader}>
          <TouchableOpacity onPress={handleCancelForm}>
            <Text style={tripNotesStyles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={tripNotesStyles.pageTitle}>
            {editingNote ? 'Edit Note' : 'Add Note'}
          </Text>
          <View style={tripNotesStyles.headerSpacer} />
        </View>

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Date Field */}
              <View style={tripNotesStyles.fieldContainer}>
                <Text style={tripNotesStyles.fieldLabel}>Date *</Text>
                <TouchableOpacity
                  style={[
                    tripNotesStyles.datePickerButton,
                    touched.noteDate && errors.noteDate && tripNotesStyles.datePickerButtonError,
                  ]}
                  onPress={() => {
                    setTempDate(new Date(values.noteDate));
                    datePickerRef.current?.present();
                  }}
                >
                  <Text style={tripNotesStyles.datePickerText}>
                    {new Date(values.noteDate).toLocaleDateString('tr-TR')}
                  </Text>
                  <Text style={tripNotesStyles.datePickerIcon}>📅</Text>
                </TouchableOpacity>
                {touched.noteDate && errors.noteDate && (
                  <Text style={tripNotesStyles.error}>{String(errors.noteDate)}</Text>
                )}
              </View>

              {/* Title Field */}
              <View style={tripNotesStyles.fieldContainer}>
                <Text style={tripNotesStyles.fieldLabel}>Title *</Text>
                <TextInput
                  style={[
                    tripNotesStyles.input,
                    touched.title && errors.title && tripNotesStyles.inputError,
                  ]}
                  placeholder="Note title..."
                  placeholderTextColor="#999"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                />
                {touched.title && errors.title && (
                  <Text style={tripNotesStyles.error}>{String(errors.title)}</Text>
                )}
              </View>

              {/* Content Field */}
              <View style={tripNotesStyles.fieldContainer}>
                <Text style={tripNotesStyles.fieldLabel}>Content *</Text>
                <TextInput
                  style={[
                    tripNotesStyles.input,
                    tripNotesStyles.textArea,
                    touched.content && errors.content && tripNotesStyles.inputError,
                  ]}
                  placeholder="Write your note here..."
                  placeholderTextColor="#999"
                  onChangeText={handleChange('content')}
                  onBlur={handleBlur('content')}
                  value={values.content}
                  multiline
                  numberOfLines={6}
                />
                {touched.content && errors.content && (
                  <Text style={tripNotesStyles.error}>{String(errors.content)}</Text>
                )}
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={tripNotesStyles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={tripNotesStyles.buttonText}>
                  {editingNote ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[tripNotesStyles.cancelButton, tripNotesStyles.button]}
                onPress={handleCancelForm}
              >
                <Text style={tripNotesStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        {/* Date Picker Modal */}
        <BottomSheetModal
          ref={datePickerRef}
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
          <BottomSheetView style={tripNotesStyles.bottomSheetContent}>
            <Text style={tripNotesStyles.bottomSheetTitle}>Select Date</Text>
            {tempDate && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event: any, date?: Date) => {
                  if (date) {
                    setTempDate(date);
                  }
                }}
              />
            )}
            <TouchableOpacity
              style={tripNotesStyles.doneButton}
              onPress={() => {
                if (tempDate && formikRef.current) {
                  const dateString = tempDate.toISOString().split('T')[0];
                  formikRef.current.setFieldValue('noteDate', dateString);
                }
                datePickerRef.current?.close();
              }}
            >
              <Text style={tripNotesStyles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </ScrollView>
    );
  }

  // Show notes list
  return (
    <View style={tripNotesStyles.container}>
      {/* Header */}
      <View style={tripNotesStyles.header}>
        <Text style={tripNotesStyles.headerTitle}>Daily Notes</Text>
        <Text style={tripNotesStyles.dateRange}>
          {new Date(startDate).toLocaleDateString('tr-TR')} -{' '}
          {new Date(endDate).toLocaleDateString('tr-TR')}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingTop: 8 }}>
        {/* Add Note Button */}
        <TouchableOpacity
          style={tripNotesStyles.addNoteButton}
          onPress={() => setIsCreating(true)}
        >
          <Text style={tripNotesStyles.addNoteButtonText}>+ Add Daily Note</Text>
        </TouchableOpacity>

        {/* Notes List */}
        {notes.length === 0 ? (
          <View style={tripNotesStyles.emptyContainer}>
            <Text style={tripNotesStyles.emptyTitle}>No notes yet</Text>
            <Text style={tripNotesStyles.emptySubtitle}>
              Add daily notes to document your journey
            </Text>
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item, index) => item.id || index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TripNoteCard
                note={item}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}
