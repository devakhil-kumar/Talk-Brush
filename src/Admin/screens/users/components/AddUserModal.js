import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme } from '../../../../contexts/ThemeProvider';
import Fonts from '../../../../styles/GlobalFonts';
import { moderateScale } from 'react-native-size-matters';
import GlobalStyles from '../../../../styles/GlobalStyles';
import { validateForm } from '../../../../screens/authScreens/components/AuthValidator';

const AddUserModal = ({ visible, onClose, onSubmit, loading = false, editMode = false, userData = null }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (editMode && userData && visible) {
            setUsername(userData.fullName || '');
            setEmail(userData.email || '');
            setPhoneNumber(userData.phoneNumber || '');
        } else if (!visible) {
            resetForm();
        }
    }, [editMode, userData, visible]);

    useEffect(() => {
        if (isSubmitted) {
            const validationData = {
                isSignup: !editMode,
                username,
                email,
                phoneNumber,
            };
            if (!editMode) {
                validationData.password = password;
                validationData.confirmPassword = confirmPassword;
            }

            const errors = validateForm(validationData);
            setValidationErrors(errors);
        }
    }, [username, email, password, confirmPassword, phoneNumber, isSubmitted, editMode]);

    const handleSubmit = async () => {
        setIsSubmitted(true);

        const validationData = {
            isSignup: !editMode,
            username,
            email,
            phoneNumber,
            agree: true
        };
        if (!editMode) {
            validationData.password = password;
            validationData.confirmPassword = confirmPassword;
        }
        const errors = validateForm(validationData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors({});
        const data = editMode
            ? {
                fullName: username,
                email,
                phoneNumber,
            }
            : {
                fullName: username,
                email,
                password,
                phoneNumber,
                type: '3',
            };

        onSubmit(data);
        onClose()
    };

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setValidationErrors({});
        setIsSubmitted(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={handleClose}
                    >
                        <TouchableOpacity
                            style={styles.modalContainer}
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {editMode ? 'Edit User' : 'Add New User'}
                                </Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                    <Feather name="x" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                <View style={styles.formContainer}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <TextInput
                                        style={[styles.input, validationErrors.username && styles.errorInput]}
                                        placeholder="Enter full name"
                                        placeholderTextColor="#999"
                                        value={username}
                                        onChangeText={setUsername}
                                    />
                                    {validationErrors.username && (
                                        <Text style={styles.errorText}>{validationErrors.username}</Text>
                                    )}

                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={[styles.input, validationErrors.email && styles.errorInput]}
                                        placeholder="Enter email address"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {validationErrors.email && (
                                        <Text style={styles.errorText}>{validationErrors.email}</Text>
                                    )}

                                    <Text style={styles.label}>Phone Number</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#999"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                    />

                                    {/* Hide password fields in edit mode */}
                                    {!editMode && (
                                        <>
                                            <Text style={styles.label}>Password</Text>
                                            <View style={[styles.passwordContainer, validationErrors.password && styles.errorInput]}>
                                                <TextInput
                                                    style={styles.passwordInput}
                                                    placeholder="Enter password"
                                                    placeholderTextColor="#999"
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={!showPassword}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    style={styles.eyeIcon}
                                                >
                                                    <Feather
                                                        name={showPassword ? 'eye' : 'eye-off'}
                                                        size={20}
                                                        color="#666"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {validationErrors.password && (
                                                <Text style={styles.errorText}>{validationErrors.password}</Text>
                                            )}

                                            <Text style={styles.label}>Confirm Password</Text>
                                            <View style={[styles.passwordContainer, validationErrors.confirmPassword && styles.errorInput]}>
                                                <TextInput
                                                    style={styles.passwordInput}
                                                    placeholder="Re-enter password"
                                                    placeholderTextColor="#999"
                                                    value={confirmPassword}
                                                    onChangeText={setConfirmPassword}
                                                    secureTextEntry={!showConfirmPassword}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={styles.eyeIcon}
                                                >
                                                    <Feather
                                                        name={showConfirmPassword ? 'eye' : 'eye-off'}
                                                        size={20}
                                                        color="#666"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {validationErrors.confirmPassword && (
                                                <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
                                            )}
                                        </>
                                    )}
                                </View>
                            </ScrollView>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={handleClose}
                                    disabled={loading}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.submitText}>
                                            {editMode ? 'Update User' : 'Add User'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default AddUserModal;

const createStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        width: GlobalStyles.windowWidth,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: '85%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.InterBold,
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingTop: 3,
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: '#000',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: '#000',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: '#000',
    },
    eyeIcon: {
        paddingHorizontal: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 15,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: '#666',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: theme.secandprimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    }
});