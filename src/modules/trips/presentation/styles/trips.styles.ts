import { StyleSheet } from 'react-native';

export const tripsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#ef4444',
        borderRadius: 6,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#9ca3af',
        marginBottom: 20,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 28,
        color: '#fff',
    },
    tripCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tripTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    tripDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12,
        lineHeight: 20,
    },
    tripDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tripDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    tripActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    deleteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#fee2e2',
        borderRadius: 6,
    },
    deleteButtonText: {
        color: '#dc2626',
        fontSize: 12,
        fontWeight: '600',
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#dbeafe',
        borderRadius: 6,
    },
    editButtonText: {
        color: '#1f2937',
        fontSize: 12,
        fontWeight: '600',
    },
    form: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#1f2937',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    error: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#1f2937',
    },
    datePickerButtonError: {
        borderColor: '#ef4444',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#e5e7eb',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#1f2937',
    },
    // AddTripPage Styles
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: '#f8fafc',
    },
    pageContainer: {
        padding: 16,
    },
    addTripHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    headerBackButton: {
        fontSize: 16,
        color: '#3b82f6',
        fontWeight: '600',
    },
    addTripHeaderTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    headerSpacer: {
        width: 50,
    },
    formContainer: {
        marginTop: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    datePickerText: {
        fontSize: 16,
        color: '#1f2937',
        flex: 1,
    },
    datePickerIcon: {
        fontSize: 20,
        marginLeft: 8,
    },
    bottomSheetContent: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    doneButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 20,
        minWidth: 120,
        alignItems: 'center',
        bottom: 26,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // EditTripPage Styles
    editTripHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    editTripHeaderTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
    // TripsPage Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerInfo: {
        flex: 1,
    },
    tripsPageHeaderTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    headerEmail: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    logoutBtn: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    logoutBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    addTripBtn: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addTripBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
});
