/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={"#1f232c"}
      />
       <View style={styles.topStickyBar}>
        <View style={styles.leftIcons}>

             <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
               <Path fill="white" d="M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304l91.4 0c11.8 0 23.4 1.2 34.5 3.3c-2.1 18.5 7.4 35.6 21.8 44.8c-16.6 10.6-26.7 31.6-20 53.3c4 12.9 9.4 25.5 16.4 37.6s15.2 23.1 24.4 33c15.7 16.9 39.6 18.4 57.2 8.7l0 .9c0 9.2 2.7 18.5 7.9 26.3L29.7 512C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM436 218.2c0-7 4.5-13.3 11.3-14.8c10.5-2.4 21.5-3.7 32.7-3.7s22.2 1.3 32.7 3.7c6.8 1.5 11.3 7.8 11.3 14.8l0 30.6c7.9 3.4 15.4 7.7 22.3 12.8l24.9-14.3c6.1-3.5 13.7-2.7 18.5 2.4c7.6 8.1 14.3 17.2 20.1 27.2s10.3 20.4 13.5 31c2.1 6.7-1.1 13.7-7.2 17.2l-25 14.4c.4 4 .7 8.1 .7 12.3s-.2 8.2-.7 12.3l25 14.4c6.1 3.5 9.2 10.5 7.2 17.2c-3.3 10.6-7.8 21-13.5 31s-12.5 19.1-20.1 27.2c-4.8 5.1-12.5 5.9-18.5 2.4l-24.9-14.3c-6.9 5.1-14.3 9.4-22.3 12.8l0 30.6c0 7-4.5 13.3-11.3 14.8c-10.5 2.4-21.5 3.7-32.7 3.7s-22.2-1.3-32.7-3.7c-6.8-1.5-11.3-7.8-11.3-14.8l0-30.5c-8-3.4-15.6-7.7-22.5-12.9l-24.7 14.3c-6.1 3.5-13.7 2.7-18.5-2.4c-7.6-8.1-14.3-17.2-20.1-27.2s-10.3-20.4-13.5-31c-2.1-6.7 1.1-13.7 7.2-17.2l24.8-14.3c-.4-4.1-.7-8.2-.7-12.4s.2-8.3 .7-12.4L343.8 325c-6.1-3.5-9.2-10.5-7.2-17.2c3.3-10.6 7.7-21 13.5-31s12.5-19.1 20.1-27.2c4.8-5.1 12.4-5.9 18.5-2.4l24.8 14.3c6.9-5.1 14.5-9.4 22.5-12.9l0-30.5zm92.1 133.5a48.1 48.1 0 1 0 -96.1 0 48.1 48.1 0 1 0 96.1 0z"/>
             </Svg>
         </View>
         <View style={styles.rightIcons}>
           <Svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 512 512">
             <Path fill="white" d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
           </Svg>
             <Svg viewBox="0 0 512 512"  width={19} height={19} >
               <Path fill="white" d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z" />
             </Svg>
               <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                 <Path fill="white" d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4l87 0c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31l104.5 0c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240l-132 0c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9L16 240c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9l0-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1l0 5.8c0 16.9-2.8 33.5-8.3 49.1z" />
               </Svg>
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
                    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={14} height={14}>
                        <Path fill="white" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
                      </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDeleteExercise(exerciseIndex)}
                    style={styles.deleteButton}>
                    <Svg width={14} height={14} viewBox="0 0 448 512">
                      <Path fill="white" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </Svg>
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
    </SafeAreaView>
  );
}

export default App;
