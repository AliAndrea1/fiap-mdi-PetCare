import { router, usePathname } from 'expo-router';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRef } from 'react';

const menuItems = [
  {
    label: 'Carteira de Vacinação',
    type: 'material',
    icon: 'needle',
    route: '/vacinas',
  },
  {
    label: 'Consultas',
    type: 'ionicons',
    icon: 'calendar-outline',
    route: '/consultas',
  },
  {
    label: 'Medicamentos',
    type: 'material',
    icon: 'pill',
    route: '/medicamentos',
  },
  {
    label: 'Perfil Pet',
    type: 'ionicons',
    icon: 'paw-outline',
    route: '/perfil',
  },
] as const;

export default function TopMenu() {
  const pathname = usePathname();

  const scrollRef =
    useRef<ScrollView>(null);

  function scrollNext() {
    scrollRef.current?.scrollTo({
      x: 190,
      animated: true,
    });
  }

  function navegar(route: string) {
    if (pathname === route) {
      return;
    }

    router.push(route as any);
  }

  return (
    <View style={styles.wrapper}>
      {/* CARROSSEL */}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
        decelerationRate="fast"
      >
        {menuItems.map((item) => {
          const active =
            pathname === item.route;

          return (
            <Pressable
              key={item.route}
              onPress={() =>
                navegar(item.route)
              }
              style={({ pressed }) => [
                styles.item,
                active &&
                  styles.activeItem,
                pressed &&
                  !active &&
                  styles.pressed,
              ]}
            >
              {item.type ===
              'material' ? (
                <MaterialCommunityIcons
                  name={
                    item.icon as any
                  }
                  size={19}
                  color="#000000"
                />
              ) : (
                <Ionicons
                  name={
                    item.icon as any
                  }
                  size={19}
                  color="#000000"
                />
              )}

              <Text
                style={styles.text}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        <View
          style={styles.endSpace}
        />
      </ScrollView>

      {/* SETA */}

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          pressed &&
            styles.nextButtonPressed,
        ]}
        onPress={scrollNext}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#000000"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
  },

  scrollContent: {
    paddingLeft: 16,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },

  item: {
    height: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,

    borderWidth: 0,
    borderRadius: 12,

    backgroundColor: '#A7CDCE',

    shadowColor: '#526F70',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 4,
  },

  activeItem: {
    backgroundColor: '#B4D4D5',

    shadowOpacity: 0.24,

    elevation: 6,
  },

  pressed: {
    opacity: 0.7,
  },

  text: {
    marginLeft: 7,

    fontSize: 13,
    fontWeight: '500',

    color: '#000000',
  },

  nextButton: {
    position: 'absolute',

    right: 8,
    top: 12,

    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#B4D4D5',

    shadowColor: '#526F70',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.28,
    shadowRadius: 4,

    elevation: 8,

    zIndex: 10,
  },

  nextButtonPressed: {
    opacity: 0.7,
  },

  endSpace: {
    width: 35,
  },
});