import { TripNote } from '@/src/modules/trips/data/dto/tripNotes.dto';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tripNotesStyles } from '../../styles/tripNotes.styles';

export interface TripNoteCardProps {
  note: TripNote;
  onEdit: (note: TripNote) => void;
  onDelete: (noteId: string | undefined) => void;
}

export function TripNoteCard({ note, onEdit, onDelete }: TripNoteCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View style={tripNotesStyles.noteCard}>
      <Text style={tripNotesStyles.noteDate}>
        📅 {formatDate(note.note_date)}
      </Text>
      <Text style={tripNotesStyles.noteTitle}>{note.title}</Text>
      <Text style={tripNotesStyles.noteContent} numberOfLines={3}>
        {note.content}
      </Text>
      <View style={tripNotesStyles.noteActions}>
        <TouchableOpacity
          style={tripNotesStyles.editButton}
          onPress={() => onEdit(note)}
        >
          <Text style={tripNotesStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tripNotesStyles.deleteButton}
          onPress={() => onDelete(note.id)}
        >
          <Text style={tripNotesStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
