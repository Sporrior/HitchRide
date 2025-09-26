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
    Alert,
    BackHandler
} from "react-native";
import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';
import DefaultButton from "../../components/buttons/DefaultButton";

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Platform-specific settings
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';
    const deviceType = Device.deviceType;

    // Input refs for focus management
    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

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

    // Platform-specific keyboard event listeners and back handler
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                const keyboardHeightValue = isIOS ? e.endCoordinates.height : e.endCoordinates.height + 20;
                setKeyboardHeight(keyboardHeightValue);
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        // Android back button handler for modal
        let backHandler: any;
        if (isAndroid) {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (showModal) {
                    closeModal();
                    return true; // Prevent default back action
                }
                return false; // Allow default back action
            });
        }

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, [showModal]);

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

    const openModal = () => {
        console.log('Opening modal...');
        // Platform-specific haptic feedback
        if (isIOS) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (isAndroid) {
            Haptics.selectionAsync();
        }
        setShowModal(true);

        // Focus first input after modal animation with platform-specific timing
        const focusDelay = isIOS ? 600 : 500;
        setTimeout(() => {
            if (isLogin) {
                emailInputRef.current?.focus();
            } else {
                nameInputRef.current?.focus();
            }
        }, focusDelay);
    };

    const closeModal = () => {
        // Dismiss keyboard first with platform-specific approach
        if (isIOS) {
            Keyboard.dismiss();
        } else if (isAndroid) {
            // Force dismiss keyboard on Android
            Keyboard.dismiss();
            // Additional Android-specific keyboard dismiss
            setTimeout(() => Keyboard.dismiss(), 100);
        }

        // Platform-specific haptic feedback
        if (isIOS) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (isAndroid) {
            Haptics.selectionAsync();
        }

        // Animate modal out then close
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: isIOS ? 200 : 150,
                useNativeDriver: true,
            }),
            Animated.timing(modalSlideAnim, {
                toValue: height,
                duration: isIOS ? 250 : 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowModal(false);
            setEmail('');
            setPassword('');
            setName('');
            setFocusedInput(null);
            setIsSubmitting(false);
        });
    };

    const handleContinue = () => {
        if (isSubmitting) return;

        // Dismiss keyboard immediately when inloggen is clicked
        Keyboard.dismiss();

        // Platform-specific haptic feedback for button press
        if (isIOS) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (isAndroid) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Simple validation - just check if fields have content
        if (isLogin && email.trim() && password.trim()) {
            setIsSubmitting(true);

            // Simulate API call delay
            setTimeout(() => {
                // Close modal first, then navigate
                closeModal();

                // Navigate after modal close animation
                setTimeout(() => {
                    setIsSubmitting(false);
                    router.push("/HomeScreen");
                }, isIOS ? 300 : 250);
            }, 1000);

        } else if (!isLogin && email.trim() && password.trim() && name.trim()) {
            setIsSubmitting(true);

            // Simulate API call delay
            setTimeout(() => {
                // Close modal first, then navigate
                closeModal();

                // Navigate after modal close animation
                setTimeout(() => {
                    setIsSubmitting(false);
                    router.push("/HomeScreen");
                }, isIOS ? 300 : 250);
            }, 1000);
        } else {
            // Show platform-specific validation error
            const errorMessage = isLogin
                ? 'Vul je e-mailadres en wachtwoord in'
                : 'Vul alle velden in';

            if (isIOS) {
                Alert.alert('Oeps!', errorMessage, [{ text: 'OK' }]);
            } else if (isAndroid) {
                Alert.alert('Fout', errorMessage, [{ text: 'OK' }]);
            }
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setName('');

        // Focus appropriate input after mode switch
        setTimeout(() => {
            if (!isLogin) {
                // Switching to register, focus name field
                nameInputRef.current?.focus();
            } else {
                // Switching to login, focus email field
                emailInputRef.current?.focus();
            }
        }, 100);
    };

    const isFormValid = (isLogin
        ? email.trim() && password.trim()
        : email.trim() && password.trim() && name.trim()) && !isSubmitting;

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={isAndroid ? "#ffffff" : undefined}
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
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logo}>
                                <Text style={styles.logoText}>HitchRide</Text>
                            </View>
                        </View>

                        <Text style={styles.title}>
                            Ga overal naartoe
                        </Text>

                        <Text style={styles.subtitle}>
                            Veilig, betrouwbaar en betaalbaar vervoer op aanvraag
                        </Text>
                    </View>

                    {/* Features */}
                    <View style={styles.featuresSection}>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIconBg}>
                                <Text style={styles.featureIcon}>🛡️</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Veilig reizen</Text>
                                <Text style={styles.featureDesc}>Alle chauffeurs zijn geverifieerd met ID-controle en rijbewijs verificatie</Text>
                            </View>
                        </View>

                        <View style={styles.featureRow}>
                            <View style={styles.featureIconBg}>
                                <Text style={styles.featureIcon}>⚡</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Snel gevonden</Text>
                                <Text style={styles.featureDesc}>Match binnen 2 minuten met chauffeurs in jouw buurt</Text>
                            </View>
                        </View>

                        <View style={styles.featureRow}>
                            <View style={styles.featureIconBg}>
                                <Text style={styles.featureIcon}>💰</Text>
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Eerlijke prijzen</Text>
                                <Text style={styles.featureDesc}>Geen verrassingen - je ziet de prijs per kilometer vooraf</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Bottom Button */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.continueButton} onPress={openModal}>
                        <Text style={styles.continueButtonText}>Aan de slag</Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        Door door te gaan ga je akkoord met onze voorwaarden
                    </Text>
                </View>
            </View>

            {/* Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeModal}
                statusBarTranslucent={isAndroid}
                presentationStyle={isIOS ? 'overFullScreen' : undefined}
                supportedOrientations={['portrait']}
                hardwareAccelerated={isAndroid}
            >
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                        <TouchableOpacity
                            style={styles.overlayTouchable}
                            activeOpacity={1}
                            onPress={closeModal}
                        />
                    </Animated.View>

                    <KeyboardAvoidingView
                        behavior={isIOS ? 'padding' : 'height'}
                        keyboardVerticalOffset={isIOS ? 0 : 20}
                        style={styles.keyboardAvoidingView}
                        enabled={true}
                    >
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [{ translateY: modalSlideAnim }],
                                    marginBottom: keyboardHeight > 0 ? (
                                        isAndroid
                                            ? Math.max(keyboardHeight - 50, 0)
                                            : Math.max(keyboardHeight - 400, 0)
                                    ) : 0,
                                }
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <View style={styles.modalHandle} />
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={styles.modalScrollView}
                                contentContainerStyle={styles.modalScrollContent}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalTitle}>
                                        {isLogin ? 'Welkom terug' : 'Account aanmaken'}
                                    </Text>

                                    <Text style={styles.modalSubtitle}>
                                        {isLogin
                                            ? 'Voer je gegevens in om door te gaan'
                                            : 'Maak een account aan om te beginnen'
                                        }
                                    </Text>

                                    <View style={styles.formContainer}>
                                        {!isLogin && (
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    ref={nameInputRef}
                                                    style={[
                                                        styles.input,
                                                        focusedInput === 'name' && styles.inputFocused
                                                    ]}
                                                    placeholder="Volledige naam"
                                                    value={name}
                                                    onChangeText={setName}
                                                    autoCapitalize="words"
                                                    returnKeyType="next"
                                                    placeholderTextColor="#9ca3af"
                                                    blurOnSubmit={false}
                                                    onFocus={() => setFocusedInput('name')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    onSubmitEditing={() => emailInputRef.current?.focus()}
                                                    textContentType={isIOS ? "name" : undefined}
                                                    importantForAutofill={isAndroid ? "yes" : undefined}
                                                    autoComplete={isAndroid ? "name" : undefined}
                                                />
                                            </View>
                                        )}

                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                ref={emailInputRef}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'email' && styles.inputFocused
                                                ]}
                                                placeholder="E-mailadres"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                returnKeyType="next"
                                                placeholderTextColor="#9ca3af"
                                                blurOnSubmit={false}
                                                textContentType={isIOS ? "emailAddress" : undefined}
                                                autoComplete={isAndroid ? "email" : "email"}
                                                importantForAutofill={isAndroid ? "yes" : undefined}
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                onSubmitEditing={() => passwordInputRef.current?.focus()}
                                                autoCorrect={false}
                                                spellCheck={false}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                ref={passwordInputRef}
                                                style={[
                                                    styles.input,
                                                    focusedInput === 'password' && styles.inputFocused
                                                ]}
                                                placeholder="Wachtwoord"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                                returnKeyType="done"
                                                placeholderTextColor="#9ca3af"
                                                textContentType={isIOS ? "password" : undefined}
                                                autoComplete={isAndroid ? "password" : "password"}
                                                importantForAutofill={isAndroid ? "yes" : undefined}
                                                onFocus={() => setFocusedInput('password')}
                                                onBlur={() => setFocusedInput(null)}
                                                onSubmitEditing={handleContinue}
                                                autoCorrect={false}
                                                spellCheck={false}
                                                passwordRules={isIOS ? "minlength: 6;" : undefined}
                                            />
                                        </View>

                                        <TouchableOpacity
                                            style={[
                                                styles.submitButton,
                                                (!isFormValid || isSubmitting) && styles.submitButtonDisabled
                                            ]}
                                            onPress={handleContinue}
                                            disabled={!isFormValid || isSubmitting}
                                        >
                                            <Text style={[
                                                styles.submitButtonText,
                                                (!isFormValid || isSubmitting) && styles.submitButtonTextDisabled
                                            ]}>
                                                {isSubmitting
                                                    ? 'Bezig...'
                                                    : (isLogin ? 'Inloggen' : 'Account aanmaken')
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
                                            <Text style={styles.switchText}>
                                                {isLogin ? 'Nog geen account? ' : 'Al een account? '}
                                                <Text style={styles.switchLink}>
                                                    {isLogin ? 'Registreer' : 'Log in'}
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
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
        backgroundColor: "#1E88E5",
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
    featuresSection: {
        paddingHorizontal: 4,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    featureIconBg: {
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
    keyboardAvoidingView: {
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
        maxHeight: Platform.OS === 'ios' ? height * 0.85 : height * 0.90,
        minHeight: Platform.OS === 'ios' ? height * 0.5 : height * 0.55,
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    modalScrollView: {
        flex: 1,
    },
    modalScrollContent: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 30 : 50,
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
        paddingBottom: 20,
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
        textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
    },
    inputFocused: {
        borderColor: "#000000",
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
        }),
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
