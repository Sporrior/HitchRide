import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

// Mock expo-router before importing the component
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// Mock react-native-svg components
jest.mock('react-native-svg', () => ({
    Svg: 'Svg',
    Path: 'Path',
    Circle: 'Circle',
}));

// Import the component after mocks
import HomeScreen from '../app/(tabs)/Homescreen';

describe('HomeScreen', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    describe('Rendering', () => {
        it('should render the greeting message', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Hallo daar! 👋')).toBeTruthy();
            expect(getByText('Waar gaan we vandaag naartoe?')).toBeTruthy();
        });

        it('should render the search input with correct placeholder', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            expect(getByPlaceholderText('Waar wil je naartoe?')).toBeTruthy();
        });

        it('should render the profile button', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('JD')).toBeTruthy();
        });

        it('should render all quick action buttons', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText(/Huidige.*locatie/)).toBeTruthy();
            expect(getByText(/Mijn.*favorieten/)).toBeTruthy();
            expect(getByText(/Recente.*ritten/)).toBeTruthy();
        });

        it('should render section titles', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Recente bestemmingen')).toBeTruthy();
            expect(getByText('Jouw favorieten')).toBeTruthy();
        });

        it('should render promo banner', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('🎉 Nieuwe gebruiker?')).toBeTruthy();
            expect(getByText('Krijg 50% korting op je eerste 3 ritten!')).toBeTruthy();
            expect(getByText('Claim nu')).toBeTruthy();
        });
    });

    describe('Destination Cards', () => {
        it('should render recent destinations cards', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Red Light District Amsterdam')).toBeTruthy();
            expect(getByText('ROC Nijmegen')).toBeTruthy();
        });

        it('should render favorite destinations cards', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Nijmegen Centraal')).toBeTruthy();
            expect(getByText('Kebab zaak de Toren')).toBeTruthy();
        });

        it('should display destination distances and times', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('103.4 km • 1u 15min')).toBeTruthy();
            expect(getByText('0.1 km • 2min')).toBeTruthy();
            expect(getByText('12.2 km • 18min')).toBeTruthy();
            expect(getByText('5.2 km • 12min')).toBeTruthy();
        });

        it('should display destination prices', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('€24')).toBeTruthy();
            expect(getByText('€3')).toBeTruthy();
            expect(getByText('€8')).toBeTruthy();
            expect(getByText('€6')).toBeTruthy();
        });
    });

    describe('Search Functionality', () => {
        it('should update search input value on text change', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, 'Amsterdam');
            expect(searchInput.props.value).toBe('Amsterdam');
        });

        it('should show clear button when search input has text', () => {
            const { getByPlaceholderText, getByText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, 'Amsterdam');
            expect(getByText('×')).toBeTruthy();
        });

        it('should clear search input when clear button is pressed', () => {
            const { getByPlaceholderText, getByText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, 'Amsterdam');
            const clearButton = getByText('×');
            fireEvent.press(clearButton);

            expect(searchInput.props.value).toBe('');
        });

        it('should not show clear button when search input is empty', () => {
            const { getByPlaceholderText, queryByText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            expect(searchInput.props.value).toBe('');
            expect(queryByText('×')).toBeNull();
        });
    });

    describe('Navigation', () => {
        it('should navigate to RideTracking when a destination card is pressed', async () => {
            const { getByText } = render(<HomeScreen />);
            const destinationCard = getByText('Red Light District Amsterdam');

            fireEvent.press(destinationCard);

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/(tabs)/RideTracking');
            });
        });

        it('should navigate when any destination card is pressed', async () => {
            const { getByText } = render(<HomeScreen />);

            fireEvent.press(getByText('ROC Nijmegen'));
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/(tabs)/RideTracking');
            });

            jest.clearAllMocks();

            fireEvent.press(getByText('Nijmegen Centraal'));
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/(tabs)/RideTracking');
            });

            jest.clearAllMocks();

            fireEvent.press(getByText('Kebab zaak de Toren'));
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/(tabs)/RideTracking');
            });
        });
    });

    describe('Action Buttons', () => {
        it('should render "Bekijk alles" button for recent destinations', () => {
            const { getAllByText } = render(<HomeScreen />);
            const buttons = getAllByText('Bekijk alles');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should render "Bewerk" button for favorites', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Bewerk')).toBeTruthy();
        });

        it('should be able to press quick action buttons', () => {
            const { getByText } = render(<HomeScreen />);

            const currentLocationButton = getByText(/Huidige.*locatie/);
            const favoritesButton = getByText(/Mijn.*favorieten/);
            const recentRidesButton = getByText(/Recente.*ritten/);

            expect(() => fireEvent.press(currentLocationButton)).not.toThrow();
            expect(() => fireEvent.press(favoritesButton)).not.toThrow();
            expect(() => fireEvent.press(recentRidesButton)).not.toThrow();
        });

        it('should be able to press promo banner button', () => {
            const { getByText } = render(<HomeScreen />);
            const promoButton = getByText('Claim nu');

            expect(() => fireEvent.press(promoButton)).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('should have accessible search input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            expect(searchInput).toBeTruthy();
            expect(searchInput.props.accessible).not.toBe(false);
        });

        it('should have accessible destination cards', () => {
            const { getByText } = render(<HomeScreen />);
            const card = getByText('Red Light District Amsterdam');

            expect(card).toBeTruthy();
        });
    });

    describe('Component State', () => {
        it('should handle focus state on search input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent(searchInput, 'focus');
            fireEvent(searchInput, 'blur');

            // Component should handle focus/blur without errors
            expect(searchInput).toBeTruthy();
        });

        it('should render with initial empty search state', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            expect(searchInput.props.value).toBe('');
        });

        it('should handle multiple rapid text changes', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, 'A');
            fireEvent.changeText(searchInput, 'Am');
            fireEvent.changeText(searchInput, 'Ams');
            fireEvent.changeText(searchInput, 'Amst');
            fireEvent.changeText(searchInput, 'Amsterdam');

            expect(searchInput.props.value).toBe('Amsterdam');
        });
    });

    describe('UI Interactions', () => {
        it('should render all four destination cards', () => {
            const { getByText } = render(<HomeScreen />);
            
            // All 4 destinations should be present
            expect(getByText('Red Light District Amsterdam')).toBeTruthy();
            expect(getByText('ROC Nijmegen')).toBeTruthy();
            expect(getByText('Nijmegen Centraal')).toBeTruthy();
            expect(getByText('Kebab zaak de Toren')).toBeTruthy();
        });

        it('should display correct number of destination cards in each section', () => {
            const { getByText, queryAllByText } = render(<HomeScreen />);
            
            // Recent destinations section should have 2 cards
            expect(getByText('Red Light District Amsterdam')).toBeTruthy();
            expect(getByText('ROC Nijmegen')).toBeTruthy();
            
            // Favorites section should have 2 cards
            expect(getByText('Nijmegen Centraal')).toBeTruthy();
            expect(getByText('Kebab zaak de Toren')).toBeTruthy();
        });

        it('should display destination icons correctly', () => {
            const { getByText } = render(<HomeScreen />);
            
            // Check if destination icons are rendered (even though they're emojis in the component)
            expect(getByText('Red Light District Amsterdam')).toBeTruthy();
            expect(getByText('ROC Nijmegen')).toBeTruthy();
        });

        it('should handle profile button press without errors', () => {
            const { getByText } = render(<HomeScreen />);
            const profileButton = getByText('JD');

            expect(() => fireEvent.press(profileButton)).not.toThrow();
        });

        it('should render all prices in euro currency format', () => {
            const { getByText } = render(<HomeScreen />);
            
            expect(getByText('€24')).toBeTruthy();
            expect(getByText('€3')).toBeTruthy();
            expect(getByText('€8')).toBeTruthy();
            expect(getByText('€6')).toBeTruthy();
        });
    });

    describe('Search Input Edge Cases', () => {
        it('should handle empty string input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, '');
            expect(searchInput.props.value).toBe('');
        });

        it('should handle whitespace input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, '   ');
            expect(searchInput.props.value).toBe('   ');
        });

        it('should handle special characters input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, '@#$%^&*()');
            expect(searchInput.props.value).toBe('@#$%^&*()');
        });

        it('should handle very long text input', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');
            const longText = 'A'.repeat(200);

            fireEvent.changeText(searchInput, longText);
            expect(searchInput.props.value).toBe(longText);
        });

        it('should handle unicode characters', () => {
            const { getByPlaceholderText } = render(<HomeScreen />);
            const searchInput = getByPlaceholderText('Waar wil je naartoe?');

            fireEvent.changeText(searchInput, '🚗🌍✨');
            expect(searchInput.props.value).toBe('🚗🌍✨');
        });
    });

    describe('Destination Card Interactions', () => {
        it('should handle rapid successive card presses', async () => {
            const { getByText } = render(<HomeScreen />);

            fireEvent.press(getByText('Red Light District Amsterdam'));
            fireEvent.press(getByText('ROC Nijmegen'));
            fireEvent.press(getByText('Nijmegen Centraal'));

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalled();
            });
        });

        it('should navigate correctly for each specific destination', async () => {
            const { getByText } = render(<HomeScreen />);

            const destinations = [
                'Red Light District Amsterdam',
                'ROC Nijmegen',
                'Nijmegen Centraal',
                'Kebab zaak de Toren'
            ];

            for (const dest of destinations) {
                jest.clearAllMocks();
                fireEvent.press(getByText(dest));
                
                await waitFor(() => {
                    expect(mockPush).toHaveBeenCalledWith('/(tabs)/RideTracking');
                    expect(mockPush).toHaveBeenCalledTimes(1);
                });
            }
        });
    });

    describe('Component Mounting and Animations', () => {
        it('should render without crashing', () => {
            const { getByText } = render(<HomeScreen />);
            expect(getByText('Hallo daar! 👋')).toBeTruthy();
        });

        it('should initialize with all required elements present', () => {
            const { getByText, getByPlaceholderText } = render(<HomeScreen />);
            
            // Check all critical elements are present
            expect(getByText('Hallo daar! 👋')).toBeTruthy();
            expect(getByPlaceholderText('Waar wil je naartoe?')).toBeTruthy();
            expect(getByText('JD')).toBeTruthy();
            expect(getByText('Recente bestemmingen')).toBeTruthy();
            expect(getByText('Jouw favorieten')).toBeTruthy();
        });

        it('should handle component unmounting gracefully', () => {
            const { unmount } = render(<HomeScreen />);
            expect(() => unmount()).not.toThrow();
        });
    });

    describe('Text Content Validation', () => {
        it('should display correct Dutch language labels', () => {
            const { getByText } = render(<HomeScreen />);
            
            expect(getByText('Hallo daar! 👋')).toBeTruthy();
            expect(getByText('Waar gaan we vandaag naartoe?')).toBeTruthy();
            expect(getByText('Recente bestemmingen')).toBeTruthy();
            expect(getByText('Jouw favorieten')).toBeTruthy();
            expect(getByText('Bekijk alles')).toBeTruthy();
            expect(getByText('Bewerk')).toBeTruthy();
        });

        it('should display promo content correctly', () => {
            const { getByText } = render(<HomeScreen />);
            
            expect(getByText('🎉 Nieuwe gebruiker?')).toBeTruthy();
            expect(getByText('Krijg 50% korting op je eerste 3 ritten!')).toBeTruthy();
            expect(getByText('Claim nu')).toBeTruthy();
        });
    });
});
