import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  icon: {
    fontFamily: 'FontAwesome',
    fontSize: 30,
    color: '#7D7D7D', // Slightly lighter icon color
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    backgroundColor: '#EAEAEA', // Lighter background
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D4D4D4', // Softer border color
  },
  dayContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B8D93', // Soft blue-gray color
  },
  selectedDayText: {
    color: '#1f232c', // Highlighted day in deep blue
  },
  head: {
    height: 40,
    backgroundColor: '#F2F4F5', // Light gray for table header
    fontWeight: 'bold',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1f232c', // Deep blue for table text
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444444', // Darker gray for header text
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#54627b', // Softer border for table
    marginBottom: 5,
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    left: 35,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#1f232c', // Deep blue for exercise name
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#E57373', // Softer red for delete button
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    elevation: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  editButton: {
    backgroundColor: '#54627b', // Light blue for edit button
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 8,
    elevation: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  motivation: {
    backgroundColor: '#E8F5E9', // Light green for motivation box
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 10,
    marginTop: 50,
  },
  motivationText: {
    color: '#388E3C', // Darker green for motivation text
    textAlign: 'center',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  addExerciseButton: {
    backgroundColor: '#54627b', // Light blue for add button
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    elevation: 10,
  },
  addExerciseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  topStickyBar: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#1f232c',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 18,
  },
  leftIcons: {
    marginLeft: 18,
    backgroundColor: '#1f232c',
    borderRadius: 10,
  },
  topStickyBarText: {
    color: '#fff', // Text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1f232c',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  modal: {
  flex: 1, // Ensure it takes up the full screen
  justifyContent: 'center', // Center the modal vertically
  alignItems: 'center',     // Center the modal horizontally
  },
  modalContent: {
    backgroundColor: '#F5F5F5', // Light gray for modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444444', // Darker gray for modal text
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
    modalInput: {
      flexDirection: 'row',        // Arrange children in a row
      justifyContent: 'space-between', // Space out the elements
      alignItems: 'center',        // Center the elements vertically
      marginBottom: 15,            // Add some spacing between rows
      width: '100%',               // Ensure it takes up the full modal width
    },
  modalButtonConfirm: {
    backgroundColor: '#54627b', // Dark green for confirm button
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E57373', // Soft red for cancel button
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  modalSettingsButtonCancel: {
    backgroundColor: '#E57373', // Soft red for cancel button
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#BDBDBD', // Lighter border for input
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    padding: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  settingsInput: {
    borderColor: '#BDBDBD', // Lighter border for input
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    padding: 2,
    flex: 1,                     // Allow the input to fill the remaining space
    paddingLeft: 10,
  },
  modalInputText: {
    marginTop: 5,
    marginBottom: 5,
    flex: 1,                     // Make the text take up available space
  },
});
