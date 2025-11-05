import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Feather from "@react-native-vector-icons/feather";
import GlobalStyles from '../../../../styles/GlobalStyles';
import { useTheme } from '../../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../../styles/GlobalFonts';


const ConfirmModal = ({ visible, onCancel, onConfirm }) => {
  const { theme } = useTheme();
  const styles = style(theme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onCancel}>
            <Feather name="x" size={20} color={theme.subText} />
          </TouchableOpacity>

          <Text style={styles.title}>Are you sure you want to delete?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>No, cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Yes, confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const style = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  title: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.InterSemiBold,
    marginTop: GlobalStyles.margin.small,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: GlobalStyles.margin.large * 2,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: GlobalStyles.margin.small,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor:theme.secandprimary,
    borderRadius: 8,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize:moderateScale(14),
    color:theme.subText,
    fontFamily:Fonts.InterMedium
  },
  confirmText: {
    color:theme.background,
    fontFamily:Fonts.InterSemiBold,
    fontSize:moderateScale(13)
  },
});
