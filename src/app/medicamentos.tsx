import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

import {
  proximoMedicamentoMock,
} from '../data/mockData';

import { supabase } from '../lib/supabase';

type Medicamento = {
  id: number;
  pet_id: number;
  nome: string;
  dose: string;
  horarios: string;
  periodo: string;
  frequencia: string;
  status: string;
  created_at?: string;
};

export default function MedicamentosScreen() {
  const [medicamentos, setMedicamentos] =
    useState<Medicamento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState('');

  const [nomePet, setNomePet] = useState('');
  const [nomeDono, setNomeDono] = useState('');

  async function buscarPetEDono() {
    try {
      // BUSCA O PET
      const {
        data: petData,
        error: petError,
      } = await supabase
        .from('pets')
        .select('nome')
        .eq('id', 1)
        .single();

      if (petError) {
        console.error(
          'Erro ao buscar pet:',
          petError
        );
      } else if (petData) {
        setNomePet(petData.nome);
      }

      // BUSCA O USUÁRIO LOGADO
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          'Erro ao buscar usuário:',
          userError
        );
        return;
      }

      if (!user) {
        return;
      }

      // BUSCA O PERFIL DO DONO
      const {
        data: perfilData,
        error: perfilError,
      } = await supabase
        .from('perfis')
        .select('nome')
        .eq('id', user.id)
        .single();

      if (perfilError) {
        console.error(
          'Erro ao buscar perfil:',
          perfilError
        );
      } else if (perfilData) {
        setNomeDono(perfilData.nome);
      }
    } catch (error) {
      console.error(
        'Erro ao buscar pet e dono:',
        error
      );
    }
  }

  async function buscarMedicamentos() {
    try {
      setCarregando(true);
      setErro('');

      const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .eq('pet_id', 1)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error(
          'Erro ao buscar medicamentos:',
          error
        );

        setErro(error.message);
        return;
      }

      setMedicamentos(data ?? []);
    } catch (error) {
      console.error(
        'Erro inesperado ao buscar medicamentos:',
        error
      );

      setErro(
        'Não foi possível carregar os medicamentos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarMedicamentos();
      buscarPetEDono();
    }, [])
  );

  const medicamentosEmUso =
    medicamentos.filter(
      (medicamento) =>
        medicamento.status
          ?.trim()
          .toLowerCase() === 'em uso'
    );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* MENU SUPERIOR */}

        <TopMenu />

        {/* INFORMAÇÕES DO PET */}

        <View style={styles.petSection}>
          <Image
            source={require('../../assets/images/pet.png')}
            style={styles.petImage}
            resizeMode="cover"
          />

          <View style={styles.petInfo}>
            <Text style={styles.petLabel}>
              Nome do Animal:
            </Text>

            <Text style={styles.petName}>
              {nomePet || 'Pet'}
            </Text>

            <Text
              style={[
                styles.petLabel,
                styles.ownerLabel,
              ]}
            >
              Nome do Dono:
            </Text>

            <Text style={styles.ownerName}>
              {nomeDono || 'Dono'}
            </Text>
          </View>
        </View>

        {/* PRÓXIMO MEDICAMENTO */}

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="pill"
            size={22}
            color="#000000"
          />

          <Text style={styles.sectionTitle}>
            Próximo medicamento
          </Text>
        </View>

        <View style={styles.nextCard}>
          <View style={styles.nextCardHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="pill"
                size={22}
                color="#000000"
              />
            </View>

            <View style={styles.nextTitleArea}>
              <Text style={styles.medicineName}>
                {proximoMedicamentoMock.nome}
              </Text>

              <Text style={styles.frequencyText}>
                {
                  proximoMedicamentoMock.frequencia
                }
              </Text>
            </View>

            <View style={styles.pendingBadge}>
              <Ionicons
                name="time-outline"
                size={14}
                color="#526A6B"
              />

              <Text style={styles.pendingText}>
                Pendente
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.nextInfoRow}>
            <View style={styles.nextInfoItem}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#526A6B"
              />

              <View style={styles.nextInfoText}>
                <Text style={styles.infoLabel}>
                  Data
                </Text>

                <Text style={styles.infoValue}>
                  {proximoMedicamentoMock.data}
                </Text>
              </View>
            </View>

            <View style={styles.nextInfoItem}>
              <Ionicons
                name="time-outline"
                size={18}
                color="#526A6B"
              />

              <View style={styles.nextInfoText}>
                <Text style={styles.infoLabel}>
                  Horário
                </Text>

                <Text style={styles.infoValue}>
                  {
                    proximoMedicamentoMock.horario
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MEDICAMENTOS EM USO */}

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="medical-bag"
            size={22}
            color="#000000"
          />

          <Text style={styles.sectionTitle}>
            Medicamentos em uso
          </Text>
        </View>

        {/* CARREGANDO */}

        {carregando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#364B4C"
            />

            <Text style={styles.loadingText}>
              Carregando medicamentos...
            </Text>
          </View>
        )}

        {/* ERRO */}

        {!carregando && erro !== '' && (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color="#C62828"
            />

            <Text style={styles.errorTitle}>
              Não foi possível carregar
            </Text>

            <Text style={styles.errorText}>
              {erro}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
              onPress={buscarMedicamentos}
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#FFFFFF"
              />

              <Text
                style={styles.retryButtonText}
              >
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        )}

        {/* LISTA VINDO DO SUPABASE */}

        {!carregando &&
          erro === '' &&
          medicamentosEmUso.length > 0 && (
            <View
              style={
                styles.medicinesContainer
              }
            >
              {medicamentosEmUso.map(
                (medicamento) => (
                  <View
                    key={medicamento.id}
                    style={styles.medicineCard}
                  >
                    <View
                      style={
                        styles.medicineCardHeader
                      }
                    >
                      <View
                        style={
                          styles.smallIconCircle
                        }
                      >
                        <MaterialCommunityIcons
                          name="pill"
                          size={20}
                          color="#000000"
                        />
                      </View>

                      <View
                        style={
                          styles.medicineTitleArea
                        }
                      >
                        <Text
                          style={
                            styles.medicineCardName
                          }
                        >
                          {medicamento.nome}
                        </Text>

                        <Text
                          style={
                            styles.medicineCardDose
                          }
                        >
                          {medicamento.dose}
                        </Text>
                      </View>

                      <View
                        style={styles.useBadge}
                      >
                        <Text
                          style={
                            styles.useBadgeText
                          }
                        >
                          {medicamento.status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.medicineDetails
                      }
                    >
                      <View
                        style={
                          styles.detailRow
                        }
                      >
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#526A6B"
                        />

                        <Text
                          style={
                            styles.detailText
                          }
                        >
                          {medicamento.horarios}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.detailRow
                        }
                      >
                        <Ionicons
                          name="repeat-outline"
                          size={16}
                          color="#526A6B"
                        />

                        <Text
                          style={
                            styles.detailText
                          }
                        >
                          {
                            medicamento.frequencia
                          }
                        </Text>
                      </View>

                      <View
                        style={
                          styles.detailRow
                        }
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#526A6B"
                        />

                        <Text
                          style={
                            styles.detailText
                          }
                        >
                          {medicamento.periodo}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              )}
            </View>
          )}

        {/* SEM MEDICAMENTOS */}

        {!carregando &&
          erro === '' &&
          medicamentosEmUso.length === 0 && (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="pill-off"
                size={28}
                color="#526A6B"
              />

              <Text style={styles.emptyTitle}>
                Nenhum medicamento em uso
              </Text>

              <Text style={styles.emptyText}>
                Cadastre um medicamento para
                acompanhar o tratamento.
              </Text>
            </View>
          )}

        {/* ADICIONAR MEDICAMENTO */}

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.push(
              '/adicionar-medicamento'
            )
          }
        >
          <Ionicons
            name="add"
            size={21}
            color="#000000"
          />

          <Text style={styles.addButtonText}>
            Adicionar medicamento
          </Text>
        </Pressable>
      </ScrollView>

      <BottomMenu active="medicamentos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 30,
  },

  petSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 28,
  },

  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#A7CDCE',
  },

  petInfo: {
    flex: 1,
    marginLeft: 30,
  },

  petLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#526A6B',
  },

  petName: {
    marginTop: 2,
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
  },

  ownerLabel: {
    marginTop: 12,
  },

  ownerName: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 13,
  },

  sectionTitle: {
    marginLeft: 8,
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
  },

  nextCard: {
    marginHorizontal: 16,
    marginBottom: 27,
    padding: 16,
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

  nextCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#B9D8D9',
  },

  nextTitleArea: {
    flex: 1,
    marginLeft: 11,
  },

  medicineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },

  frequencyText: {
    marginTop: 3,
    fontSize: 12,
    color: '#526A6B',
  },

  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#B9D8D9',
  },

  pendingText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#526A6B',
  },

  divider: {
    height: 1,
    marginVertical: 13,
    backgroundColor: '#8FB8B9',
  },

  nextInfoRow: {
    flexDirection: 'row',
  },

  nextInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  nextInfoText: {
    marginLeft: 8,
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#526A6B',
  },

  infoValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#526A6B',
  },

  errorCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  errorTitle: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '700',
    color: '#C62828',
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#526A6B',
  },

  retryButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#364B4C',
  },

  retryButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  medicinesContainer: {
    marginHorizontal: 16,
  },

  medicineCard: {
    marginBottom: 13,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#A7CDCE',

    shadowColor: '#526F70',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 6,
    elevation: 4,
  },

  medicineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallIconCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#B9D8D9',
  },

  medicineTitleArea: {
    flex: 1,
    marginLeft: 10,
  },

  medicineCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  medicineCardDose: {
    marginTop: 3,
    fontSize: 12,
    color: '#526A6B',
  },

  useBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#B9D8D9',
  },

  useBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3F6F63',
  },

  medicineDetails: {
    marginTop: 12,
    marginLeft: 46,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  detailText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 12,
    color: '#526A6B',
  },

  emptyCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#A7CDCE',
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#526A6B',
  },

  addButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: '#B9D8D9',

    shadowColor: '#526F70',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },

  addButtonText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  pressed: {
    opacity: 0.75,
  },
});