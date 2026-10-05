import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomMenuProps = {
  active:
    | 'home'
    | 'vacinas'
    | 'consultas'
    | 'medicamentos'
    | 'perfil';
};

export default function BottomMenu({
  active,
}: BottomMenuProps) {
  const insets =
    useSafeAreaInsets();

  function navegar(
    tela: BottomMenuProps['active'],
    rota:
      | '/home'
      | '/vacinas'
      | '/consultas'
      | '/medicamentos'
      | '/perfil'
  ) {
    if (active === tela) {
      return;
    }

    router.push(rota);
  }

  return (
    <View
      style={[
        styles.bottomNavigation,
        {
          paddingBottom: Math.max(
            insets.bottom,
            10
          ),

          height:
            70 +
            Math.max(
              insets.bottom,
              10
            ),
        },
      ]}
    >
      {/* HOME */}

      <Pressable
        style={({ pressed }) => [
          styles.bottomItem,
          pressed &&
            active !== 'home' &&
            styles.pressed,
        ]}
        onPress={() =>
          navegar('home', '/home')
        }
      >
        <Ionicons
          name={
            active === 'home'
              ? 'home'
              : 'home-outline'
          }
          size={25}
          color="#000000"
        />

        {active === 'home' && (
          <View
            style={
              styles.activeIndicator
            }
          />
        )}
      </Pressable>

      {/* VACINAS */}

      <Pressable
        style={({ pressed }) => [
          styles.bottomItem,
          pressed &&
            active !== 'vacinas' &&
            styles.pressed,
        ]}
        onPress={() =>
          navegar(
            'vacinas',
            '/vacinas'
          )
        }
      >
        <MaterialCommunityIcons
          name="needle"
          size={24}
          color="#000000"
        />

        {active === 'vacinas' && (
          <View
            style={
              styles.activeIndicator
            }
          />
        )}
      </Pressable>

      {/* CONSULTAS */}

      <Pressable
        style={({ pressed }) => [
          styles.bottomItem,
          pressed &&
            active !==
              'consultas' &&
            styles.pressed,
        ]}
        onPress={() =>
          navegar(
            'consultas',
            '/consultas'
          )
        }
      >
        <Ionicons
          name={
            active === 'consultas'
              ? 'calendar'
              : 'calendar-outline'
          }
          size={25}
          color="#000000"
        />

        {active ===
          'consultas' && (
          <View
            style={
              styles.activeIndicator
            }
          />
        )}
      </Pressable>

      {/* MEDICAMENTOS */}

      <Pressable
        style={({ pressed }) => [
          styles.bottomItem,
          pressed &&
            active !==
              'medicamentos' &&
            styles.pressed,
        ]}
        onPress={() =>
          navegar(
            'medicamentos',
            '/medicamentos'
          )
        }
      >
        <MaterialCommunityIcons
          name="pill"
          size={24}
          color="#000000"
        />

        {active ===
          'medicamentos' && (
          <View
            style={
              styles.activeIndicator
            }
          />
        )}
      </Pressable>

      {/* PERFIL */}

      <Pressable
        style={({ pressed }) => [
          styles.bottomItem,
          pressed &&
            active !== 'perfil' &&
            styles.pressed,
        ]}
        onPress={() =>
          navegar(
            'perfil',
            '/perfil'
          )
        }
      >
        <Ionicons
          name={
            active === 'perfil'
              ? 'person'
              : 'person-outline'
          }
          size={26}
          color="#000000"
        />

        {active === 'perfil' && (
          <View
            style={
              styles.activeIndicator
            }
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    paddingHorizontal: 8,

    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  bottomItem: {
    width: 50,
    height: 55,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  activeIndicator: {
    position: 'absolute',

    bottom: 3,

    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: '#000000',
  },

  pressed: {
    opacity: 0.65,
  },
});