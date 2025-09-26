import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Modal,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    Platform,
    BackHandler,
    Alert
} from "react-native";
import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';
import DefaultButton from "../../components/buttons/DefaultButton";

const { height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [whereTo, setWhereTo] = useState('');
    const [name, setName] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Platform specific flags
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';
    const deviceType = Device.deviceType; // Reserved for potential future layout tweaks

    // Input refs for focus management
    const nameInputRef = useRef<TextInput>(null);
    const whereToInputRef = useRef<TextInput>(null);

    // Animation values
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);
    const modalSlideAnim = new Animated.Value(height);
    const overlayOpacity = new Animated.Value(0);

    useEffect(() => {
        // Start entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Reset modal animations to initial state
        modalSlideAnim.setValue(height);
        overlayOpacity.setValue(0);
    }, []);

    // Keyboard & Android back button handling
    useEffect(() => {
        const keyboardShowSub = Keyboard.addListener(
            isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                const extra = isAndroid ? 20 : 0; // mimic behavior used in index.tsx
                setKeyboardHeight(e.endCoordinates.height + extra);
            }
        );
        const keyboardHideSub = Keyboard.addListener(
            isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        let backHandler: any;
        if (isAndroid) {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (showModal) {
                    // If someday a modal is shown here we could close it
                    setShowModal(false);
                    return true;
                }
                return false;
            });
        }

        return () => {
            keyboardShowSub.remove();
            keyboardHideSub.remove();
            if (backHandler) backHandler.remove();
        };
    }, [showModal, isIOS, isAndroid]);

    // Handle modal animations when showModal state changes
    useEffect(() => {
        if (showModal) {
            // Animate modal in
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(modalSlideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animate modal out
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(modalSlideAnim, {
                    toValue: height,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showModal]);

    const handleContinue = () => {
        if (isSubmitting) return;

        // Simple validation - just check if fields have content
        if (isLogin && email.trim() && password.trim()) {
            setIsSubmitting(true);
            // Simulate API call delay
            setTimeout(() => {
                setIsSubmitting(false);
                router.push("/HomeScreen");
            }, 1000);
        } else if (!isLogin && email.trim() && password.trim() && name.trim()) {
            setIsSubmitting(true);
            // Simulate API call delay
            setTimeout(() => {
                setIsSubmitting(false);
                router.push("/HomeScreen");
            }, 1000);
        }
    };

    const isFormValid = (isLogin
        ? email.trim() && password.trim()
        : email.trim() && password.trim() && name.trim()) && !isSubmitting;

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={isAndroid ? '#ffffff' : undefined}
                translucent={isAndroid ? false : undefined}
                hidden={false}
            />
            <View style={styles.container}>
                <Animated.View style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <View style={styles.heroSection}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logo}>
                                <Text style={styles.logoText}>HitchRide</Text>
                            </View>
                        </View>

                        <Text style={styles.title}>
                            Waar wil je heen?
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={whereToInputRef}
                                style={[
                                    styles.input,
                                    focusedInput === 'whereTo' && styles.inputFocused
                                ]}
                                placeholder="Vul een bestemming in"
                                value={whereTo}
                                onChangeText={setWhereTo}
                                keyboardType="default"
                                autoCapitalize="sentences"
                                returnKeyType="next"
                                placeholderTextColor="#9ca3af"
                                textContentType="addressCity"
                                autoComplete="off"
                                onFocus={() => setFocusedInput('whereTo')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    </View>

                    <View style={styles.destinationSection}>
                        <View style={styles.destinationRow}>
                            <View style={styles.destinationIconBg}>
                                <Text style={styles.featureIcon}>🕛</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Redlight district Amsterdam</Text>
                                <Text style={styles.featureDesc}>103.4km</Text>
                            </View>
                        </View>

                        <View style={styles.destinationRow}>
                            <View style={styles.destinationIconBg}>
                                <Text style={styles.featureIcon}>🕛</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>ROC Nijmegen</Text>
                                <Text style={styles.featureDesc}>0.1km</Text>
                            </View>
                        </View>

                        <View style={styles.destinationRow}>
                            <View style={styles.destinationIconBg}>
                                <Text style={styles.featureIcon}>⭐</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Nijmegen centraal</Text>
                                <Text style={styles.featureDesc}>12.2km</Text>
                            </View>
                        </View>

                        <View style={styles.destinationRow}>
                            <View style={styles.destinationIconBg}>
                                <Text style={styles.featureIcon}>⭐</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Kebab zaak de Toren</Text>
                                <Text style={styles.featureDesc}>103.4km</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoContainer: {
        marginBottom: 32,
    },
    logo: {
        width: 80,
        height: 80,
        backgroundColor: "#000000",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 18,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    destinationSection: {
        paddingHorizontal: 4,
    },
    destinationRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    destinationIconBg: {
        width: 48,
        height: 48,
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    featureIcon: {
        fontSize: 22,
    },
    featureContent: {
        flex: 1,
        paddingTop: 2,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 6,
    },
    featureDesc: {
        fontSize: 15,
        color: "#6b7280",
        lineHeight: 22,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
    continueButton: {
        backgroundColor: "#000000",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    continueButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    termsText: {
        fontSize: 13,
        color: "#9ca3af",
        textAlign: "center",
        lineHeight: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    overlayTouchable: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
        marginTop: 100,
    },
    modalScrollView: {
        flex: 1,
    },
    modalScrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    modalHeader: {
        alignItems: "center",
        paddingTop: 12,
        paddingHorizontal: 24,
        paddingBottom: 8,
        position: "relative",
    },
    modalHandle: {
        width: 36,
        height: 4,
        backgroundColor: "#d1d5db",
        borderRadius: 2,
        marginBottom: 8,
    },
    closeButton: {
        position: "absolute",
        right: 24,
        top: 12,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        fontSize: 28,
        color: "#6b7280",
        fontWeight: "300",
    },
    modalBody: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
        minHeight: height * 0.6,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 32,
        lineHeight: 22,
    },
    formContainer: {
        width: "100%",
    },
    inputContainer: {
        marginBottom: 16,
        width: "100%",
    },
    input: {
        borderWidth: 1.5,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        fontSize: 16,
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: Platform.OS === 'ios' ? 52 : 56,
        width: "100%",
        textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
    },
    inputFocused: {
        borderColor: "#000000",
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }
        })
    },
    submitButton: {
        backgroundColor: "#000000",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    submitButtonDisabled: {
        backgroundColor: "#e5e7eb",
    },
    submitButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    submitButtonTextDisabled: {
        color: "#9ca3af",
    },
    switchButton: {
        alignItems: "center",
    },
    switchText: {
        fontSize: 16,
        color: "#6b7280",
    },
    switchLink: {
        color: "#000000",
        fontWeight: "600",
    },
});
