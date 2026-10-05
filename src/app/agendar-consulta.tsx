import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

export default function AgendarConsultaScreen() {
  const [clinica, setClinica] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [motivo, setMotivo] = useState('');

  const [salvando, setSalvando] = useState(false);

  function converterDataParaBanco(dataDigitada: string) {
    const partes = dataDigitada.split('/');

    if (partes.length !== 3) {
      return null;
    }

    const [dia, mes, ano] = partes;

    if (
      dia.length !== 2 ||
      mes.length !== 2 ||
      ano.length !== 4
    ) {
      return null;
    }

    return `${ano}-${mes}-${dia}`;
  }

  function validarHorario(horarioDigitado: string) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return regex.test(horarioDigitado);
  }

  async function handleAgendar() {
    if (
      !clinica.trim() ||
      !data.trim() ||
      !horario.trim() ||
      !veterinario.trim() ||
      !motivo.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todas as informações da consulta.'
      );

      return;
    }

    const dataBanco = converterDataParaBanco(data.trim());

    if (!dataBanco) {
      Alert.alert(
        'Data inválida',
        'Digite a data no formato DD/MM/AAAA.'
      );

      return;
    }

    if (!validarHorario(horario.trim())) {
      Alert.alert(
        'Horário inválido',
        'Digite o horário no formato HH:MM. Exemplo: 14:30.'
      );

      return;
    }

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('consultas')
        .insert({
          pet_id: 1,
          clinica: clinica.trim(),
          tipo: 'Consulta veterinária',
          data: dataBanco,
          horario: horario.trim(),
          veterinario: veterinario.trim(),
          motivo: motivo.trim(),
          status: 'Agendada',
        });

      if (error) {
        console.error(
          'Erro ao cadastrar consulta:',
          error
        );

        Alert.alert(
          'Erro',
          `Não foi possível agendar a consulta.\n\n${error.message}`
        );

        return;
      }

      console.log(
        'Consulta cadastrada no Supabase com sucesso.'
      );

      Alert.alert(
        'Consulta agendada',
        'A consulta foi salva com sucesso no banco de dados.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro inesperado ao cadastrar consulta:',
        error
      );

      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado ao cadastrar a consulta.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            Agendar consulta
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* ÍCONE */}
        <View style={styles.iconArea}>
          <View style={styles.mainIcon}>
            <MaterialCommunityIcons
              name="stethoscope"
              size={34}
              color="#000000"
            />
          </View>

          <Text style={styles.subtitle}>
            Preencha os dados da nova consulta
          </Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formCard}>
          <Text style={styles.label}>
            Clínica
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Clínica Pet Vida"
            placeholderTextColor="#789091"
            value={clinica}
            onChangeText={setClinica}
            editable={!salvando}
          />

          <Text style={styles.label}>
            Data
          </Text>

          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#789091"
            value={data}
            onChangeText={setData}
            keyboardType="numbers-and-punctuation"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Horário
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 14:30"
            placeholderTextColor="#789091"
            value={horario}
            onChangeText={setHorario}
            keyboardType="numbers-and-punctuation"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Veterinário
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Dr. Carlos Silva"
            placeholderTextColor="#789091"
            value={veterinario}
            onChangeText={setVeterinario}
            editable={!salvando}
          />

          <Text style={styles.label}>
            Motivo
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            placeholder="Ex: Vacina anual"
            placeholderTextColor="#789091"
            value={motivo}
            onChangeText={setMotivo}
            multiline
            textAlignVertical="top"
            editable={!salvando}
          />

          {/* BOTÃO */}
          <Pressable
            style={({ pressed }) => [
              styles.scheduleButton,

              salvando &&
                styles.scheduleButtonDisabled,

              pressed &&
                !salvando &&
                styles.pressed,
            ]}
            onPress={handleAgendar}
            disabled={salvando}
          >
            <Ionicons
              name={
                salvando
                  ? 'cloud-upload-outline'
                  : 'calendar-outline'
              }
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.scheduleButtonText}>
              {salvando
                ? 'Salvando...'
                : 'Agendar consulta'}
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
    fontSize: 19,
    fontWeight: '700',

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

  textArea: {
    height: 90,
    paddingTop: 12,
  },

  scheduleButton: {
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

  scheduleButtonDisabled: {
    opacity: 0.6,
  },

  scheduleButtonText: {
    marginLeft: 8,

    fontSize: 14,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.75,
  },
});