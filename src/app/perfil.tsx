import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import { Colors } from '../../constants/colors';
import BottomMenu from '../components/BottomMenu';
import { supabase } from '../lib/supabase';

type Pet = {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  pelagem: string;
  sexo: string;
  idade: string;
  peso: string;
  veterinario: string;
  tipo_sangue: string;
  alergias: string;
  alimentacao: string;
  observacoes: string;
};

type Dono = {
  nome: string;
  email: string;
  telefone: string;
};

export default function PerfilScreen() {
  const [pet, setPet] =
    useState<Pet | null>(null);

  const [dono, setDono] =
    useState<Dono | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  async function buscarDados() {
    try {
      setCarregando(true);
      setErro('');

      // =========================
      // USUÁRIO LOGADO
      // =========================

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const usuario = userData.user;

      if (!usuario) {
        router.replace('/');
        return;
      }

      // =========================
      // PERFIL DO DONO
      // =========================

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

      setDono({
        nome: perfilData?.nome ?? '-',
        email: usuario.email ?? '-',
        telefone:
          perfilData?.telefone ?? '-',
      });

      // =========================
      // PERFIL DO PET
      // =========================

      const {
        data: petData,
        error: petError,
      } = await supabase
        .from('pets')
        .select('*')
        .eq('id', 1)
        .single();

      if (petError) {
        throw petError;
      }

      setPet(petData);
    } catch (error: any) {
      console.error(
        'Erro ao buscar dados do perfil:',
        error
      );

      setErro(
        error?.message ??
          'Não foi possível carregar os dados do perfil.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarDados();
    }, [])
  );

  function handleEditOwner() {
  router.push('/editar-dono');
}

  function handleEditPet() {
    router.push('/editar-pet');
  }

  function handleEditAdditional() {
    router.push(
      '/editar-informacoes-pet'
    );
  }

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',

          onPress: async () => {
            try {
              const { error } =
                await supabase.auth.signOut();

              if (error) {
                throw error;
              }

              router.replace('/');
            } catch (error) {
              console.error(
                'Erro ao sair da conta:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível sair da conta.'
              );
            }
          },
        },
      ]
    );
  }

 function handleDeleteAccount() {
  Alert.alert(
    'Excluir conta',
    'Tem certeza que deseja excluir sua conta? Esta ação é permanente e não poderá ser desfeita.',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',

        onPress: async () => {
          try {
            const { error } =
              await supabase.functions.invoke(
                'delete-user'
              );

            if (error) {
              throw error;
            }

            // Limpa a sessão local após excluir o usuário
            await supabase.auth.signOut();

            Alert.alert(
              'Conta excluída',
              'Sua conta foi excluída com sucesso.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/');
                  },
                },
              ]
            );
          } catch (error) {
            console.error(
              'Erro ao excluir conta:',
              error
            );

            Alert.alert(
              'Erro',
              'Não foi possível excluir sua conta. Tente novamente.'
            );
          }
        },
      },
    ]
  );
}

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* FOTO DO PET */}

        <View style={styles.petProfile}>
          <Image
            source={require(
              '../../assets/images/pet.png'
            )}
            style={styles.petImage}
            resizeMode="cover"
          />

          <Text style={styles.petName}>
            {carregando
              ? 'Carregando...'
              : pet?.nome ?? 'Pet'}
          </Text>
        </View>

        {/* ERRO */}

        {!carregando && erro !== '' && (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={25}
              color="#C62828"
            />

            <Text
              style={styles.errorTitle}
            >
              Não foi possível carregar os
              dados
            </Text>

            <Text
              style={styles.errorText}
            >
              {erro}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={buscarDados}
            >
              <Ionicons
                name="refresh-outline"
                size={17}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.retryButtonText
                }
              >
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        )}

        {/* CARREGAMENTO */}

        {carregando && (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="small"
              color="#364B4C"
            />

            <Text
              style={styles.loadingText}
            >
              Carregando informações...
            </Text>
          </View>
        )}

        {/* PERFIL DO DONO */}

        <View style={styles.card}>
          <View
            style={styles.cardHeader}
          >
            <View
              style={
                styles.cardTitleContainer
              }
            >
              <Ionicons
                name="person-outline"
                size={19}
                color="#000000"
              />

              <Text
                style={styles.cardTitle}
              >
                Perfil do Dono
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={handleEditOwner}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#526A6B"
              />
            </Pressable>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Nome
            </Text>

            <Text
              style={styles.infoValue}
            >
              {dono?.nome ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Email
            </Text>

            <Text
              style={styles.infoValue}
            >
              {dono?.email ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Telefone
            </Text>

            <Text
              style={styles.infoValue}
            >
              {dono?.telefone ?? '-'}
            </Text>
          </View>
        </View>

        {/* PERFIL DO PET */}

        <View style={styles.card}>
          <View
            style={styles.cardHeader}
          >
            <View
              style={
                styles.cardTitleContainer
              }
            >
              <Ionicons
                name="paw-outline"
                size={20}
                color="#000000"
              />

              <Text
                style={styles.cardTitle}
              >
                Perfil do Pet
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={handleEditPet}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#526A6B"
              />
            </Pressable>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Nome
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.nome ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Espécie
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.especie ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Raça
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.raca ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Pelagem
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.pelagem ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Sexo
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.sexo ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Idade
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.idade ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Peso
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.peso ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Veterinário
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.veterinario ?? '-'}
            </Text>
          </View>
        </View>

        {/* INFORMAÇÕES ADICIONAIS */}

        <View style={styles.card}>
          <View
            style={styles.cardHeader}
          >
            <View
              style={
                styles.cardTitleContainer
              }
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={20}
                color="#000000"
              />

              <Text
                style={styles.cardTitle}
              >
                Informações Adicionais
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={
                handleEditAdditional
              }
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color="#526A6B"
              />
            </Pressable>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Tipo de sangue
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.tipo_sangue ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Alergias
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.alergias ?? '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={styles.infoLabel}
            >
              Alimentação
            </Text>

            <Text
              style={styles.infoValue}
            >
              {pet?.alimentacao ?? '-'}
            </Text>
          </View>

          <View
            style={
              styles.observationContainer
            }
          >
            <Text
              style={
                styles.observationLabel
              }
            >
              Observações
            </Text>

            <Text
              style={
                styles.observationText
              }
            >
              {pet?.observacoes ?? '-'}
            </Text>
          </View>
        </View>

        {/* BOTÕES DA CONTA */}

        <View
          style={styles.accountButtons}
        >
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text
              style={styles.logoutText}
            >
              Sair da Conta
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              handleDeleteAccount
            }
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text
              style={styles.deleteText}
            >
              Excluir Conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomMenu active="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.screenBackground,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  petProfile: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },

  petImage: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: '#A7CDCE',
  },

  petName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 20,
    marginBottom: 17,

    paddingVertical: 10,
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#526A6B',
  },

  errorCard: {
    alignItems: 'center',

    marginHorizontal: 20,
    marginBottom: 17,

    padding: 14,

    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  errorTitle: {
    marginTop: 6,

    fontSize: 13,
    fontWeight: '700',

    textAlign: 'center',

    color: '#C62828',
  },

  errorText: {
    marginTop: 4,

    fontSize: 11,
    lineHeight: 16,

    textAlign: 'center',

    color: '#526A6B',
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 10,

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 9,

    backgroundColor: '#364B4C',
  },

  retryButtonText: {
    marginLeft: 5,

    fontSize: 11,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 17,

    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 15,

    borderRadius: 14,
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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  cardTitle: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '600',
    color: '#526A6B',
  },

  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F1F6F6',
  },

  divider: {
    height: 1,
    marginTop: 8,
    marginBottom: 11,
    backgroundColor: '#E1E7E7',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },

  infoLabel: {
    width: 92,
    fontSize: 12,
    fontWeight: '600',
    color: '#526A6B',
  },

  infoValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
  },

  observationContainer: {
    marginTop: 7,

    paddingHorizontal: 11,
    paddingVertical: 10,

    borderRadius: 10,
    backgroundColor: '#F1F6F6',
  },

  observationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#526A6B',
  },

  observationText: {
    marginTop: 3,
    fontSize: 13,
    color: '#000000',
  },

  accountButtons: {
    flexDirection: 'row',

    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 12,

    gap: 12,
  },

  logoutButton: {
    flex: 1,
    height: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

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

  logoutText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  deleteButton: {
    flex: 1,
    height: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
    backgroundColor: '#C62828',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 4,
  },

  deleteText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.7,
  },
});