import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TripCardProps } from './props';
import { tripCardStyles } from './style';

export function TripCard({ item, onPress, onDelete }: TripCardProps) {
  return (
    <TouchableOpacity
      style={tripCardStyles.container}
      onPress={onPress}
    >
      <View style={tripCardStyles.contentContainer}>
        <Text style={tripCardStyles.title}>
          {item.title}
        </Text>

        <Text style={tripCardStyles.destination}>
          📍 {item.destination}
        </Text>


        <View style={tripCardStyles.dateContainer}>
          <Text style={tripCardStyles.date}>
            📅 {item.start_date} - {item.end_date}
          </Text>
        </View>
      </View>

      <View style={tripCardStyles.actionsContainer}>
        <TouchableOpacity
          style={tripCardStyles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <Text style={tripCardStyles.deleteButtonText}>x</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
