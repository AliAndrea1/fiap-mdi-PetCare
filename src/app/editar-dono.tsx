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

export default function EditarDonoScreen() {
  const [userId, setUserId] = useState('');

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      setCarregando(true);

      // BUSCA USUÁRIO LOGADO
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const usuario = userData.user;

      if (!usuario) {
        Alert.alert(
          'Sessão encerrada',
          'Faça login novamente.'
        );

        router.replace('/');
        return;
      }

      setUserId(usuario.id);
      setEmail(usuario.email ?? '');

      // BUSCA NOME E TELEFONE
      const {
        data: perfilData,
        error: perfilError,
      } = await supabase
        .from('perfis')
        .select('nome, telefone')
        .eq('id', usuario.id)
        .single();

      if (perfilError) {
        throw perfilError;
      }

      setNome(perfilData?.nome ?? '');
      setTelefone(
        perfilData?.telefone ?? ''
      );
    } catch (error) {
      console.error(
        'Erro ao carregar perfil:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar suas informações.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    const nomeLimpo = nome.trim();
    const telefoneLimpo =
      telefone.trim();

    if (!nomeLimpo) {
      Alert.alert(
        'Atenção',
        'Digite seu nome.'
      );

      return;
    }

    if (!telefoneLimpo) {
      Alert.alert(
        'Atenção',
        'Digite seu telefone.'
      );

      return;
    }

    if (!userId) {
      Alert.alert(
        'Erro',
        'Não foi possível identificar o usuário.'
      );

      return;
    }

    try {
      setSalvando(true);

      const { error } = await supabase
        .from('perfis')
        .update({
          nome: nomeLimpo,
          telefone: telefoneLimpo,
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      Alert.alert(
        'Perfil atualizado',
        'Suas informações foram atualizadas com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar perfil:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível atualizar suas informações.'
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
        {/* VOLTAR */}

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.back()}
          disabled={salvando}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#364B4C"
          />
        </Pressable>

        {/* CABEÇALHO */}

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="person-outline"
              size={30}
              color="#364B4C"
            />
          </View>

          <Text style={styles.title}>
            Editar Perfil
          </Text>

          <Text style={styles.subtitle}>
            Atualize suas informações pessoais
          </Text>
        </View>

        {/* FORMULÁRIO */}

        <View style={styles.card}>
          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#8A999A"
            autoCapitalize="words"
            editable={!salvando}
          />

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.disabledInput,
            ]}
            value={email}
            editable={false}
          />

          <Text style={styles.emailInfo}>
            O e-mail da conta não pode ser
            alterado nesta tela.
          </Text>

          <Text style={styles.label}>
            Telefone
          </Text>

          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Digite seu telefone"
            placeholderTextColor="#8A999A"
            keyboardType="phone-pad"
            editable={!salvando}
          />

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
            onPress={handleSalvar}
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

            <Text
              style={styles.saveButtonText}
            >
              {salvando
                ? 'Salvando...'
                : 'Salvar alterações'}
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
    backgroundColor:
      Colors.screenBackground,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    shadowColor: '#526F70',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },

  header: {
    alignItems: 'center',

    marginTop: 25,
    marginBottom: 25,
  },

  iconContainer: {
    width: 65,
    height: 65,

    borderRadius: 33,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    marginBottom: 13,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',

    color: '#000000',
  },

  subtitle: {
    marginTop: 5,

    fontSize: 13,

    textAlign: 'center',

    color: '#526A6B',
  },

  card: {
    width: '100%',

    padding: 18,

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

  label: {
    marginBottom: 6,

    fontSize: 12,
    fontWeight: '600',

    color: '#526A6B',
  },

  input: {
    width: '100%',
    height: 49,

    paddingHorizontal: 13,

    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#DCE5E5',
    borderRadius: 10,

    backgroundColor: '#F7FAFA',

    fontSize: 14,

    color: '#000000',
  },

  disabledInput: {
    marginBottom: 5,

    backgroundColor: '#EEF2F2',

    color: '#6D7D7E',
  },

  emailInfo: {
    marginBottom: 16,

    fontSize: 10,
    lineHeight: 14,

    color: '#718182',
  },

  saveButton: {
    width: '100%',
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 5,

    borderRadius: 11,

    backgroundColor: '#364B4C',
  },

  saveButtonText: {
    marginLeft: 7,

    fontSize: 14,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  disabledButton: {
    opacity: 0.65,
  },

  pressed: {
    opacity: 0.7,
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
});