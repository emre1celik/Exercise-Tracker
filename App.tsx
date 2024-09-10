/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row, Rows} from 'react-native-table-component';
import {tableDataMap} from './tableData'; // Import tableDataMap from tableData.ts
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Modal from 'react-native-modal';

type CheckboxesState = Record<string, boolean>; // Use string key for checkboxes

const STORAGE_KEY = '@tableRowsData'; // Key for AsyncStorage for table rows

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#b1b1b1',
    flex: 1,
  };

  // Define an array of motivational quotes
  const motivationalQuotes = [
    // Fitness Motivation
    "Push yourself, because no one else is going to do it for you.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't limit your challenges, challenge your limits.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Dream big, work hard, stay focused, and surround yourself with good people.",
    "Strength does not come from physical capacity, it comes from an indomitable will.",
    "You're one workout away from a good mood.",
    "Sweat is just fat crying.",
    "It never gets easier, you just get stronger.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Make every workout count.",
    "When you feel like quitting, think about why you started.",
    "You don’t have to be extreme, just consistent.",
    "No pain, no gain. Shut up and train.",
    "Excuses don’t burn calories.",
    "The only bad workout is the one that didn’t happen.",
    "Train insane or remain the same.",
    "If it doesn’t challenge you, it doesn’t change you.",
    "Fitness is not about being better than someone else. It’s about being better than you used to be.",
    "Your only limit is you.",
    "Work hard in silence, let your success be the noise.",
    "Sweat, smile, and repeat.",
    "Fall in love with taking care of your body.",
    "You didn’t come this far to only come this far.",
    "When you feel like stopping, think about how far you’ve come.",

    // Mental and Philosophical Motivation
    "He who conquers himself is the mightiest warrior. — Confucius",
    "The mind is everything. What you think, you become. — Buddha",
    "It is not the man who has too little, but the man who craves more, that is poor. — Seneca",
    "Our life is what our thoughts make it. — Marcus Aurelius",
    "Difficulties strengthen the mind, as labor does the body. — Seneca",
    "You have power over your mind — not outside events. Realize this, and you will find strength. — Marcus Aurelius",
    "First say to yourself what you would be; and then do what you have to do. — Epictetus",
    "Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson",
    "The only way to achieve the impossible is to believe it is possible. — Charles Kingsleigh",
    "Strength does not come from winning. Your struggles develop your strengths. — Arnold Schwarzenegger",
    "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. — Buddha",
    "It does not matter how slowly you go, as long as you do not stop. — Confucius",
    "Waste no more time arguing what a good person should be. Be one. — Marcus Aurelius",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
    "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power. — Lao Tzu",
    "Perseverance is not a long race; it is many short races one after the other. — Walter Elliot",
    "The obstacle is the path. — Zen Proverb",
    "Fall seven times, stand up eight. — Japanese Proverb",
    "Act without expectation. — Lao Tzu",
    "What you get by achieving your goals is not as important as what you become by achieving your goals. — Zig Ziglar",
    "A gem cannot be polished without friction, nor a man perfected without trials. — Seneca",
    "The unexamined life is not worth living. — Socrates",
    "To improve is to change; to be perfect is to change often. — Winston Churchill",
    "Man is not made for defeat. A man can be destroyed but not defeated. — Ernest Hemingway",
  ];

  // Automatically change motivation quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeMotivation();
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // State to store the current motivational quote
  const [motivation, setMotivation] = useState<string>(
    motivationalQuotes[0], // Start with the first quote
  );

  // Function to randomly select a motivational quote
  const changeMotivation = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivation(motivationalQuotes[randomIndex]);
  };

  const [checkboxes, setCheckboxes] = useState<CheckboxesState>({});
  const [selectedDay, setSelectedDay] = useState<string>('Maandag (Push)');
  const [tableRows, setTableRows] = useState<Record<string, any[][]>>(
    Object.fromEntries(
      Object.keys(tableDataMap).map(key => [
        key,
        tableDataMap[key].map(t => [...t.data]),
      ]),
    ),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<number | null>(null);
  const [newExerciseName, setNewExerciseName] = useState<string>('');

  // Load tableRows data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          console.log('Loaded tableRows from AsyncStorage', storedData); // Debug log
          setTableRows(JSON.parse(storedData));
        }
      } catch (e) {
        console.error('Failed to load data from AsyncStorage', e);
      }
    };

    loadData();
  }, []);

  // Save tableRows data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tableRows));
      } catch (e) {
        console.error('Failed to save data to AsyncStorage', e);
      }
    };

    saveData();
  }, [tableRows]);

  // Generate a unique key for each checkbox state based on day, exercise index, and row index
  const getCheckboxKey = (
    day: string,
    exerciseIndex: number,
    rowIndex: number,
  ) => {
    return `${day}-${exerciseIndex}-${rowIndex}`;
  };

  // Function to toggle checkbox state
  const toggleCheckbox = (exerciseIndex: number, rowIndex: number) => {
    const key = getCheckboxKey(selectedDay, exerciseIndex, rowIndex); // Use unique key
    setCheckboxes(prevState => {
      const newCheckboxes = {
        ...prevState,
        [key]: !prevState[key], // Toggle the checkbox state
      };
      return newCheckboxes;
    });
  };

  const daysOfWeek = [
    'Maandag (Push)',
    'Dinsdag (Pull)',
    'Woensdag (Legs)',
    'Donderdag (Rest)',
    'Vrijdag (Push)',
    'Zaterdag (Pull)',
    'Zondag (Legs)',
  ];

  const addRow = (exerciseIndex: number) => {
    setTableRows(prevRows => {
      const updatedRows = {...prevRows};
      const currentTable = updatedRows[selectedDay][exerciseIndex];

      const latestSetNumber = currentTable
        .slice(1)
        .reduce((maxSetNumber, row) => {
          const setNumber = parseInt(row[0].replace('Set ', ''), 10);
          return isNaN(setNumber)
            ? maxSetNumber
            : Math.max(maxSetNumber, setNumber);
        }, 0);

      const newRow = [`Set ${latestSetNumber + 1}`, '0 KG', '0 reps', false]; // Add default row

      updatedRows[selectedDay][exerciseIndex].push(newRow);
      return updatedRows;
    });
  };

  const addExercise = () => {
    setTableRows(prevRows => {
      const updatedRows = {...prevRows};
      const currentDay = selectedDay;

      // Add a new exercise with default data
      updatedRows[currentDay] = [
        ...(updatedRows[currentDay] || []),
        [['Exercise', 'Weight', 'Reps', 'Completed']], // Default row with exercise name
        // Placeholder for actual sets
      ];

      return updatedRows;
    });
  };

  const confirmDeleteExercise = (exerciseIndex: number) => {
    setExerciseToDelete(exerciseIndex);
    setIsModalVisible(true);
  };

  const deleteExercise = () => {
    if (exerciseToDelete !== null) {
      setTableRows(prevRows => {
        const updatedRows = {...prevRows};
        const currentDay = selectedDay;

        // Remove the exercise at the specified index
        updatedRows[currentDay] = updatedRows[currentDay].filter(
          (_, index) => index !== exerciseToDelete,
        );

        return updatedRows;
      });
      setExerciseToDelete(null);
    }
    setIsModalVisible(false);
  };

  const openEditModal = (exerciseIndex: number) => {
    setExerciseToEdit(exerciseIndex);
    setNewExerciseName(
      tableRows[selectedDay][exerciseIndex]?.[0]?.[0] ||
        `Exercise ${exerciseIndex + 1}`,
    );
    setIsEditModalVisible(true);
  };

  const saveExerciseName = () => {
    if (exerciseToEdit !== null) {
      // Update tableRows with the new exercise name
      setTableRows(prevRows => {
        const updatedRows = {...prevRows};
        const currentDay = selectedDay;

        // Update the exercise name in tableRows
        updatedRows[currentDay] = updatedRows[currentDay].map((row, index) => {
          if (index === exerciseToEdit) {
            // Ensure the header row remains unchanged, only update the exercise name row
            return [
              [newExerciseName, 'Weight', 'Reps', 'Completed'], // Update exercise name row
              ...row.slice(1), // Retain existing rows
            ];
          }
          return row;
        });

        console.log('Updated tableRows:', updatedRows); // Debug log
        return updatedRows;
      });

      // Reset modal and input state
      setExerciseToEdit(null);
      setNewExerciseName('');
      setIsEditModalVisible(false);
    }
  };

  const tables = tableRows[selectedDay] || [];

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.scrollViewContent}>
        <View
          style={{
            backgroundColor: backgroundStyle.backgroundColor,
            padding: 16,
          }}>
 <TouchableOpacity onPress={changeMotivation} style={styles.motivation}>
            <Text style={styles.motivationText}>{motivation}</Text>
          </TouchableOpacity>
          
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between', // Align items to the space between
              flexDirection: 'row', // Arrange items horizontally
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#444444'}}>
              {selectedDay}
            </Text>
            <TouchableOpacity onPress={addExercise} style={styles.addExerciseButton}>
              <Text style={styles.addExerciseButtonText}>+ Add exercise</Text>
            </TouchableOpacity>
          </View>

          {tables.map((table, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>
                  {table[0][0] || `Exercise ${exerciseIndex + 1}`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => openEditModal(exerciseIndex)}
                    style={styles.editButton}>
                    <Text style={styles.editButtonText}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDeleteExercise(exerciseIndex)}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.tableContainer}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row
                    data={['Set #', ...table[0].slice(1)]} // Replace the first cell with "Set #"
                    style={styles.head}
                    textStyle={styles.headerText}
                  />
                  <Rows
                    data={table.slice(1).map((row, rowIndex) =>
                      row.map(
                        (
                          cell: string | boolean | number,
                          cellIndex: number,
                        ) => {
                          if (typeof cell === 'boolean') {
                            const checkboxKey = getCheckboxKey(
                              selectedDay,
                              exerciseIndex,
                              rowIndex,
                            ); // Generate checkbox key
                            return (
                              <View
                                style={styles.checkboxContainer}
                                key={cellIndex}>
                                <BouncyCheckbox
                                  isChecked={checkboxes[checkboxKey] || false} // Default to false if undefined
                                  onPress={() =>
                                    toggleCheckbox(exerciseIndex, rowIndex)
                                  }
                                  fillColor="black"
                                  unFillColor="white"
                                  size={20}
                                  iconStyle={{
                                    borderColor: 'black',
                                    borderWidth: 2,
                                  }}
                                />
                              </View>
                            );
                          }
                          return (
                            <Text style={styles.text} key={cellIndex}>
                              {cell}
                            </Text>
                          );
                        },
                      ),
                    )}
                    textStyle={styles.text}
                  />
                </Table>

                <TouchableOpacity
                  onPress={() => addRow(exerciseIndex)}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Add Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.stickyBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daysOfWeek.map(day => (
            <View key={day} style={styles.dayContainer}>
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day && styles.selectedDayText,
                ]}
                onPress={() => setSelectedDay(day)}>
                {day}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Custom Modal for Confirmation */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this exercise?
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              onPress={deleteExercise}
              style={styles.modalButtonConfirm}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsModalVisible(false)}
              style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Custom Modal for Editing Exercise Name */}
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={() => setIsEditModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            placeholder="Enter new exercise name"
          />
          <View style={styles.modalButtons}>
            <Pressable
              onPress={saveExerciseName}
              style={styles.modalButtonConfirm}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsEditModalVisible(false)}
              style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    backgroundColor: '#0a0708',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  dayContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b1b1b1',
  },
  selectedDayText: {
    color: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#6A6A6A',
    fontWeight: 'bold',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0a0708',
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
    marginVertical: 10,
    color: '#0a0708',
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  motivation: {
    backgroundColor: '#444444',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  motivationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  addExerciseButton: {
    backgroundColor: '#444444',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  addExerciseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  addButton: {
    backgroundColor: '#444444',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'grey',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonConfirm: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f44336',
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
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 5,
    marginBottom: 20,
    paddingRight: 160,
    paddingLeft: 10,
  },
});

export default App;
