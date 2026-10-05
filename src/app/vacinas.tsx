import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { useFocusEffect } from 'expo-router';
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
  esquemaVacinacaoMock,
} from '../data/mockData';

import { supabase } from '../lib/supabase';

type Vacina = {
  id: number;
  pet_id: number;
  nome: string;
  dose: string;
  data: string;
  proxima_dose: string;
  veterinario: string;
  created_at?: string;
};

export default function VacinasScreen() {
  const [vacinas, setVacinas] =
    useState<Vacina[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState('');

  const [nomePet, setNomePet] = useState('');
  const [nomeDono, setNomeDono] = useState('');

  async function buscarPetEDono() {
    try {
      /*
       * PET
       */
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

      /*
       * USUÁRIO LOGADO
       */
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

      /*
       * PERFIL DO DONO
       */
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

  async function buscarVacinas() {
    try {
      setCarregando(true);
      setErro('');

      const { data, error } = await supabase
        .from('vacinas')
        .select('*')
        .eq('pet_id', 1)
        .order('data', {
          ascending: false,
        });

      if (error) {
        console.error(
          'Erro ao buscar vacinas:',
          error
        );

        setErro(error.message);
        return;
      }

      setVacinas(data ?? []);
    } catch (error) {
      console.error(
        'Erro inesperado ao buscar vacinas:',
        error
      );

      setErro(
        'Não foi possível carregar as vacinas.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarVacinas();
      buscarPetEDono();
    }, [])
  );

  function formatarData(dataBanco: string) {
    if (!dataBanco) {
      return '-';
    }

    const partes = dataBanco.split('-');

    if (partes.length !== 3) {
      return dataBanco;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
  }

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

        {/* CARREGANDO VACINAS */}

        {carregando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#364B4C"
            />

            <Text style={styles.loadingText}>
              Carregando vacinas...
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
              Não foi possível carregar as vacinas
            </Text>

            <Text style={styles.errorText}>
              {erro}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
              onPress={buscarVacinas}
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

        {/* VACINAS VINDAS DO SUPABASE */}

        {!carregando &&
          erro === '' &&
          vacinas.length > 0 && (
            <View
              style={styles.vaccinesContainer}
            >
              {vacinas.map((vacina) => (
                <View
                  key={vacina.id}
                  style={styles.vaccineCard}
                >
                  <View
                    style={styles.vaccineHeader}
                  >
                    <View
                      style={styles.vaccineIcon}
                    >
                      <MaterialCommunityIcons
                        name="needle"
                        size={21}
                        color="#000000"
                      />
                    </View>

                    <View
                      style={
                        styles.vaccineTitleContainer
                      }
                    >
                      <Text
                        style={styles.vaccineTitle}
                      >
                        {vacina.nome}
                      </Text>

                      <Text style={styles.dose}>
                        {vacina.dose}
                      </Text>
                    </View>

                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#4F7770"
                    />
                  </View>

                  <View
                    style={styles.vaccineDivider}
                  />

                  <View style={styles.infoBlock}>
                    <View style={styles.infoItem}>
                      <Text
                        style={styles.infoLabel}
                      >
                        Data
                      </Text>

                      <Text
                        style={styles.infoValue}
                      >
                        {formatarData(
                          vacina.data
                        )}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text
                        style={styles.infoLabel}
                      >
                        Próxima dose
                      </Text>

                      <Text
                        style={styles.infoValue}
                      >
                        {formatarData(
                          vacina.proxima_dose
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.vetContainer}
                  >
                    <MaterialCommunityIcons
                      name="stethoscope"
                      size={17}
                      color="#526A6B"
                    />

                    <View style={styles.vetInfo}>
                      <Text
                        style={styles.vetLabel}
                      >
                        Veterinário
                      </Text>

                      <Text
                        style={styles.vetName}
                      >
                        {vacina.veterinario}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

        {/* CASO NÃO TENHA VACINAS */}

        {!carregando &&
          erro === '' &&
          vacinas.length === 0 && (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="needle"
                size={28}
                color="#526A6B"
              />

              <Text style={styles.emptyTitle}>
                Nenhuma vacina registrada
              </Text>

              <Text style={styles.emptyText}>
                Ainda não existem vacinas
                registradas para este pet.
              </Text>
            </View>
          )}

        {/* ESQUEMA DE VACINAÇÃO */}

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={23}
            color="#000000"
          />

          <Text style={styles.sectionTitle}>
            Esquema de Vacinação
          </Text>
        </View>

        {/* CARDS DO ESQUEMA */}

        <View style={styles.schemeContainer}>
          {esquemaVacinacaoMock.map(
            (esquema) => (
              <View
                key={esquema.id}
                style={styles.schemeCard}
              >
                <View
                  style={styles.schemeHeader}
                >
                  <View
                    style={styles.schemeIcon}
                  >
                    <Ionicons
                      name="paw-outline"
                      size={20}
                      color="#000000"
                    />
                  </View>

                  <Text
                    style={
                      styles.schemeCardTitle
                    }
                  >
                    {esquema.categoria}
                  </Text>
                </View>

                <View
                  style={
                    styles.diseasesContainer
                  }
                >
                  {esquema.doencas.map(
                    (doenca) => (
                      <View
                        key={doenca}
                        style={styles.diseaseRow}
                      >
                        <View
                          style={styles.bullet}
                        />

                        <Text
                          style={styles.disease}
                        >
                          {doenca}
                        </Text>
                      </View>
                    )
                  )}
                </View>

                <View
                  style={
                    styles.scheduleContainer
                  }
                >
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#526A6B"
                  />

                  <Text style={styles.schedule}>
                    {esquema.recomendacao}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>

        {/* AVISO */}

        <View style={styles.warningContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={19}
            color="#000000"
          />

          <Text style={styles.warning}>
            REPETIR AS VACINAS ANUALMENTE
          </Text>
        </View>
      </ScrollView>

      {/* MENU INFERIOR */}

      <BottomMenu active="vacinas" />
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

  /* PET */

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

  /* VACINAS */

  vaccinesContainer: {
    marginHorizontal: 16,
  },

  vaccineCard: {
    marginBottom: 15,

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

  vaccineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vaccineIcon: {
    width: 35,
    height: 35,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 18,

    backgroundColor: '#B9D8D9',
  },

  vaccineTitleContainer: {
    flex: 1,

    marginLeft: 11,
    marginRight: 8,
  },

  vaccineTitle: {
    fontSize: 15,
    fontWeight: '700',

    color: '#000000',
  },

  dose: {
    marginTop: 3,

    fontSize: 12,

    color: '#526A6B',
  },

  vaccineDivider: {
    height: 1,

    marginVertical: 12,

    backgroundColor: '#8FB8B9',
  },

  infoBlock: {
    flexDirection: 'row',

    marginBottom: 12,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    marginBottom: 3,

    fontSize: 13,
    fontWeight: '600',

    color: '#526A6B',
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '500',

    color: '#000000',
  },

  vetContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 10,

    borderRadius: 10,

    backgroundColor: '#B9D8D9',
  },

  vetInfo: {
    marginLeft: 8,
  },

  vetLabel: {
    fontSize: 11,
    fontWeight: '600',

    color: '#526A6B',
  },

  vetName: {
    marginTop: 2,

    fontSize: 13,
    fontWeight: '500',

    color: '#000000',
  },

  /* CARREGAMENTO */

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 35,
  },

  loadingText: {
    marginTop: 10,

    fontSize: 13,
    fontWeight: '500',

    color: '#526A6B',
  },

  /* ERRO */

  errorCard: {
    alignItems: 'center',

    marginHorizontal: 16,
    marginBottom: 20,

    padding: 18,

    borderRadius: 16,

    backgroundColor: '#FFFFFF',
  },

  errorTitle: {
    marginTop: 8,

    fontSize: 15,
    fontWeight: '700',

    textAlign: 'center',

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

  pressed: {
    opacity: 0.75,
  },

  /* SEM VACINAS */

  emptyCard: {
    alignItems: 'center',

    marginHorizontal: 16,
    marginBottom: 15,

    padding: 20,

    borderRadius: 16,

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

  /* TÍTULO ESQUEMA */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
  },

  sectionTitle: {
    marginLeft: 8,

    fontSize: 19,
    fontWeight: '700',

    color: '#000000',
  },

  /* ESQUEMA DE VACINAÇÃO */

  schemeContainer: {
    marginHorizontal: 16,
  },

  schemeCard: {
    marginBottom: 15,

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

  schemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  schemeIcon: {
    width: 35,
    height: 35,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 18,

    backgroundColor: '#B9D8D9',
  },

  schemeCardTitle: {
    marginLeft: 10,

    fontSize: 17,
    fontWeight: '700',

    color: '#000000',
  },

  diseasesContainer: {
    marginBottom: 12,
  },

  diseaseRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 5,
  },

  bullet: {
    width: 5,
    height: 5,

    marginRight: 8,

    borderRadius: 3,

    backgroundColor: '#526A6B',
  },

  disease: {
    flex: 1,

    fontSize: 14,

    color: '#000000',
  },

  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 11,

    borderRadius: 10,

    backgroundColor: '#B9D8D9',
  },

  schedule: {
    flex: 1,

    marginLeft: 8,

    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,

    color: '#000000',
  },

  /* AVISO */

  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 16,
    marginTop: 4,

    paddingVertical: 12,
    paddingHorizontal: 15,

    borderRadius: 12,

    backgroundColor: '#B9D8D9',
  },

  warning: {
    marginLeft: 7,

    fontSize: 12,
    fontWeight: '700',

    color: '#000000',
  },
});