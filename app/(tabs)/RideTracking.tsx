import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// --- Vector Icons ---
const CarIcon = ({ size = 24, color = "#1E88E5" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 11L6.5 6H17.5L19 11M5 11V18C5 18.5523 5.44772 19 6 19H7C7.55228 19 8 18.5523 8 18V17M5 11H19M19 11V18C19 18.5523 18.5523 19 18 19H17C16.4477 19 16 18.5523 16 18V17M8 17H16M8 17C8 15.3431 6.65685 14 5 14C3.34315 14 2 15.3431 2 17C2 18.6569 3.34315 20 5 20C6.65685 20 8 18.6569 8 17ZM16 17C16 15.3431 17.3431 14 19 14C20.6569 14 22 15.3431 22 17C22 18.6569 20.6569 20 19 20C17.3431 20 16 18.6569 16 17Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const PhoneIcon = ({ size = 20, color = "#ffffff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const MessageIcon = ({ size = 20, color = "#ffffff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M7 9H17M7 13H12M21 20L17.6757 18.3378C17.4237 18.2118 17.1656 18.1022 16.9026 18.0096L16 17.6893C14.6077 17.1825 13.0973 17 11.5499 17C7.35656 17 4 14.3177 4 11C4 7.68225 7.35656 5 11.5499 5C15.7432 5 19.0998 7.68225 19.0998 11C19.0998 12.0958 18.7579 13.1421 18.1499 14.0664L18 14.318V20Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const CloseIcon = ({ size = 24, color = "#000000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M18 6L6 18M6 6L18 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// --- Helper Functions ---
const calculateBearing = (prev: { latitude: number; longitude: number }, next: { latitude: number; longitude: number }) => {
    const lat1 = prev.latitude * Math.PI / 180;
    const lon1 = prev.longitude * Math.PI / 180;
    const lat2 = next.latitude * Math.PI / 180;
    const lon2 = next.longitude * Math.PI / 180;

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
};

const getCoordinatesForProgress = (progress: number, route: { latitude: number; longitude: number }[]) => {
    if (route.length < 2) return route[0] || null;

    const totalDistance = route.length - 1;
    const currentPosition = totalDistance * progress;
    const index = Math.floor(currentPosition);
    const subProgress = currentPosition - index;

    if (index >= route.length - 1) return route[route.length - 1];

    const start = route[index];
    const end = route[index + 1];

    const lat = start.latitude + (end.latitude - start.latitude) * subProgress;
    const lon = start.longitude + (end.longitude - start.longitude) * subProgress;

    return { latitude: lat, longitude: lon };
};

export default function RideTrackingScreen() {
    const [rideStatus, setRideStatus] = useState('arriving');
    const mapRef = useRef<MapView>(null);
    const [progress, setProgress] = useState(0);
    const [carCoordinate, setCarCoordinate] = useState({ latitude: 52.379189, longitude: 4.899431 });
    const [carBearing, setCarBearing] = useState(0);
    const slideUpAnim = useRef(new Animated.Value(300)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const driverInfo = {
        name: "Marco van der Berg",
        rating: 4.9,
        carModel: "Tesla Model 3",
        licensePlate: "AB-123-CD",
        eta: "3 min",
        profileInitials: "MB"
    };

    const routeCoordinates = [
        { latitude: 52.379189, longitude: 4.899431 },
        { latitude: 52.376, longitude: 4.895 },
        { latitude: 52.37, longitude: 4.885 },
        { latitude: 52.36, longitude: 4.87 },
        { latitude: 52.35, longitude: 4.85 },
        { latitude: 52.34, longitude: 4.82 },
        { latitude: 52.33, longitude: 4.79 },
        { latitude: 52.308616, longitude: 4.763889 },
    ];

    useEffect(() => {
        Animated.spring(slideUpAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }).start();

        const carAnimation = Animated.loop(
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: false,
            })
        );
        carAnimation.start();

        const listenerId = progressAnim.addListener(({ value }) => {
            setProgress(value * 100);
            const newCoordinate = getCoordinatesForProgress(value, routeCoordinates);
            if (newCoordinate) {
                const nextCoordinate = getCoordinatesForProgress(value + 0.001, routeCoordinates);
                const newBearing = calculateBearing(newCoordinate, nextCoordinate);
                setCarCoordinate(newCoordinate);
                setCarBearing(newBearing);
            }
        });

        setTimeout(() => {
            mapRef.current?.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 150, right: 50, bottom: 450, left: 50 },
                animated: true,
            });
        }, 1000);

        return () => {
            progressAnim.removeListener(listenerId);
            carAnimation.stop();
        };
    }, []);

    const pickupLocation = routeCoordinates[0];
    const destinationLocation = routeCoordinates[routeCoordinates.length - 1];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    ...pickupLocation,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Polyline coordinates={routeCoordinates} strokeColor="#1E88E5" strokeWidth={5} />
                <Marker coordinate={pickupLocation} title="Pickup">
                    <View style={styles.markerDot} />
                </Marker>
                <Marker coordinate={destinationLocation} title="Destination">
                    <View style={[styles.markerDot, { backgroundColor: '#F44336' }]} />
                </Marker>
                {carCoordinate && (
                    <Marker
                        anchor={{ x: 0.5, y: 0.5 }}
                        coordinate={carCoordinate}
                        rotation={carBearing}
                        flat
                    >
                        <CarIcon size={32} color="#1E88E5" />
                    </Marker>
                )}
            </MapView>

            <View style={styles.topStatusBar}>
                <TouchableOpacity style={styles.closeButton}>
                    <CloseIcon size={24} color="#000000" />
                </TouchableOpacity>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        {rideStatus === 'arriving' ? 'Driver is arriving' : 'On trip'}
                    </Text>
                    <Text style={styles.etaText}>ETA: {driverInfo.eta}</Text>
                </View>
            </View>

            <Animated.View style={[styles.bottomCard, { transform: [{ translateY: slideUpAnim }] }]}>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress}%` }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.driverInfoContainer}>
                    <View style={styles.driverAvatarContainer}>
                        <View style={styles.driverAvatar}>
                            <Text style={styles.driverInitials}>{driverInfo.profileInitials}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>⭐ {driverInfo.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>{driverInfo.name}</Text>
                        <Text style={styles.carInfo}>{driverInfo.carModel}</Text>
                        <Text style={styles.licensePlate}>{driverInfo.licensePlate}</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.phoneButton}>
                            <PhoneIcon size={20} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.messageButton}>
                            <MessageIcon size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tripDetails}>
                    <View style={styles.locationContainer}>
                        <View style={styles.locationDot} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>Pickup</Text>
                            <Text style={styles.locationAddress}>Amsterdam Centraal Station</Text>
                        </View>
                    </View>

                    <View style={styles.routeLine} />

                    <View style={styles.locationContainer}>
                        <View style={[styles.locationDot, { backgroundColor: '#F44336' }]} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>Destination</Text>
                            <Text style={styles.locationAddress}>Schiphol Airport</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel Ride</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    map: { ...StyleSheet.absoluteFillObject },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    topStatusBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    closeButton: { padding: 5 },
    statusContainer: { flex: 1, alignItems: 'center', marginLeft: -29 },
    statusText: { fontSize: 16, fontWeight: '600', color: '#333' },
    etaText: { fontSize: 14, color: '#666', marginTop: 2 },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    progressBarContainer: { marginBottom: 20 },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1E88E5',
        borderRadius: 2,
    },
    driverInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    driverAvatarContainer: { alignItems: 'center', marginRight: 15 },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    driverInitials: { color: '#ffffff', fontSize: 20, fontWeight: '600' },
    ratingContainer: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    ratingText: { fontSize: 12, color: '#333', fontWeight: '500' },
    driverDetails: { flex: 1 },
    driverName: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 2 },
    carInfo: { fontSize: 14, color: '#666', marginBottom: 2 },
    licensePlate: { fontSize: 14, color: '#666', fontWeight: '500' },
    actionButtons: { flexDirection: 'row' },
    phoneButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    messageButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tripDetails: { marginBottom: 20 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    locationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        marginRight: 15,
    },
    locationInfo: { flex: 1 },
    locationLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
    locationAddress: { fontSize: 16, color: '#333', fontWeight: '500' },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginLeft: 5,
        marginVertical: -5,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
