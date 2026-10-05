import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useCallback,
  useState,
} from 'react';

import { Colors } from '../../constants/colors';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';
import { supabase } from '../lib/supabase';

type Compromisso = {
  id: string;
  tipo: 'vacina' | 'consulta';
  nome: string;
  data: string;
  dataOrdenacao: string;
};

export default function HomeScreen() {
  const [compromissos, setCompromissos] =
    useState<Compromisso[]>([]);

  const [peso, setPeso] =
    useState('-');

  const [ultimaConsulta, setUltimaConsulta] =
    useState('Nenhuma consulta realizada');

  const [resumoVacinas, setResumoVacinas] =
    useState('Nenhuma vacina cadastrada');

  const [carregando, setCarregando] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      buscarDadosHome();
    }, [])
  );

  function formatarData(data: string) {
    if (!data) {
      return '-';
    }

    const partes = data.split('-');

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function criarDataLocal(data: string) {
    const [ano, mes, dia] =
      data.split('-').map(Number);

    return new Date(
      ano,
      mes - 1,
      dia,
      23,
      59,
      59
    );
  }

  function calcularDiasDesde(
    data: string
  ) {
    const [ano, mes, dia] =
      data.split('-').map(Number);

    const dataConsulta =
      new Date(ano, mes - 1, dia);

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const diferenca =
      hoje.getTime() -
      dataConsulta.getTime();

    return Math.max(
      0,
      Math.floor(
        diferenca /
          (1000 * 60 * 60 * 24)
      )
    );
  }

  function textoUltimaConsulta(
    data: string
  ) {
    const dias =
      calcularDiasDesde(data);

    if (dias === 0) {
      return 'Última consulta hoje';
    }

    if (dias === 1) {
      return 'Última consulta há 1 dia';
    }

    if (dias < 30) {
      return `Última consulta há ${dias} dias`;
    }

    const meses =
      Math.floor(dias / 30);

    if (meses === 1) {
      return 'Última consulta há 1 mês';
    }

    if (meses < 12) {
      return `Última consulta há ${meses} meses`;
    }

    const anos =
      Math.floor(meses / 12);

    if (anos === 1) {
      return 'Última consulta há 1 ano';
    }

    return `Última consulta há ${anos} anos`;
  }

  async function buscarDadosHome() {
    try {
      setCarregando(true);

      // =========================
      // PET
      // =========================

      const {
        data: petData,
        error: petError,
      } = await supabase
        .from('pets')
        .select('peso')
        .eq('id', 1)
        .single();

      if (!petError && petData) {
        setPeso(
          petData.peso || '-'
        );
      }

      // =========================
      // CONSULTAS
      // =========================

      const {
        data: consultasData,
        error: consultasError,
      } = await supabase
        .from('consultas')
        .select(
          'id, tipo, data, horario, status'
        )
        .eq('pet_id', 1)
        .order('data', {
          ascending: true,
        })
        .order('horario', {
          ascending: true,
        });

      // =========================
      // VACINAS
      // =========================

      const {
        data: vacinasData,
        error: vacinasError,
      } = await supabase
        .from('vacinas')
        .select(
          'id, nome, data, proxima_dose'
        )
        .eq('pet_id', 1)
        .order('data', {
          ascending: false,
        });

      // =========================
      // PRÓXIMOS COMPROMISSOS
      // =========================

      const hoje = new Date();

      hoje.setHours(0, 0, 0, 0);

      const novosCompromissos:
        Compromisso[] = [];

      if (
        !consultasError &&
        consultasData
      ) {
        consultasData.forEach(
          (consulta) => {
            const dataConsulta =
              criarDataLocal(
                consulta.data
              );

            const status =
              (
                consulta.status ?? ''
              ).toLowerCase();

            if (
              dataConsulta >= hoje &&
              status === 'agendada'
            ) {
              novosCompromissos.push({
                id: `consulta-${consulta.id}`,
                tipo: 'consulta',
                nome:
                  consulta.tipo ||
                  'Consulta veterinária',
                data: formatarData(
                  consulta.data
                ),
                dataOrdenacao:
                  consulta.data,
              });
            }
          }
        );

        // =========================
        // ÚLTIMA CONSULTA
        // =========================

        const consultasPassadas =
          consultasData
            .filter((consulta) => {
              const dataConsulta =
                criarDataLocal(
                  consulta.data
                );

              return (
                dataConsulta < hoje
              );
            })
            .sort((a, b) =>
              b.data.localeCompare(
                a.data
              )
            );

        if (
          consultasPassadas.length >
          0
        ) {
          setUltimaConsulta(
            textoUltimaConsulta(
              consultasPassadas[0]
                .data
            )
          );
        } else {
          setUltimaConsulta(
            'Nenhuma consulta realizada'
          );
        }
      }

      if (
        !vacinasError &&
        vacinasData
      ) {
        // =========================
        // PRÓXIMAS DOSES
        // =========================

        vacinasData.forEach(
          (vacina) => {
            if (
              !vacina.proxima_dose
            ) {
              return;
            }

            const proximaDose =
              criarDataLocal(
                vacina.proxima_dose
              );

            if (
              proximaDose >= hoje
            ) {
              novosCompromissos.push({
                id: `vacina-${vacina.id}`,
                tipo: 'vacina',
                nome: vacina.nome,
                data: formatarData(
                  vacina.proxima_dose
                ),
                dataOrdenacao:
                  vacina.proxima_dose,
              });
            }
          }
        );

        // =========================
        // RESUMO DAS VACINAS
        // =========================

        if (
          vacinasData.length === 0
        ) {
          setResumoVacinas(
            'Nenhuma vacina cadastrada'
          );
        } else {
          const vacinaAtrasada =
            vacinasData.some(
              (vacina) => {
                if (
                  !vacina.proxima_dose
                ) {
                  return false;
                }

                return (
                  criarDataLocal(
                    vacina.proxima_dose
                  ) < hoje
                );
              }
            );

          setResumoVacinas(
            vacinaAtrasada
              ? 'Há vacina com próxima dose pendente'
              : 'Vacinas em dia'
          );
        }
      }

      // Ordena todos os compromissos
      // pela data.
      novosCompromissos.sort(
        (a, b) =>
          a.dataOrdenacao.localeCompare(
            b.dataOrdenacao
          )
      );

      // Mostra somente os 3 próximos
      // para não deixar a Home enorme.
      setCompromissos(
        novosCompromissos.slice(
          0,
          3
        )
      );
    } catch (error) {
      console.error(
        'Erro ao carregar Home:',
        error
      );
    } finally {
      setCarregando(false);
    }
  }

  function renderCompromissoIcon(
    tipo: string
  ) {
    if (tipo === 'vacina') {
      return (
        <MaterialCommunityIcons
          name="needle"
          size={19}
          color="#000000"
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name="stethoscope"
        size={19}
        color="#000000"
      />
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
        {/* MENU SUPERIOR */}

        <TopMenu />

        {/* BANNER */}

        <Image
          source={require(
            '../../assets/images/banner.png'
          )}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* PRÓXIMOS COMPROMISSOS */}

        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed &&
              styles.pressed,
          ]}
          onPress={() =>
            router.push('/consultas')
          }
        >
          <View
            style={styles.cardHeader}
          >
            <View
              style={styles.headerLeft}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#000000"
              />

              <Text
                style={styles.cardTitle}
              >
                Próximos compromissos
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#526A6B"
            />
          </View>

          {carregando ? (
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
                style={
                  styles.loadingText
                }
              >
                Carregando...
              </Text>
            </View>
          ) : compromissos.length >
            0 ? (
            compromissos.map(
              (compromisso) => (
                <View
                  key={compromisso.id}
                  style={
                    styles.appointment
                  }
                >
                  <View
                    style={
                      styles.itemIcon
                    }
                  >
                    {renderCompromissoIcon(
                      compromisso.tipo
                    )}
                  </View>

                  <View
                    style={
                      styles.appointmentInfo
                    }
                  >
                    <Text
                      style={
                        styles.appointmentName
                      }
                    >
                      {compromisso.nome}
                    </Text>

                    <Text
                      style={
                        styles.appointmentDate
                      }
                    >
                      {compromisso.data}
                    </Text>
                  </View>
                </View>
              )
            )
          ) : (
            <Text
              style={styles.emptyText}
            >
              Nenhum compromisso
              agendado.
            </Text>
          )}
        </Pressable>

        {/* RESUMO */}

        <View
          style={[
            styles.card,
            styles.summaryCard,
          ]}
        >
          <View
            style={styles.cardHeader}
          >
            <View
              style={styles.headerLeft}
            >
              <Ionicons
                name="clipboard-outline"
                size={20}
                color="#000000"
              />

              <Text
                style={styles.cardTitle}
              >
                Resumo
              </Text>
            </View>
          </View>

          <View
            style={styles.summaryItem}
          >
            <View
              style={
                styles.checkContainer
              }
            >
              <Ionicons
                name="checkmark"
                size={18}
                color="#000000"
              />
            </View>

            <Text
              style={styles.summaryText}
            >
              {carregando
                ? 'Carregando vacinas...'
                : resumoVacinas}
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <View
              style={
                styles.checkContainer
              }
            >
              <Ionicons
                name="checkmark"
                size={18}
                color="#000000"
              />
            </View>

            <Text
              style={styles.summaryText}
            >
              {carregando
                ? 'Carregando consultas...'
                : ultimaConsulta}
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <View
              style={
                styles.checkContainer
              }
            >
              <Ionicons
                name="checkmark"
                size={18}
                color="#000000"
              />
            </View>

            <Text
              style={styles.summaryText}
            >
              {carregando
                ? 'Carregando peso...'
                : `Peso: ${peso}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* MENU INFERIOR */}

      <BottomMenu active="home" />
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
    paddingTop: 60,
    paddingBottom: 30,
  },

  /* BANNER */

  banner: {
    width: 'auto',
    height: 150,

    marginHorizontal: 16,
    marginTop: 25,
    marginBottom: 24,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',
  },

  /* CARDS */

  card: {
    marginHorizontal: 16,
    marginBottom: 20,

    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 13,

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

  pressed: {
    opacity: 0.75,
  },

  /* CABEÇALHO */

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 11,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardTitle: {
    marginLeft: 8,

    fontSize: 16,
    fontWeight: '600',

    color: '#000000',
  },

  /* COMPROMISSOS */

  appointment: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 8,
  },

  appointmentInfo: {
    flex: 1,
  },

  itemIcon: {
    width: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  appointmentName: {
    fontSize: 14,
    fontWeight: '600',

    color: '#000000',
  },

  appointmentDate: {
    marginTop: 2,

    fontSize: 11,

    color: '#526A6B',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,
  },

  loadingText: {
    marginLeft: 8,

    fontSize: 12,

    color: '#526A6B',
  },

  emptyText: {
    paddingVertical: 10,

    fontSize: 12,

    color: '#526A6B',
  },

  /* RESUMO */

  summaryCard: {
    paddingBottom: 15,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 7,
  },

  checkContainer: {
    width: 26,
    height: 26,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 8,
  },

  summaryText: {
    flex: 1,

    fontSize: 13,
    fontWeight: '500',

    color: '#000000',
  },
});