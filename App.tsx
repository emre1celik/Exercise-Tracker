/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faChartColumn, faUserGear, faMedal, faHeartPulse, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row, Rows} from 'react-native-table-component';
import {tableDataMap} from './src/data/tableData';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Modal from 'react-native-modal';
import {styles} from './src/styles/styles';
import {Svg, Path} from 'react-native-svg';
import { Shadow } from 'react-native-shadow-2';
import motivationalQuotes from './src/data/motivationData';

// Type for storing tableRows data
type CheckboxesState = Record<string, boolean>;

// Key for storing tableRows data in AsyncStorage
const STORAGE_KEY = '@tableRowsData';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#b1b1b1',
    flex: 1,
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        changeMotivation();
      }, 10000); // Change every 10 seconds
    };

    startInterval(); // Start the interval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // State to store the current motivational quote
  const [motivation, setMotivation] = useState<string>(
    motivationalQuotes[0], // Start with the first quote
  );

  const changeMotivation = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivation(motivationalQuotes[randomIndex]);

    // Restart the interval when changing the motivation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      changeMotivation();
    }, 10000); // Change every 10 seconds
  };

  const [checkboxes, setCheckboxes] = useState<CheckboxesState>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday (Push)');
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

  const [isWeightEditModalVisible, setIsWeightEditModalVisible] =
    useState(false);
  const [isSetsEditModalVisible, setIsSetsEditModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isStatisticsModalVisible, setIsStatisticsModalVisible] = useState(false);
  const [isGoalsModalVisible, setIsGoalsModalVisible] = useState(false);
  const [isWeightsModalVisible, setIsWeightsModalVisible] = useState(false);
  const [currentEditRowIndex, setCurrentEditRowIndex] = useState<number | null>(
    null,
  );
  const [currentEditExerciseIndex, setCurrentEditExerciseIndex] = useState<
    number | null
  >(null);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newSets, setNewSets] = useState<string>('');
  type Exercise = {
    name: string;
    weight: number;
    reps: number;
    completed: boolean;
  };

  // Load tableRows data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData) as Record<
            string,
            Exercise[][]
          >;
          const correctedData = Object.fromEntries(
            Object.entries(parsedData).map(([day, exercises]) => [
              day,
                exercises.map((exercise, index) =>
                  index === 0 || exercise[0][0] === 'Set #'
                    ? [['Exercise Name', 'Weight', 'Reps', 'Completed'], ...exercise.slice(1)] // Ensure the correct header is always present
                    : exercise,
                ),
            ]),
          );
          setTableRows(correctedData);
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
    'Monday (Push)',
    'Tuesday (Pull)',
    'Wednesday (Legs)',
    'Thursday (Rest)',
    'Friday (Push)',
    'Saturday (Pull)',
    'Sunday (Legs)',
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
        [['Exercise name', 'Weight', 'Reps', 'Completed']], // Default row with exercise name
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

  const openEditWeightModal = (
    exerciseIndex: number,
    rowIndex: number,
    weight: string | number,
  ) => {
    // Ensure weight is a string
    const weightStr = typeof weight === 'string' ? weight : weight.toString();
    setCurrentEditExerciseIndex(exerciseIndex);
    setCurrentEditRowIndex(rowIndex);
    setNewWeight(weightStr); // Pass the string version
    setIsWeightEditModalVisible(true);
  };

  const openEditSetsModal = (
    exerciseIndex: number,
    rowIndex: number,
    sets: string | number,
  ) => {
    // Ensure sets is a string
    const setsStr = typeof sets === 'string' ? sets : sets.toString();
    setCurrentEditExerciseIndex(exerciseIndex);
    setCurrentEditRowIndex(rowIndex);
    setNewSets(setsStr); // Pass the string version
    setIsSetsEditModalVisible(true);
  };

  const openSettings = () => {
    setIsSettingsModalVisible(true);
  };

  const openWeights = () => {
    setIsWeightsModalVisible(true);
  };

  const openGoals = () => {
    setIsWeightsModalVisible(true);
  };

  const openStatistics = () => {
    setIsStatisticsModalVisible(true);
  };

  const saveWeight = (
    exerciseIndex: number | null,
    rowIndex: number | null,
  ) => {
    if (exerciseIndex !== null && rowIndex !== null) {
      setTableRows(prevRows => {
        const updatedRows = {...prevRows};
        // Update the second column (index 1) where weight is stored
        updatedRows[selectedDay][exerciseIndex][rowIndex + 1][1] = newWeight;
        return updatedRows;
      });
    }
    setIsWeightEditModalVisible(false);
  };

  const saveSets = (exerciseIndex: number | null, rowIndex: number | null) => {
    if (exerciseIndex !== null && rowIndex !== null) {
      setTableRows(prevRows => {
        const updatedRows = {...prevRows};
        // Update the third column (index 2) where reps are stored
        updatedRows[selectedDay][exerciseIndex][rowIndex + 1][2] = newSets;
        return updatedRows;
      });
    }
    setIsSetsEditModalVisible(false);
  };

  const tables = tableRows[selectedDay] || [];
const [isMotivationEnabled, setIsMotivationEnabled] = useState(false);

const toggleMotivation = () => setIsMotivationEnabled(previousState => !previousState);
  // State for color settings
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [tertiaryColor, setTertiaryColor] = useState('#000000');

  // State for toggle switches
  const [isStatisticsEnabled, setIsStatisticsEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Function to handle the submission or saving of settings
  const handleSaveSettings = () => {
    const newSettings = {
      backgroundColor,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      isMotivationEnabled,
      isStatisticsEnabled,
      isNotificationsEnabled,
    };
}
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={"#1f232c"}
      />
       <View style={styles.topStickyBar}>
        <View style={styles.leftIcons}>
          <TouchableOpacity
            onPress={() => openSettings()}
          >
             <FontAwesomeIcon icon={faUserGear} size={22} color="white" />
          </TouchableOpacity>
         </View>
         <View style={styles.rightIcons}>
             <TouchableOpacity
                onPress={() => openStatistics()}>
               <FontAwesomeIcon icon={faChartColumn} size={22} color="white" />
             </TouchableOpacity>
             <TouchableOpacity>
                <FontAwesomeIcon icon={faFire} size={22} color="white" spin />
             </TouchableOpacity>
             <TouchableOpacity
                onPress={() => openGoals()}>
                <FontAwesomeIcon icon={faMedal} size={22} color="white" />
             </TouchableOpacity>
             <TouchableOpacity
                onPress={() => openWeights()}>
                <FontAwesomeIcon icon={faHeartPulse} size={22} color="white" />
             </TouchableOpacity>
         </View>
       </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.scrollViewContent}>
        <View
          style={{
            backgroundColor: backgroundStyle.backgroundColor,
            padding: 16,
          }}>
          <TouchableOpacity
            onPress={changeMotivation}
            style={styles.motivation}>
            <Text style={styles.motivationText}>{motivation}</Text>
          </TouchableOpacity>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between', // Align items to the space between
              flexDirection: 'row', // Arrange items horizontally
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1f232c'}}>
              {selectedDay}
            </Text>
         <Shadow distance={3} startColor={'#00000033'}>
            <TouchableOpacity
              onPress={addExercise}
              style={styles.addExerciseButton}>
              <Text style={styles.addExerciseButtonText}>+ Add exercise</Text>
            </TouchableOpacity>
            </Shadow>
          </View>

          {tables.map((table, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <TouchableOpacity onPress={() => openEditModal(exerciseIndex)}>
                  <Text style={styles.exerciseName}>
                    {table[0][0] || `Exercise ${exerciseIndex + 1}`}
                  </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => openEditModal(exerciseIndex)}
                    style={styles.editButton}
                  >
                    <FontAwesomeIcon icon={faPen} size={15} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDeleteExercise(exerciseIndex)}
                    style={styles.deleteButton}>
                    <FontAwesomeIcon icon={faTrash} size={15} color="white" />
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
                                  fillColor="#1f232c"
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
                            <>
                              {cellIndex === 0 && (
                                <Text style={styles.text} key={cellIndex}>
                                  {cell}
                                </Text>
                              )}
                              {cellIndex === 1 && (
                                <TouchableOpacity
                                  onPress={() =>
                                    openEditWeightModal(
                                      exerciseIndex,
                                      rowIndex,
                                      cell,
                                    )
                                  }>
                                  <Text style={styles.text} key={cellIndex}>
                                    {cell}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {cellIndex === 2 && (
                                <TouchableOpacity
                                  onPress={() =>
                                    openEditSetsModal(
                                      exerciseIndex,
                                      rowIndex,
                                      cell,
                                    )
                                  }>
                                  <Text style={styles.text} key={cellIndex}>
                                    {cell}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
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
                  <Text style={styles.addButtonText}>+ Add set</Text>
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
<Modal
    isVisible={isWeightEditModalVisible}
    onBackdropPress={() => setIsWeightEditModalVisible(false)}
    style={styles.modal}>
    <View style={styles.modalContent}>
        <TextInput
            style={styles.input}
            value={newWeight}
            onChangeText={setNewWeight}
            placeholder="Enter new weight"
        />
        <View style={styles.modalButtons}>
            <Pressable
                onPress={() =>
                    saveWeight(currentEditExerciseIndex, currentEditRowIndex)
                }
                style={styles.modalButtonConfirm}>
                <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
                onPress={() => setIsWeightEditModalVisible(false)}
                style={styles.modalButtonCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
        </View>
    </View>
</Modal>

      <Modal
        isVisible={isSetsEditModalVisible}
        onBackdropPress={() => setIsSetsEditModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            value={newSets}
            onChangeText={setNewSets}
            placeholder="Enter new sets"
          />
          <View style={styles.modalButtons}>
            <Pressable
              onPress={() =>
                saveSets(currentEditExerciseIndex, currentEditRowIndex)
              }
              style={styles.modalButtonConfirm}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsSetsEditModalVisible(false)}
              style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

<Modal
  isVisible={isSettingsModalVisible}
  onBackdropPress={() => setIsSettingsModalVisible(false)}
>
  <View style={styles.modal}>
    <View style={styles.modalContent}>

      {/* Settings: Background color */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Background</Text>
        <TextInput
          style={styles.settingsInput}
          value={newSets}
          onChangeText={setNewSets}
          placeholder="#000000"
        />
      </View>

      {/* Settings: Primary color */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Primary</Text>
        <TextInput
          style={styles.settingsInput}
          value={newSets}
          onChangeText={setNewSets}
          placeholder="#000000"
        />
      </View>

      {/* Settings: Secondary color */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Secondary</Text>
        <TextInput
          style={styles.settingsInput}
          value={newSets}
          onChangeText={setNewSets}
          placeholder="#000000"
        />
      </View>

      {/* Settings: Tertiary color */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Tertiary</Text>
        <TextInput
          style={styles.settingsInput}
          value={newSets}
          onChangeText={setNewSets}
          placeholder="#000000"
        />
      </View>

      {/* Motivation toggle */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Motivation header</Text>
        <Switch
          value={isMotivationEnabled}
          onValueChange={toggleMotivation}
        />
      </View>

      {/* Statistics toggle */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Generate Statistics</Text>
        <Switch
          value={isStatisticsEnabled}
          onValueChange={setIsStatisticsEnabled}
        />
      </View>

      {/* Notifications toggle */}
      <View style={styles.modalInput}>
        <Text style={styles.modalInputText}>Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={setIsNotificationsEnabled}
        />
      </View>

      <View style={styles.modalButtons}>
        <Pressable
          onPress={() => setIsSettingsModalVisible(false)}
          style={styles.modalSettingsButtonCancel}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>



      <Modal
        isVisible={isStatisticsModalVisible}
        onBackdropPress={() => setIsStatisticsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalButtons}>
            <Pressable
             onPress={() => setIsStatisticsModalVisible(false)}
             style={styles.modalButtonCancel}
            >
                <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isGoalsModalVisible}
        onBackdropPress={() => setIsGoalsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalButtons}>
            <Pressable
             onPress={() => setIsGoalsModalVisible(false)}
             style={styles.modalButtonCancel}
            >
                <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isWeightsModalVisible}
        onBackdropPress={() => setIsWeightsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalButtons}>
            <Pressable
             onPress={() => setIsWeightsModalVisible(false)}
             style={styles.modalButtonCancel}
            >
                <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default App;
