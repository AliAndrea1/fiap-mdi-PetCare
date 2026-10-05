import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import { supabase } from '../lib/supabase';

export default function AdicionarMedicamentoScreen() {
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [horarios, setHorarios] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [frequencia, setFrequencia] = useState('');

  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (
      !nome.trim() ||
      !dose.trim() ||
      !horarios.trim() ||
      !periodo.trim() ||
      !frequencia.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todas as informações do medicamento.'
      );

      return;
    }

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('medicamentos')
        .insert({
          pet_id: 1,
          nome: nome.trim(),
          dose: dose.trim(),
          horarios: horarios.trim(),
          periodo: periodo.trim(),
          frequencia: frequencia.trim(),
          status: 'Em uso',
        });

      if (error) {
        console.error(
          'Erro ao cadastrar medicamento:',
          error
        );

        Alert.alert(
          'Erro',
          `Não foi possível cadastrar o medicamento.\n\n${error.message}`
        );

        return;
      }

      console.log(
        'Medicamento cadastrado no Supabase com sucesso.'
      );

      Alert.alert(
        'Medicamento cadastrado',
        'O medicamento foi salvo com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro inesperado ao cadastrar medicamento:',
        error
      );

      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado ao cadastrar o medicamento.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#000000"
            />
          </Pressable>

          <Text style={styles.title}>
            Adicionar medicamento
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* ÍCONE */}
        <View style={styles.iconArea}>
          <View style={styles.mainIcon}>
            <MaterialCommunityIcons
              name="pill"
              size={34}
              color="#000000"
            />
          </View>

          <Text style={styles.subtitle}>
            Preencha os dados do medicamento
          </Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formCard}>
          <Text style={styles.label}>
            Medicamento
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Amoxicilina"
            placeholderTextColor="#789091"
            value={nome}
            onChangeText={setNome}
            editable={!salvando}
          />

          <Text style={styles.label}>
            Dose
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 1 comprimido"
            placeholderTextColor="#789091"
            value={dose}
            onChangeText={setDose}
            editable={!salvando}
          />

          <Text style={styles.label}>
            Horários
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 08:00 e 20:00"
            placeholderTextColor="#789091"
            value={horarios}
            onChangeText={setHorarios}
            editable={!salvando}
          />

          <Text style={styles.helperText}>
            Se houver mais de um horário, separe
            usando "e".
          </Text>

          <Text style={styles.label}>
            Período
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Até 30/10/2026"
            placeholderTextColor="#789091"
            value={periodo}
            onChangeText={setPeriodo}
            editable={!salvando}
          />

          <Text style={styles.label}>
            Frequência
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: A cada 12 horas"
            placeholderTextColor="#789091"
            value={frequencia}
            onChangeText={setFrequencia}
            editable={!salvando}
          />

          {/* BOTÃO SALVAR */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,

              salvando &&
                styles.saveButtonDisabled,

              pressed &&
                !salvando &&
                styles.pressed,
            ]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            <Ionicons
              name={
                salvando
                  ? 'cloud-upload-outline'
                  : 'checkmark-outline'
              }
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.saveButtonText}>
              {salvando
                ? 'Salvando...'
                : 'Adicionar medicamento'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },

  scrollContent: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 21,

    backgroundColor: '#B9D8D9',
  },

  title: {
    flex: 1,

    marginHorizontal: 10,

    fontSize: 19,
    fontWeight: '700',

    textAlign: 'center',

    color: '#000000',
  },

  headerSpace: {
    width: 42,
  },

  iconArea: {
    alignItems: 'center',

    marginTop: 30,
    marginBottom: 24,
  },

  mainIcon: {
    width: 70,
    height: 70,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 35,

    backgroundColor: '#B9D8D9',
  },

  subtitle: {
    marginTop: 12,

    fontSize: 13,
    fontWeight: '500',

    color: '#526A6B',
  },

  formCard: {
    padding: 18,

    borderRadius: 16,

    backgroundColor: '#A7CDCE',

    shadowColor: '#526F70',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,

    elevation: 5,
  },

  label: {
    marginBottom: 6,

    fontSize: 13,
    fontWeight: '700',

    color: '#000000',
  },

  input: {
    width: '100%',
    height: 48,

    marginBottom: 16,

    paddingHorizontal: 13,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    fontSize: 14,

    color: '#000000',
  },

  helperText: {
    marginTop: -9,
    marginBottom: 16,

    fontSize: 11,

    color: '#526A6B',
  },

  saveButton: {
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 3,

    borderRadius: 12,

    backgroundColor: '#364B4C',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 4,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    marginLeft: 8,

    fontSize: 14,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.75,
  },
});