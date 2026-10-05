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

import { supabase } from '../lib/supabase';

type Consulta = {
  id: number;
  pet_id: number;
  clinica: string;
  tipo: string;
  data: string;
  horario: string;
  veterinario: string;
  motivo: string;
  status: string;
  created_at?: string;
};

export default function ConsultasScreen() {
  const [consultas, setConsultas] =
    useState<Consulta[]>([]);

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

  async function buscarConsultas() {
    try {
      setCarregando(true);
      setErro('');

      const { data, error } = await supabase
        .from('consultas')
        .select('*')
        .eq('pet_id', 1)
        .order('data', {
          ascending: true,
        })
        .order('horario', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Erro ao buscar consultas:',
          error
        );

        setErro(error.message);
        return;
      }

      setConsultas(data ?? []);
    } catch (error) {
      console.error(
        'Erro inesperado ao buscar consultas:',
        error
      );

      setErro(
        'Não foi possível carregar as consultas.'
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
   * Toda vez que entramos ou voltamos
   * para a tela de consultas, os dados
   * são buscados novamente no Supabase.
   */
  useFocusEffect(
    useCallback(() => {
      buscarConsultas();
      buscarPetEDono();
    }, [])
  );

  function formatarData(dataBanco: string) {
    if (!dataBanco) {
      return '';
    }

    const partes = dataBanco.split('-');

    if (partes.length !== 3) {
      return dataBanco;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
  }

  function formatarHorario(horario: string) {
    if (!horario) {
      return '';
    }

    return horario.substring(0, 5);
  }

  function criarDataConsulta(
    consulta: Consulta
  ) {
    const horario = formatarHorario(
      consulta.horario
    );

    return new Date(
      `${consulta.data}T${horario}:00`
    );
  }

  /*
   * DATA ATUAL
   */
  const agora = new Date();

  /*
   * CONSULTAS FUTURAS
   */
  const consultasFuturas =
    consultas.filter((consulta) => {
      const statusAgendada =
        consulta.status?.toLowerCase() ===
        'agendada';

      const dataConsulta =
        criarDataConsulta(consulta);

      return (
        statusAgendada &&
        dataConsulta >= agora
      );
    });

  /*
   * A primeira consulta futura será
   * mostrada como "Próxima consulta".
   */
  const proximaConsulta =
    consultasFuturas.length > 0
      ? consultasFuturas[0]
      : null;

  /*
   * As demais consultas futuras.
   */
  const proximasConsultas =
    consultasFuturas.slice(1);

  /*
   * HISTÓRICO
   */
  const historico =
    consultas.filter((consulta) => {
      const dataConsulta =
        criarDataConsulta(consulta);

      const statusAgendada =
        consulta.status?.toLowerCase() ===
        'agendada';

      return (
        dataConsulta < agora ||
        !statusAgendada
      );
    });

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

        {/* PET */}

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

        {/* CARREGAMENTO */}

        {carregando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#364B4C"
            />

            <Text style={styles.loadingText}>
              Carregando consultas...
            </Text>
          </View>
        )}

        {/* ERRO */}

        {!carregando && erro !== '' && (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={32}
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
              onPress={buscarConsultas}
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

        {!carregando && erro === '' && (
          <>
            {/* PRÓXIMA CONSULTA */}

            <View style={styles.sectionHeader}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#000000"
              />

              <Text style={styles.sectionTitle}>
                Próxima consulta
              </Text>
            </View>

            {proximaConsulta ? (
              <View style={styles.mainCard}>
                <View
                  style={
                    styles.consultationHeader
                  }
                >
                  <View
                    style={styles.iconContainer}
                  >
                    <MaterialCommunityIcons
                      name="hospital-building"
                      size={22}
                      color="#000000"
                    />
                  </View>

                  <View
                    style={
                      styles.consultationTitleContainer
                    }
                  >
                    <Text
                      style={styles.clinicName}
                    >
                      {proximaConsulta.clinica}
                    </Text>

                    <Text
                      style={
                        styles.consultationType
                      }
                    >
                      {proximaConsulta.tipo}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.scheduledBadge
                    }
                  >
                    <Text
                      style={
                        styles.scheduledBadgeText
                      }
                    >
                      {proximaConsulta.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View
                  style={
                    styles.dateTimeContainer
                  }
                >
                  <View
                    style={styles.dateTimeItem}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#526A6B"
                    />

                    <View
                      style={
                        styles.dateTimeText
                      }
                    >
                      <Text
                        style={styles.infoLabel}
                      >
                        Data
                      </Text>

                      <Text
                        style={styles.infoValue}
                      >
                        {formatarData(
                          proximaConsulta.data
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.dateTimeItem}
                  >
                    <Ionicons
                      name="time-outline"
                      size={19}
                      color="#526A6B"
                    />

                    <View
                      style={
                        styles.dateTimeText
                      }
                    >
                      <Text
                        style={styles.infoLabel}
                      >
                        Horário
                      </Text>

                      <Text
                        style={styles.infoValue}
                      >
                        {formatarHorario(
                          proximaConsulta.horario
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.vetContainer}>
                  <MaterialCommunityIcons
                    name="stethoscope"
                    size={18}
                    color="#526A6B"
                  />

                  <View style={styles.vetInfo}>
                    <Text
                      style={styles.infoLabel}
                    >
                      Veterinário
                    </Text>

                    <Text
                      style={styles.infoValue}
                    >
                      {
                        proximaConsulta.veterinario
                      }
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.reasonContainer}
                >
                  <Text
                    style={styles.reasonLabel}
                  >
                    Motivo
                  </Text>

                  <Text
                    style={styles.reasonText}
                  >
                    {proximaConsulta.motivo}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="calendar-outline"
                  size={30}
                  color="#526A6B"
                />

                <Text style={styles.emptyTitle}>
                  Nenhuma consulta agendada
                </Text>

                <Text style={styles.emptyText}>
                  Você ainda não possui uma
                  próxima consulta cadastrada.
                </Text>
              </View>
            )}

            {/* OUTRAS CONSULTAS FUTURAS */}

            {proximasConsultas.length >
              0 && (
              <>
                <View
                  style={styles.sectionHeader}
                >
                  <Ionicons
                    name="calendar-number-outline"
                    size={22}
                    color="#000000"
                  />

                  <Text
                    style={styles.sectionTitle}
                  >
                    Próximas consultas
                  </Text>
                </View>

                <View
                  style={
                    styles.historyContainer
                  }
                >
                  {proximasConsultas.map(
                    (consulta) => (
                      <View
                        key={consulta.id}
                        style={
                          styles.historyCard
                        }
                      >
                        <View
                          style={
                            styles.historyTop
                          }
                        >
                          <View
                            style={
                              styles.historyIcon
                            }
                          >
                            <MaterialCommunityIcons
                              name="stethoscope"
                              size={20}
                              color="#000000"
                            />
                          </View>

                          <View
                            style={
                              styles.historyTitleContainer
                            }
                          >
                            <Text
                              style={
                                styles.historyTitle
                              }
                            >
                              {consulta.clinica}
                            </Text>

                            <View
                              style={
                                styles.historyDate
                              }
                            >
                              <Ionicons
                                name="calendar-outline"
                                size={14}
                                color="#526A6B"
                              />

                              <Text
                                style={
                                  styles.historyDateText
                                }
                              >
                                {formatarData(
                                  consulta.data
                                )}
                                {' às '}
                                {formatarHorario(
                                  consulta.horario
                                )}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={
                              styles.statusBadge
                            }
                          >
                            <Ionicons
                              name="calendar"
                              size={14}
                              color="#3F6F63"
                            />

                            <Text
                              style={
                                styles.statusText
                              }
                            >
                              Agendada
                            </Text>
                          </View>
                        </View>

                        <View
                          style={
                            styles.historyVet
                          }
                        >
                          <MaterialCommunityIcons
                            name="account-outline"
                            size={16}
                            color="#526A6B"
                          />

                          <Text
                            style={
                              styles.historyVetText
                            }
                          >
                            {
                              consulta.veterinario
                            }
                          </Text>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </>
            )}

            {/* HISTÓRICO */}

            <View style={styles.sectionHeader}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#000000"
              />

              <Text style={styles.sectionTitle}>
                Histórico
              </Text>
            </View>

            {historico.length > 0 ? (
              <View
                style={
                  styles.historyContainer
                }
              >
                {historico.map(
                  (consulta) => (
                    <View
                      key={consulta.id}
                      style={styles.historyCard}
                    >
                      <View
                        style={styles.historyTop}
                      >
                        <View
                          style={
                            styles.historyIcon
                          }
                        >
                          <MaterialCommunityIcons
                            name="stethoscope"
                            size={20}
                            color="#000000"
                          />
                        </View>

                        <View
                          style={
                            styles.historyTitleContainer
                          }
                        >
                          <Text
                            style={
                              styles.historyTitle
                            }
                          >
                            {consulta.tipo}
                          </Text>

                          <View
                            style={
                              styles.historyDate
                            }
                          >
                            <Ionicons
                              name="calendar-outline"
                              size={14}
                              color="#526A6B"
                            />

                            <Text
                              style={
                                styles.historyDateText
                              }
                            >
                              {formatarData(
                                consulta.data
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={
                            styles.statusBadge
                          }
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#3F6F63"
                          />

                          <Text
                            style={
                              styles.statusText
                            }
                          >
                            Realizada
                          </Text>
                        </View>
                      </View>

                      <View
                        style={styles.historyVet}
                      >
                        <MaterialCommunityIcons
                          name="account-outline"
                          size={16}
                          color="#526A6B"
                        />

                        <Text
                          style={
                            styles.historyVetText
                          }
                        >
                          {
                            consulta.veterinario
                          }
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            ) : (
              <View
                style={styles.historyEmpty}
              >
                <Text
                  style={
                    styles.historyEmptyText
                  }
                >
                  Nenhuma consulta no
                  histórico.
                </Text>
              </View>
            )}

            {/* AGENDAR CONSULTA */}

            <Pressable
              style={({ pressed }) => [
                styles.scheduleButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                router.push(
                  '/agendar-consulta'
                )
              }
            >
              <Ionicons
                name="add"
                size={21}
                color="#000000"
              />

              <Text
                style={
                  styles.scheduleButtonText
                }
              >
                Agendar consulta
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <BottomMenu active="consultas" />
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

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#526A6B',
  },

  errorCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 25,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  errorTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#C62828',
  },

  errorText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#526A6B',
  },

  retryButton: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#364B4C',
  },

  retryButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  mainCard: {
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

  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#B9D8D9',
  },

  consultationTitleContainer: {
    flex: 1,
    marginLeft: 11,
  },

  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },

  consultationType: {
    marginTop: 3,
    fontSize: 12,
    color: '#526A6B',
  },

  scheduledBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#B9D8D9',
  },

  scheduledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3F6F63',
  },

  divider: {
    height: 1,
    marginVertical: 13,
    backgroundColor: '#8FB8B9',
  },

  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 13,
  },

  dateTimeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateTimeText: {
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

  vetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  vetInfo: {
    marginLeft: 8,
  },

  reasonContainer: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#B9D8D9',
  },

  reasonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#526A6B',
  },

  reasonText: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },

  historyContainer: {
    marginHorizontal: 16,
    marginBottom: 14,
  },

  historyCard: {
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

  historyTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#B9D8D9',
  },

  historyTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },

  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  historyDateText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#526A6B',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#B9D8D9',
  },

  statusText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#3F6F63',
  },

  historyVet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 46,
  },

  historyVetText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#526A6B',
  },

  emptyCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 27,
    padding: 25,
    borderRadius: 16,
    backgroundColor: '#A7CDCE',
  },

  emptyTitle: {
    marginTop: 9,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#526A6B',
  },

  historyEmpty: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#B9D8D9',
  },

  historyEmptyText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#526A6B',
  },

  scheduleButton: {
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

  scheduleButtonText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  pressed: {
    opacity: 0.75,
  },
});