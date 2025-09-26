import * as React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Menu, Provider } from "react-native-paper";

type MenuItem = {
    title: string;
    onPress: () => void;
};

interface MenubarProps {
    items: MenuItem[];
}

export default function Menubar({ items }: MenubarProps) {
    const [visible, setVisible] = React.useState(false);

    return (
        <Provider>
            <View style={styles.container}>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <Button title="Show Menu" onPress={() => setVisible(true)} />
                    }
                >
                    {items.map((item, index) => (
                        <Menu.Item
                            key={index}
                            onPress={() => {
                                setVisible(false);
                                item.onPress();
                            }}
                            title={item.title}
                        />
                    ))}
                </Menu>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: "center",
    },
});
