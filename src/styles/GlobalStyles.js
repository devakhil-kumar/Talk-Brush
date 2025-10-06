import { Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const GlobalStyles = {
    windowWidth,
    windowHeight,

    margin: {
        small: 8,
        medium: 10,
        large: 15,
    },
    padding: {
        small: 10,
        medium: 16,
        large: 24,
    },

    borderRadius: {
        small: 8,
        medium: 10,
        large: 30,
        round: 50,
    },
    
};

export default GlobalStyles;