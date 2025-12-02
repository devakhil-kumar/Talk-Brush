import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Feather from '@react-native-vector-icons/feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../../contexts/ThemeProvider';
import GlobalStyles from '../../../../styles/GlobalStyles';
import Fonts from '../../../../styles/GlobalFonts';
import moment from 'moment';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const AddEventModal = ({ visible, onClose, onSubmit, editingEvent = null }) => {
    const { theme } = useTheme();
    const styles = style(theme);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [images, setImages] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (editingEvent) {
            setEventName(editingEvent.fullName || '');
            setDescription(editingEvent.description || '');
            if (editingEvent.date) {
                setDate(moment(editingEvent.date).toDate());
            }
            if (editingEvent.time) {
                const [hours, minutes] = editingEvent.time.split(':');
                const timeDate = new Date();
                timeDate.setHours(parseInt(hours), parseInt(minutes));
                setTime(timeDate);
            }
            if (editingEvent.pictures && editingEvent.pictures.length > 0) {
                const existingImages = editingEvent.pictures.map((pic, index) => ({
                    uri: pic,
                    isExisting: true,
                    id: `existing-${index}`
                }));
                setImages(existingImages);
            }
        } else {
            resetForm();
        }
    }, [editingEvent, visible]);

    const handleDateConfirm = (selectedDate) => {
        setDate(selectedDate);
        setShowDatePicker(false);
    };

    const handleTimeConfirm = (selectedTime) => {
        setTime(selectedTime);
        setShowTimePicker(false);
    };

    const convertImageToBase64 = async (uri) => {
        try {
            const resized = await ImageResizer.createResizedImage(uri, 800, 800, "JPEG", 60);
            const response = await fetch(resized.uri);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 0,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                Alert.alert('Error', 'Failed to pick image');
            } else if (response.assets && response.assets.length > 0) {
                setImages([...images, ...response.assets]);
            }
        });
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const formatUIDate = (date) => date ? moment(date).format('MM/DD/YYYY') : '';
    const formatUITime = (time) => time ? moment(time).format('hh:mm A') : '';
    const formatAPIDate = (date) => moment(date).format('YYYY-MM-DD');
    const formatAPITime = (time) => moment(time).format('HH:mm');

    const handleSubmit = async () => {
        if (!eventName.trim()) {
            Alert.alert('Error', 'Please enter event name');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter description');
            return;
        }
        if (!date) {
            Alert.alert('Error', 'Please select date');
            return;
        }
        if (!time) {
            Alert.alert('Error', 'Please select time');
            return;
        }

        const base64Images = [];
        for (const image of images) {
            if (image.isExisting) {
                base64Images.push(image.uri);
            } else {
                const base64 = await convertImageToBase64(image.uri);
                if (base64) {
                    base64Images.push(base64);
                }
            }
        }

        const eventData = {
            fullName: eventName,
            description: description,
            date: formatAPIDate(date),
            time: formatAPITime(time),
            pictures: base64Images,
        };
        onSubmit(eventData);
        handleClose();
    };

    const resetForm = () => {
        setEventName('');
        setDescription('');
        setDate(null);
        setTime(null);
        setImages([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {editingEvent ? 'Edit Event' : 'Add New Event'}
                        </Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>
                                Event Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter event name"
                                placeholderTextColor={theme.placeholder}
                                value={eventName}
                                onChangeText={setEventName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>
                                Description <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Enter event description"
                                placeholderTextColor={theme.placeholder}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Date <Text style={styles.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={date ? styles.inputText : styles.placeholderText}>
                                        {date ? formatUIDate(date) : 'mm/dd/yyyy'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Time <Text style={styles.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={time ? styles.inputText : styles.placeholderText}>
                                        {time ? formatUITime(time) : '--:-- --'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pictures (Optional)</Text>
                            <TouchableOpacity
                                style={styles.imagePickerButton}
                                onPress={handleImagePick}
                            >
                                <Feather name="image" size={20} color={theme.text} />
                                <Text style={styles.imagePickerText}>
                                    {images.length > 0 ? `${images.length} image(s) selected` : 'Choose from Gallery'}
                                </Text>
                            </TouchableOpacity>

                            {images.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.imageScrollContainer}
                                >
                                    {images.map((image, index) => (
                                        <View key={index} style={styles.imagePreviewContainer}>
                                            <Image
                                                source={{ uri: image.uri }}
                                                style={styles.imagePreview}
                                            />
                                            <TouchableOpacity
                                                style={styles.removeImageButton}
                                                onPress={() => removeImage(index)}
                                            >
                                                <Feather name="x" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(false)}
                date={date || new Date()}
                minimumDate={new Date()}
            />

            <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setShowTimePicker(false)}
                date={time || new Date()}
            />
        </Modal>
    );
};

export default AddEventModal;

const style = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: theme.background,
        borderTopLeftRadius: GlobalStyles.borderRadius.large,
        borderTopRightRadius: GlobalStyles.borderRadius.large,
        maxHeight: '90%',
        paddingBottom: GlobalStyles.padding.large,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: GlobalStyles.padding.large,
        paddingVertical: GlobalStyles.padding.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    title: {
        fontSize: moderateScale(20),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        paddingHorizontal: GlobalStyles.padding.large,
        paddingTop: GlobalStyles.padding.medium,
    },
    inputContainer: {
        marginBottom: GlobalStyles.margin.large,
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: theme.text,
        marginBottom: GlobalStyles.margin.small,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: theme.inputBackground || theme.background,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: GlobalStyles.borderRadius.small,
        paddingHorizontal: GlobalStyles.padding.medium,
        paddingVertical: GlobalStyles.padding.medium,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.text,
    },
    textArea: {
        height: 100,
        paddingTop: GlobalStyles.padding.medium,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: GlobalStyles.margin.large,
    },
    halfWidth: {
        width: '48%',
    },
    inputText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.text,
    },
    placeholderText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.placeholder || '#9CA3AF',
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.inputBackground || theme.background,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: GlobalStyles.borderRadius.small,
        paddingHorizontal: GlobalStyles.padding.medium,
        paddingVertical: GlobalStyles.padding.medium,
        gap: GlobalStyles.margin.small,
    },
    imagePickerText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.text,
    },
    imageScrollContainer: {
        marginTop: GlobalStyles.margin.medium,
    },
    imagePreviewContainer: {
        marginRight: GlobalStyles.margin.medium,
        position: 'relative',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: GlobalStyles.borderRadius.small,
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: GlobalStyles.padding.large,
        paddingTop: GlobalStyles.padding.medium,
        gap: GlobalStyles.margin.medium,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: GlobalStyles.borderRadius.small,
        paddingVertical: GlobalStyles.padding.medium,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterMedium,
        color: theme.text,
    },
    submitButton: {
        flex: 1,
        backgroundColor: theme.secandprimary,
        borderRadius: GlobalStyles.borderRadius.small,
        paddingVertical: GlobalStyles.padding.medium,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterMedium,
        color: '#FFFFFF',
    },
});
