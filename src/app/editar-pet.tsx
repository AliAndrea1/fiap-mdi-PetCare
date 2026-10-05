import { Ionicons } from '@expo/vector-icons';
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

export default function EditarPetScreen() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [pelagem, setPelagem] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [veterinario, setVeterinario] =
    useState('');

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  useEffect(() => {
    buscarPet();
  }, []);

  async function buscarPet() {
    try {
      setCarregando(true);

      const { data, error } = await supabase
        .from('pets')
        .select(
          `
          nome,
          especie,
          raca,
          pelagem,
          sexo,
          idade,
          peso,
          veterinario
          `
        )
        .eq('id', 1)
        .single();

      if (error) {
        throw error;
      }

      setNome(data.nome ?? '');
      setEspecie(data.especie ?? '');
      setRaca(data.raca ?? '');
      setPelagem(data.pelagem ?? '');
      setSexo(data.sexo ?? '');
      setIdade(data.idade ?? '');
      setPeso(data.peso ?? '');
      setVeterinario(
        data.veterinario ?? ''
      );
    } catch (error) {
      console.error(
        'Erro ao carregar pet:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do pet.',
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
      !nome.trim() ||
      !especie.trim() ||
      !raca.trim() ||
      !pelagem.trim() ||
      !sexo.trim() ||
      !idade.trim() ||
      !peso.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todas as informações do pet.'
      );

      return;
    }

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('pets')
        .update({
          nome: nome.trim(),
          especie: especie.trim(),
          raca: raca.trim(),
          pelagem: pelagem.trim(),
          sexo: sexo.trim(),
          idade: idade.trim(),
          peso: peso.trim(),
          veterinario:
            veterinario.trim(),
        })
        .eq('id', 1);

      if (error) {
        throw error;
      }

      Alert.alert(
        'Perfil atualizado',
        'As informações do pet foram atualizadas com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar pet:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível atualizar as informações do pet.'
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
        contentContainerStyle={
          styles.scrollContent
        }
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
              Editar Pet
            </Text>

            <Text style={styles.subtitle}>
              Atualize as informações da Luna
            </Text>
          </View>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.card}>
          <View style={styles.sectionTitle}>
            <Ionicons
              name="paw-outline"
              size={21}
              color="#526A6B"
            />

            <Text
              style={styles.sectionTitleText}
            >
              Informações do Pet
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do pet"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Espécie
          </Text>

          <TextInput
            style={styles.input}
            value={especie}
            onChangeText={setEspecie}
            placeholder="Ex.: Cachorro"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Raça
          </Text>

          <TextInput
            style={styles.input}
            value={raca}
            onChangeText={setRaca}
            placeholder="Raça do pet"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Pelagem
          </Text>

          <TextInput
            style={styles.input}
            value={pelagem}
            onChangeText={setPelagem}
            placeholder="Ex.: Curta"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Sexo
          </Text>

          <TextInput
            style={styles.input}
            value={sexo}
            onChangeText={setSexo}
            placeholder="Ex.: Macho"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Idade
          </Text>

          <TextInput
            style={styles.input}
            value={idade}
            onChangeText={setIdade}
            placeholder="Ex.: 4 anos"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Peso
          </Text>

          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Ex.: 4 kg"
            editable={!salvando}
          />

          <Text style={styles.label}>
            Veterinário / Clínica
          </Text>

          <TextInput
            style={styles.input}
            value={veterinario}
            onChangeText={setVeterinario}
            placeholder="Ex.: Clínica Pet Vida"
            editable={!salvando}
          />
        </View>

        {/* SALVAR */}
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
    backgroundColor:
      Colors.screenBackground,
  },

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      Colors.screenBackground,
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