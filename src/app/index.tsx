import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
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

export default function AuthScreen() {
  const [modoLogin, setModoLogin] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] =
    useState('');

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [
    mostrarConfirmarSenha,
    setMostrarConfirmarSenha,
  ] = useState(false);

  const [carregando, setCarregando] =
    useState(false);

  const [verificandoSessao, setVerificandoSessao] =
    useState(true);

  // ============================
  // VERIFICAR SESSÃO
  // ============================

  useEffect(() => {
    async function verificarSessao() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            'Erro ao verificar sessão:',
            error
          );
          return;
        }

        if (session) {
          router.replace('/home');
          return;
        }
      } catch (error) {
        console.error(
          'Erro inesperado ao verificar sessão:',
          error
        );
      } finally {
        setVerificandoSessao(false);
      }
    }

    verificarSessao();
  }, []);

  // ============================
  // CRIAR CONTA
  // ============================

  async function handleCreateAccount() {
    const nomeLimpo = nome.trim();
    const telefoneLimpo = telefone.trim();

    const emailLimpo = email
      .trim()
      .toLowerCase();

    if (
      !nomeLimpo ||
      !telefoneLimpo ||
      !emailLimpo ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos para criar sua conta.'
      );

      return;
    }

    if (
      !emailLimpo.includes('@') ||
      !emailLimpo.includes('.')
    ) {
      Alert.alert(
        'E-mail inválido',
        'Digite um endereço de e-mail válido.'
      );

      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter pelo menos 6 caracteres.'
      );

      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Senhas diferentes',
        'A confirmação da senha não corresponde à senha informada.'
      );

      return;
    }

    try {
      setCarregando(true);

      // CRIA USUÁRIO NO SUPABASE AUTH

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email: emailLimpo,
        password: senha,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error(
          'Não foi possível criar o usuário.'
        );
      }

      // CRIA PERFIL DO DONO

      const { error: perfilError } =
        await supabase
          .from('perfis')
          .insert({
            id: authData.user.id,
            nome: nomeLimpo,
            telefone: telefoneLimpo,
          });

      if (perfilError) {
        throw perfilError;
      }

      Alert.alert(
        'Conta criada!',
        'Sua conta foi criada com sucesso.',
        [
          {
            text: 'Continuar',

            onPress: () => {
              router.replace('/home');
            },
          },
        ]
      );
    } catch (error: any) {
      const mensagemErro =
        error?.message?.toLowerCase() ?? '';

      if (
        mensagemErro.includes(
          'already registered'
        ) ||
        mensagemErro.includes(
          'already been registered'
        )
      ) {
        Alert.alert(
          'Conta já existente',
          'Já existe uma conta cadastrada com este e-mail.'
        );

        return;
      }

      console.error(
        'Erro inesperado ao criar conta:',
        error
      );

      Alert.alert(
        'Erro ao criar conta',
        'Não foi possível criar sua conta. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  // ============================
  // LOGIN
  // ============================

  async function handleLogin() {
    const emailLimpo = email
      .trim()
      .toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert(
        'Atenção',
        'Digite seu e-mail e sua senha.'
      );

      return;
    }

    if (
      !emailLimpo.includes('@') ||
      !emailLimpo.includes('.')
    ) {
      Alert.alert(
        'E-mail inválido',
        'Digite um endereço de e-mail válido.'
      );

      return;
    }

    try {
      setCarregando(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email: emailLimpo,
          password: senha,
        });

      if (error) {
        throw error;
      }

      router.replace('/home');
    } catch (error: any) {
      const mensagem =
        error?.message?.toLowerCase() ?? '';

      // LOGIN/SENHA ERRADOS
      // Não mostra erro vermelho no console

      if (
        mensagem.includes(
          'invalid login credentials'
        )
      ) {
        Alert.alert(
          'Não foi possível entrar',
          'E-mail ou senha incorretos.'
        );

        return;
      }

      // SOMENTE ERROS INESPERADOS

      console.error(
        'Erro inesperado ao entrar:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível entrar na sua conta.'
      );
    } finally {
      setCarregando(false);
    }
  }

  // ============================
  // TROCAR ENTRE LOGIN/CADASTRO
  // ============================

  function abrirLogin() {
    setModoLogin(true);

    setSenha('');
    setConfirmarSenha('');

    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
  }

  function abrirCadastro() {
    setModoLogin(false);

    setSenha('');
    setConfirmarSenha('');

    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
  }

  // ============================
  // CARREGANDO SESSÃO
  // ============================

  if (verificandoSessao) {
    return (
      <View style={styles.sessionLoading}>
        <ActivityIndicator
          size="large"
          color={Colors.black}
        />
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
        contentContainerStyle={[
          styles.scrollContent,

          modoLogin
            ? styles.loginScrollContent
            : styles.registerScrollContent,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* LOGO */}

          <Image
            source={require(
              '../../assets/images/logo.png'
            )}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* TÍTULO */}

          <Text style={styles.title}>
            {modoLogin
              ? 'Welcome back'
              : 'Create an account'}
          </Text>

          <Text style={styles.subtitle}>
            {modoLogin
              ? 'Sign in to continue to PetCare'
              : 'Sign up to start using PetCare'}
          </Text>

          {/* NOME E TELEFONE - SOMENTE CADASTRO */}

          {!modoLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#777777"
                autoCapitalize="words"
                autoCorrect={false}
                value={nome}
                onChangeText={setNome}
                editable={!carregando}
              />

              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="#777777"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
                editable={!carregando}
              />
            </>
          )}

          {/* EMAIL */}

          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!carregando}
          />

          {/* SENHA */}

          <View
            style={styles.passwordContainer}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#777777"
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoCorrect={false}
              value={senha}
              onChangeText={setSenha}
              editable={!carregando}
            />

            <Pressable
              style={({ pressed }) => [
                styles.eyeButton,

                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={() => {
                setMostrarSenha(
                  !mostrarSenha
                );
              }}
              disabled={carregando}
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color="#526566"
              />
            </Pressable>
          </View>

          {/* CONFIRMAR SENHA - SOMENTE CADASTRO */}

          {!modoLogin && (
            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm password"
                placeholderTextColor="#777777"
                secureTextEntry={
                  !mostrarConfirmarSenha
                }
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmarSenha}
                onChangeText={
                  setConfirmarSenha
                }
                editable={!carregando}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.eyeButton,

                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={() => {
                  setMostrarConfirmarSenha(
                    !mostrarConfirmarSenha
                  );
                }}
                disabled={carregando}
              >
                <Ionicons
                  name={
                    mostrarConfirmarSenha
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#526566"
                />
              </Pressable>
            </View>
          )}

          {/* BOTÃO PRINCIPAL */}

          <Pressable
            style={({ pressed }) => [
              styles.mainButton,

              pressed &&
                !carregando &&
                styles.buttonPressed,

              carregando &&
                styles.disabledButton,
            ]}
            onPress={
              modoLogin
                ? handleLogin
                : handleCreateAccount
            }
            disabled={carregando}
          >
            {carregando && (
              <ActivityIndicator
                size="small"
                color={Colors.white}
                style={styles.loading}
              />
            )}

            <Text
              style={styles.mainButtonText}
            >
              {carregando
                ? modoLogin
                  ? 'Signing in...'
                  : 'Creating account...'
                : modoLogin
                  ? 'Sign in'
                  : 'Create account'}
            </Text>
          </Pressable>

          {/* TROCAR LOGIN / CADASTRO */}

          <View
            style={styles.switchContainer}
          >
            <Text style={styles.switchText}>
              {modoLogin
                ? "Don't have an account?"
                : 'Already have an account?'}
            </Text>

            <Pressable
              onPress={
                modoLogin
                  ? abrirCadastro
                  : abrirLogin
              }
              disabled={carregando}
              style={({ pressed }) => [
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={styles.switchLink}
              >
                {modoLogin
                  ? 'Create account'
                  : 'Sign in'}
              </Text>
            </Pressable>
          </View>

          {/* TERMOS - SOMENTE CADASTRO */}

          {!modoLogin && (
            <Text style={styles.terms}>
              By creating an account, you
              agree to our{' '}
              <Text style={styles.link}>
                Terms of Service
              </Text>
              {' and '}
              <Text style={styles.link}>
                Privacy Policy
              </Text>
            </Text>
          )}
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

  sessionLoading: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      Colors.screenBackground,
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal: 32,
    paddingBottom: 35,
  },

  // Cadastro começa mais para baixo

  registerScrollContent: {
    paddingTop: 80,
  },

  // Login tem menos campos,
  // então começa ainda mais para baixo

  loginScrollContent: {
    paddingTop: 125,
  },

  content: {
    width: '100%',

    alignItems: 'center',
  },

  logo: {
    width: 190,
    height: 130,

    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',

    color: Colors.black,

    textAlign: 'center',

    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,

    color: Colors.black,

    textAlign: 'center',

    marginBottom: 26,
  },

  input: {
    width: '100%',
    height: 50,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,

    paddingHorizontal: 16,

    fontSize: 15,
    color: Colors.black,

    marginBottom: 12,
  },

  passwordContainer: {
    width: '100%',
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,

    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    height: '100%',

    paddingLeft: 16,

    fontSize: 15,

    color: Colors.black,
  },

  eyeButton: {
    width: 48,
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  mainButton: {
    width: '100%',
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: Colors.black,

    borderRadius: 8,

    marginTop: 4,
  },

  mainButtonText: {
    color: Colors.white,

    fontSize: 15,
    fontWeight: '600',
  },

  loading: {
    marginRight: 8,
  },

  disabledButton: {
    opacity: 0.65,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 20,
  },

  switchText: {
    fontSize: 13,

    color: '#526566',
  },

  switchLink: {
    marginLeft: 5,

    fontSize: 13,
    fontWeight: '700',

    color: Colors.black,
  },

  terms: {
    marginTop: 28,

    paddingHorizontal: 5,

    fontSize: 12,
    lineHeight: 18,

    textAlign: 'center',

    color: '#526566',
  },

  link: {
    color: Colors.black,

    fontWeight: '500',
  },
});