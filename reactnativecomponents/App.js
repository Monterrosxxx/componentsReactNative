import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  VirtualizedList,
  SectionList,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Button,
  Image,
  ImageBackground,
  Animated,
  PanResponder
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Datos de ejemplo para las listas
const DATA = [
  { id: '1', title: 'Elemento 1', description: 'Descripción del elemento 1' },
  { id: '2', title: 'Elemento 2', description: 'Descripción del elemento 2' },
  { id: '3', title: 'Elemento 3', description: 'Descripción del elemento 3' },
  { id: '4', title: 'Elemento 4', description: 'Descripción del elemento 4' },
  { id: '5', title: 'Elemento 5', description: 'Descripción del elemento 5' },
];

const SECTION_DATA = [
  {
    title: 'Frutas',
    data: ['Manzana', 'Naranja', 'Plátano']
  },
  {
    title: 'Verduras',
    data: ['Zanahoria', 'Lechuga', 'Tomate']
  }
];

// Componente personalizado para simular Slider
const CustomSlider = ({ value, onValueChange, minimumValue, maximumValue }) => {
  const sliderWidth = 250;
  const knobSize = 20;
  const pan = useRef(new Animated.Value(0)).current;
  
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newValue = Math.max(0, Math.min(sliderWidth - knobSize, gestureState.dx));
      pan.setValue(newValue);
      const percentage = (newValue / (sliderWidth - knobSize)) * (maximumValue - minimumValue) + minimumValue;
      onValueChange(percentage);
    },
    onPanResponderRelease: () => {
      // Mantener la posición final
    }
  });

  return (
    <View style={styles.customSliderContainer}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${value}%` }]} />
        <Animated.View
          style={[
            styles.sliderKnob,
            {
              transform: [{ translateX: pan }]
            }
          ]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

export default function App() {
  // Estados para controlar los componentes
  const [modalVisible, setModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));
  const scrollViewRef = useRef();

  // Función para simular refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('¡Actualizado!', 'El contenido se ha actualizado correctamente');
    }, 2000);
  };

  // Función para simular carga
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('¡Completado!', 'La operación se completó exitosamente');
    }, 3000);
  };

  // Función para animar
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Renderizar item de FlatList
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{item.title}</Text>
      <Text style={styles.listDescription}>{item.description}</Text>
    </View>
  );

  // Renderizar item de SectionList
  const renderSectionItem = ({ item }) => (
    <View style={styles.sectionItem}>
      <Text style={styles.sectionItemText}>{item}</Text>
    </View>
  );

  // Renderizar header de SectionList
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // Función para VirtualizedList
  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;

  const renderVirtualizedItem = ({ item }) => (
    <View style={styles.virtualizedItem}>
      <Text style={styles.virtualizedText}>Item Virtual: {item.title}</Text>
    </View>
  );

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2]
        })
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200EE" barStyle="light-content" />
      
      {/* Header con ImageBackground */}
      <ImageBackground
        source={{ uri: 'https://picsum.photos/400/150' }}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Componentes React Native</Text>
          <Text style={styles.headerSubtitle}>10 Componentes Nativos Demostrados</Text>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6200EE']}
              tintColor="#6200EE"
            />
          }
        >
          {/* Sección 1: Switch */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Switch (Interruptor)</Text>
            <Text style={styles.componentDescription}>
              Permite alternar entre dos estados (activado/desactivado)
            </Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Notificaciones: {switchValue ? 'Activadas' : 'Desactivadas'}
              </Text>
              <Switch
                value={switchValue}
                onValueChange={setSwitchValue}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={switchValue ? '#6200EE' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Sección 2: Slider personalizado */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Slider Personalizado (PanResponder)</Text>
            <Text style={styles.componentDescription}>
              Slider personalizado usando PanResponder para gestos táctiles
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Volumen: {Math.round(sliderValue)}%</Text>
              <CustomSlider
                value={sliderValue}
                onValueChange={setSliderValue}
                minimumValue={0}
                maximumValue={100}
              />
            </View>
          </View>

          {/* Sección 3: ActivityIndicator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. ActivityIndicator (Indicador de Carga)</Text>
            <Text style={styles.componentDescription}>
              Muestra un indicador de carga mientras se procesa una operación
            </Text>
            <View style={styles.activityContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#6200EE" />
              ) : (
                <TouchableOpacity style={styles.loadButton} onPress={simulateLoading}>
                  <Text style={styles.loadButtonText}>Simular Carga</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Sección 4: Modal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Modal (Ventana Modal)</Text>
            <Text style={styles.componentDescription}>
              Presenta contenido sobre la pantalla actual en una ventana flotante
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.modalButtonText}>Abrir Modal</Text>
            </TouchableOpacity>
          </View>

          {/* Sección 5: Pressable */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Pressable (Elemento Presionable)</Text>
            <Text style={styles.componentDescription}>
              Detecta varias etapas de interacción de presión con feedback visual
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.pressableButton,
                { backgroundColor: pressed ? '#3700B3' : '#6200EE' }
              ]}
              onPress={() => Alert.alert('Pressable', '¡Botón presionado!')}
            >
              <Text style={styles.pressableText}>Presiona aquí</Text>
            </Pressable>
          </View>

          {/* Sección 6: TouchableHighlight */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. TouchableHighlight</Text>
            <Text style={styles.componentDescription}>
              Responde a toques con un efecto de resaltado (oscurecimiento)
            </Text>
            <TouchableHighlight
              style={styles.touchableHighlight}
              onPress={() => Alert.alert('TouchableHighlight', '¡Elemento tocado!')}
              underlayColor="#BB86FC"
            >
              <Text style={styles.touchableText}>Toca para resaltar</Text>
            </TouchableHighlight>
          </View>

          {/* Sección 7: TouchableWithoutFeedback */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. TouchableWithoutFeedback</Text>
            <Text style={styles.componentDescription}>
              Responde a toques sin proporcionar feedback visual
            </Text>
            <TouchableWithoutFeedback
              onPress={() => Alert.alert('TouchableWithoutFeedback', '¡Toque sin feedback!')}
            >
              <View style={styles.touchableWithoutFeedback}>
                <Text style={styles.touchableText}>Toca (sin feedback)</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Sección 8: FlatList */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. FlatList (Lista Plana)</Text>
            <Text style={styles.componentDescription}>
              Renderiza listas de datos de forma eficiente con scroll vertical
            </Text>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={styles.flatList}
              scrollEnabled={false}
            />
          </View>

          {/* Sección 9: SectionList */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. SectionList (Lista con Secciones)</Text>
            <Text style={styles.componentDescription}>
              Renderiza listas organizadas en secciones con headers
            </Text>
            <SectionList
              sections={SECTION_DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={renderSectionItem}
              renderSectionHeader={renderSectionHeader}
              style={styles.sectionList}
              scrollEnabled={false}
            />
          </View>

          {/* Sección 10: VirtualizedList */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. VirtualizedList (Lista Virtualizada)</Text>
            <Text style={styles.componentDescription}>
              Base para FlatList y SectionList, permite personalización completa
            </Text>
            <VirtualizedList
              data={DATA}
              initialNumToRender={3}
              renderItem={renderVirtualizedItem}
              keyExtractor={item => item.id}
              getItemCount={getItemCount}
              getItem={getItem}
              style={styles.virtualizedList}
              scrollEnabled={false}
            />
          </View>

          {/* Sección 11: Animated.View */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Animated.View (Vista Animada)</Text>
            <Text style={styles.componentDescription}>
              Permite crear animaciones fluidas y nativas
            </Text>
            <View style={styles.animatedContainer}>
              <Animated.View style={[styles.animatedBox, animatedStyle]}>
                <Text style={styles.animatedText}>¡Anímame!</Text>
              </Animated.View>
              <TouchableOpacity style={styles.animateButton} onPress={startAnimation}>
                <Text style={styles.animateButtonText}>Iniciar Animación</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección 12: ImageBackground */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. ImageBackground (Fondo con Imagen)</Text>
            <Text style={styles.componentDescription}>
              Permite usar una imagen como fondo con contenido encima
            </Text>
            <ImageBackground
              source={{ uri: 'https://picsum.photos/300/150' }}
              style={styles.imageBackground}
              imageStyle={styles.backgroundImage}
            >
              <View style={styles.imageOverlay}>
                <Text style={styles.imageText}>Texto sobre imagen</Text>
              </View>
            </ImageBackground>
          </View>

          {/* Input de texto para demostrar KeyboardAvoidingView */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extra: KeyboardAvoidingView</Text>
            <Text style={styles.componentDescription}>
              Evita que el teclado cubra los campos de entrada
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe algo aquí..."
              value={textInput}
              onChangeText={setTextInput}
              multiline
            />
          </View>

          {/* Botón para mostrar RefreshControl */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extra: RefreshControl</Text>
            <Text style={styles.componentDescription}>
              Desliza hacia abajo para actualizar el contenido
            </Text>
            <View style={styles.refreshInfo}>
              <Text style={styles.refreshText}>
                ⬇️ Desliza hacia abajo para actualizar
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Modal Abierto!</Text>
            <Text style={styles.modalText}>
              Este es un componente Modal que se presenta sobre la pantalla principal.
              Perfecto para mostrar información importante o formularios.
            </Text>
            <Image
              source={{ uri: 'https://picsum.photos/200/100' }}
              style={styles.modalImage}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBackground: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerOverlay: {
    backgroundColor: 'rgba(98, 0, 238, 0.8)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BB86FC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  componentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  sliderContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  customSliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    width: 250,
    height: 4,
    backgroundColor: '#d3d3d3',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#6200EE',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sliderKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6200EE',
    position: 'absolute',
    top: -8,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  loadButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressableButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressableText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchableHighlight: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableWithoutFeedback: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    maxHeight: 200,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionList: {
    maxHeight: 200,
  },
  sectionHeader: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionItem: {
    backgroundColor: '#e8f4f8',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  sectionItemText: {
    fontSize: 14,
    color: '#333',
  },
  virtualizedList: {
    maxHeight: 200,
  },
  virtualizedItem: {
    backgroundColor: '#fff3e0',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  virtualizedText: {
    fontSize: 14,
    color: '#333',
  },
  animatedContainer: {
    alignItems: 'center',
  },
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: '#6200EE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  animatedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  animateButton: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  animateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageBackground: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    borderRadius: 12,
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  refreshInfo: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#6200EE',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalImage: {
    width: 200,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  closeButton: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});