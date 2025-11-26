if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "/Users/apple/Desktop/AkhilProfwork/Talk-Brush/TalkBrush/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/6m31516j/obj/x86_64/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/apple/Desktop/AkhilProfwork/Talk-Brush/TalkBrush/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

