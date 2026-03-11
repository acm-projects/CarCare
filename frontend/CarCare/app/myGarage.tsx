import { Image } from 'expo-image';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/styles/global';

type CarStatus = 'serviceNeeded' | 'oilChangeNeeded';

type Car = {
  id: string;
  name: string;
  subtitle: string;
  image: any;
  statuses: CarStatus[];
};

const MOCK_CARS: Car[] = [
  {
    id: '1',
    name: 'My Honda Civic',
    subtitle: '2017 Honda Civic',
    image: require('../assets/images/TypeR_HondaCivic_2017.png'),
    statuses: [],
  },
  {
    id: '2',
    name: 'My BMW 335i',
    subtitle: '2013 BMW 335i',
    image: require('../assets/images/335i_BMW.png'),
    statuses: ['serviceNeeded', 'oilChangeNeeded'],
  },
];

export default function MyGarageScreen() {
  const router = useRouter();

  const handleViewCar = (carId: string) => {
    router.push('../carNameEnter');
  };

  const handleCreateNew = () => {
    router.push('../vinEnter');
  };

  const handleLogout = () => {
    router.replace('../logIn');
  };

  return (
    <View style={[globalStyles.container, styles.screen]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Garage</Text>

        {MOCK_CARS.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onPressView={() => handleViewCar(car.id)}
          />
        ))}

        <NewCarCard onPress={handleCreateNew} />
      </ScrollView>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#8D8D8D" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

type CarCardProps = {
  car: Car;
  onPressView: () => void;
};

function CarCard({ car, onPressView }: CarCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carSubtitle}>{car.subtitle}</Text>

        {car.statuses.length > 0 && (
          <View style={styles.statusRow}>
            {car.statuses.map((status) => (
              <StatusPill key={status} status={status} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.viewButton} onPress={onPressView}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      <Image source={car.image} style={styles.carImage} contentFit="contain" />
    </View>
  );
}

type StatusPillProps = {
  status: CarStatus;
};

function StatusPill({ status }: StatusPillProps) {
  const label =
    status === 'serviceNeeded' ? 'service needed' : 'oil change needed';

  const iconName =
    status === 'serviceNeeded' ? 'warning' : 'construct-outline';

  return (
    <View style={styles.statusPill}>
      <Ionicons name={iconName} size={12} color="#F16063" />
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

type NewCarCardProps = {
  onPress: () => void;
};

function NewCarCard({ onPress }: NewCarCardProps) {
  return (
    <TouchableOpacity style={styles.newCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.newCardText}>Create new{'\n'}car profile</Text>
      <Ionicons name="add" size={54} color="#84D2F6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },

  scrollContent: {
    paddingTop: 90,
    paddingHorizontal: 22,
    paddingBottom: 140,
  },

  title: {
    marginTop: -80,
    fontSize: 52,
    fontWeight: '300',
    color: '#5FA8D3',
    marginBottom: 26,
    alignSelf: 'flex-start',
  },

  card: {
    width: '100%',
    minHeight: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  cardLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 8,
  },

  carName: {
    fontSize: 27,
    fontWeight: '400',
    color: '#5FA8D3',
    lineHeight: 34,
  },

  carSubtitle: {
    fontSize: 14,
    color: '#8D8D8D',
    marginTop: 4,
    marginBottom: 10,
  },

  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF8F8',
  },

  statusText: {
    fontSize: 11,
    color: '#8D8D8D',
    fontWeight: '500',
  },

  viewButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#84D2F6',
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 6,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 18,
  },

  carImage: {
    width: 220,
    height: 150,
    marginLeft: -10,
  },

  newCard: {
    width: '100%',
    minHeight: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  newCardText: {
    fontSize: 30,
    fontWeight: '300',
    color: '#84D2F6',
    lineHeight: 38,
  },

  logoutContainer: {
    position: 'absolute',
    bottom: 34,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  logoutText: {
    color: '#8D8D8D',
    fontSize: 18,
    fontWeight: '400',
  },
});