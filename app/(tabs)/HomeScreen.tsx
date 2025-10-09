import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    Platform,
} from "react-native";
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router'
const { width, height } = Dimensions.get('window');

// Vector Icons
const SearchIcon = ({ size = 20, color = "#6b7280" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const LocationIcon = ({ size = 20, color = "#1E88E5" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
            stroke={color}
            strokeWidth="2"
        />
        <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
    </Svg>
);

const StarIcon = ({ size = 20, color = "#f59e0b", filled = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
        <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const CarIcon = ({ size = 20, color = "#1E88E5" }) => (
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

const ClockIcon = ({ size = 20, color = "#6b7280" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

interface Destination {
    icon: string;
    title: string;
    distance: string;
    time: string;
    price: string;
    bgColor: string;
    borderColor: string;
    favorite?: boolean;
}

export default function HomeScreen() {
    const router = useRouter();
    const [whereTo, setWhereTo] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const cardAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.stagger(100,
            cardAnims.map(anim =>
                Animated.spring(anim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            )
        ).start();
    }, []);

    const handleCardPress = (index: number) => {
        setSelectedCard(index);
        router.push('/(tabs)/RideTracking');
        setTimeout(() => setSelectedCard(null), 200);
    };

    const destinations: Destination[] = [
        {
            icon: "🔴",
            title: "Red Light District Amsterdam",
            distance: "103.4 km",
            time: "1u 15min",
            price: "€24",
            bgColor: "#fef2f2",
            borderColor: "#fee2e2"
        },
        {
            icon: "🏫",
            title: "ROC Nijmegen",
            distance: "0.1 km",
            time: "2min",
            price: "€3",
            bgColor: "#f0f9ff",
            borderColor: "#dbeafe"
        },
        {
            icon: "⭐",
            title: "Nijmegen Centraal",
            distance: "12.2 km",
            time: "18min",
            price: "€8",
            bgColor: "#fffbeb",
            borderColor: "#fef3c7",
            favorite: true
        },
        {
            icon: "🥙",
            title: "Kebab zaak de Toren",
            distance: "5.2 km",
            time: "12min",
            price: "€6",
            bgColor: "#fffbeb",
            borderColor: "#fef3c7",
            favorite: true
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <Animated.View style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <View style={styles.header}>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greeting}>Hallo daar! 👋</Text>
                        <Text style={styles.subGreeting}>Waar gaan we vandaag naartoe?</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Text style={styles.profileText}>JD</Text>
                    </TouchableOpacity>
                </View>

                <View style={[
                    styles.searchContainer,
                    focusedInput === 'whereTo' && styles.searchContainerFocused
                ]}>
                    <View style={styles.searchIcon}>
                        <SearchIcon
                            size={22}
                            color={focusedInput === 'whereTo' ? "#1E88E5" : "#9ca3af"}
                        />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Waar wil je naartoe?"
                        value={whereTo}
                        onChangeText={setWhereTo}
                        placeholderTextColor="#9ca3af"
                        onFocus={() => setFocusedInput('whereTo')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    {whereTo.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setWhereTo('')}
                        >
                            <Text style={styles.clearButtonText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                        <TouchableOpacity style={styles.quickActionCard}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#e8f5e9' }]}>
                                <LocationIcon size={24} color="#2e7d32" />
                            </View>
                            <Text style={styles.quickActionText}>Huidige{'\n'}locatie</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionCard}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#fff8e1' }]}>
                                <StarIcon size={24} color="#f57c00" />
                            </View>
                            <Text style={styles.quickActionText}>Mijn{'\n'}favorieten</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionCard}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#e3f2fd' }]}>
                                <ClockIcon size={24} color="#1976d2" />
                            </View>
                            <Text style={styles.quickActionText}>Recente{'\n'}ritten</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recente bestemmingen</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>Bekijk alles</Text>
                            </TouchableOpacity>
                        </View>

                        {destinations.slice(0, 2).map((dest, index) => (
                            <Animated.View
                                key={index}
                                style={{
                                    opacity: cardAnims[index],
                                    transform: [{
                                        translateY: cardAnims[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0]
                                        })
                                    }]
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.destinationCard,
                                        selectedCard === index && styles.destinationCardPressed
                                    ]}
                                    onPress={() => handleCardPress(index)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconContainer, {
                                        backgroundColor: dest.bgColor,
                                        borderColor: dest.borderColor
                                    }]}>
                                        <Text style={styles.destinationIcon}>{dest.icon}</Text>
                                    </View>
                                    <View style={styles.destinationInfo}>
                                        <Text style={styles.destinationTitle}>{dest.title}</Text>
                                        <View style={styles.destinationMeta}>
                                            <Text style={styles.destinationMetaText}>
                                                {dest.distance} • {dest.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.priceText}>{dest.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Jouw favorieten</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>Bewerk</Text>
                            </TouchableOpacity>
                        </View>

                        {destinations.slice(2).map((dest, index) => (
                            <Animated.View
                                key={index + 2}
                                style={{
                                    opacity: cardAnims[index + 2],
                                    transform: [{
                                        translateY: cardAnims[index + 2].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0]
                                        })
                                    }]
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.destinationCard,
                                        selectedCard === index + 2 && styles.destinationCardPressed
                                    ]}
                                    onPress={() => handleCardPress(index + 2)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconContainer, {
                                        backgroundColor: dest.bgColor,
                                        borderColor: dest.borderColor
                                    }]}>
                                        <Text style={styles.destinationIcon}>{dest.icon}</Text>
                                    </View>
                                    <View style={styles.destinationInfo}>
                                        <Text style={styles.destinationTitle}>{dest.title}</Text>
                                        <View style={styles.destinationMeta}>
                                            <Text style={styles.destinationMetaText}>
                                                {dest.distance} • {dest.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.priceText}>{dest.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

                    <View style={styles.promoBanner}>
                        <View style={styles.promoContent}>
                            <Text style={styles.promoTitle}>🎉 Nieuwe gebruiker?</Text>
                            <Text style={styles.promoText}>
                                Krijg 50% korting op je eerste 3 ritten!
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.promoButton}>
                            <Text style={styles.promoButtonText}>Claim nu</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    greetingContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 4,
    },
    subGreeting: {
        fontSize: 16,
        color: "#6b7280",
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1E88E5",
        alignItems: "center",
        justifyContent: "center",
    },
    profileText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 24,
        paddingHorizontal: 16,
        paddingVertical: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 2,
        borderColor: "transparent",
    },
    searchContainerFocused: {
        borderColor: "#1E88E5",
        shadowOpacity: 0.15,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000000",
        paddingVertical: 14,
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
    },
    clearButtonText: {
        fontSize: 20,
        color: "#6b7280",
        lineHeight: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    quickActionsContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 8,
        gap: 12,
    },
    quickActionCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
        textAlign: "center",
        lineHeight: 16,
    },
    section: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
    },
    seeAllText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1E88E5",
    },
    destinationCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    destinationCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.8,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        borderWidth: 1,
    },
    destinationIcon: {
        fontSize: 24,
    },
    destinationInfo: {
        flex: 1,
    },
    destinationTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 6,
    },
    destinationMeta: {
        flexDirection: "row",
        alignItems: "center",
    },
    destinationMetaText: {
        fontSize: 14,
        color: "#6b7280",
    },
    priceContainer: {
        backgroundColor: "#e8f5e9",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2e7d32",
    },
    priceText: {
        color: "#2e7d32",
        fontSize: 16,
        fontWeight: "bold",
    },
    promoBanner: {
        marginHorizontal: 20,
        marginTop: 32,
        backgroundColor: "#1E88E5",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#1E88E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 6,
    },
    promoText: {
        fontSize: 14,
        color: "#e3f2fd",
        lineHeight: 20,
    },
    promoButton: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    promoButtonText: {
        color: "#1E88E5",
        fontSize: 14,
        fontWeight: "bold",
    },
});
