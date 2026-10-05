import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
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

export default function EditarInformacoesPetScreen() {
  const [tipoSangue, setTipoSangue] = useState('');
  const [alergias, setAlergias] = useState('');
  const [alimentacao, setAlimentacao] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarInformacoes();
  }, []);

  async function buscarInformacoes() {
    try {
      setCarregando(true);

      const { data, error } = await supabase
        .from('pets')
        .select(`
          tipo_sangue,
          alergias,
          alimentacao,
          observacoes
        `)
        .eq('id', 1)
        .single();

      if (error) {
        throw error;
      }

      setTipoSangue(data.tipo_sangue ?? '');
      setAlergias(data.alergias ?? '');
      setAlimentacao(data.alimentacao ?? '');
      setObservacoes(data.observacoes ?? '');
    } catch (error) {
      console.error(
        'Erro ao carregar informações adicionais:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar as informações adicionais.',
        [
          {
            text: 'Voltar',
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setCarregando(false);
    }
  }

  async function salvarAlteracoes() {
    if (
      !tipoSangue.trim() ||
      !alergias.trim() ||
      !alimentacao.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha tipo de sangue, alergias e alimentação.'
      );

      return;
    }

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('pets')
        .update({
          tipo_sangue: tipoSangue.trim(),
          alergias: alergias.trim(),
          alimentacao: alimentacao.trim(),
          observacoes: observacoes.trim(),
        })
        .eq('id', 1);

      if (error) {
        throw error;
      }

      Alert.alert(
        'Informações atualizadas',
        'As informações adicionais foram atualizadas com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar informações adicionais:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível atualizar as informações.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#364B4C"
        />

        <Text style={styles.loadingText}>
          Carregando informações...
        </Text>
      </View>
    );
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
              size={22}
              color="#000000"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Informações Adicionais
            </Text>

            <Text style={styles.subtitle}>
              Atualize os cuidados e informações do pet
            </Text>
          </View>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.card}>
          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={21}
              color="#526A6B"
            />

            <Text style={styles.sectionTitleText}>
              Informações do Pet
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Tipo de sangue
          </Text>

          <TextInput
            style={styles.input}
            value={tipoSangue}
            onChangeText={setTipoSangue}
            placeholder="Ex.: DEA 1.1"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Alergias
          </Text>

          <TextInput
            style={styles.input}
            value={alergias}
            onChangeText={setAlergias}
            placeholder="Ex.: Nenhuma"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Alimentação
          </Text>

          <TextInput
            style={styles.input}
            value={alimentacao}
            onChangeText={setAlimentacao}
            placeholder="Ex.: Ração Bionatural"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Observações
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Adicione observações sobre o pet"
            multiline
            textAlignVertical="top"
            editable={!salvando}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed &&
              !salvando &&
              styles.pressed,
            salvando &&
              styles.disabledButton,
          ]}
          onPress={salvarAlteracoes}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name="checkmark-outline"
              size={20}
              color="#FFFFFF"
            />
          )}

          <Text style={styles.saveText}>
            {salvando
              ? 'Salvando...'
              : 'Salvar alterações'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.screenBackground,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#526A6B',
  },

  scrollContent: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#B9D8D9',
  },

  headerText: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#526A6B',
  },

  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',

    shadowColor: '#526F70',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 4,
  },

  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitleText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },

  divider: {
    height: 1,
    marginTop: 12,
    marginBottom: 15,
    backgroundColor: '#E1E7E7',
  },

  label: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#526A6B',
  },

  input: {
    minHeight: 47,

    marginBottom: 15,
    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: '#D8E4E4',
    borderRadius: 11,

    backgroundColor: '#F7FAFA',

    fontSize: 14,
    color: '#000000',
  },

  textArea: {
    minHeight: 110,
    paddingTop: 12,
    paddingBottom: 12,
  },

  saveButton: {
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 20,

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

  saveText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.75,
  },

  disabledButton: {
    opacity: 0.65,
  },
});