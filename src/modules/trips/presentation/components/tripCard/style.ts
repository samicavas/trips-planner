import { StyleSheet } from 'react-native';

export const tripCardStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    destination: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3b82f6',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 8,
        lineHeight: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    date: {
        fontSize: 12,
        color: '#9ca3af',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 12,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 18,
        color: '#b91c1c',
    },
});
