import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { StyleSheet, Text } from 'react-native';
import {
  CodeField,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { SizableText, Stack, View, YStack } from '@onekeyhq/components';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { PassCodeRegex } from '../utils';

import type { TextInput } from 'react-native';

export const PIN_CELL_COUNT = 6;
export const AUTO_FOCUS_DELAY_MS = 380;

function BasicPassCodeInput(
  {
    onPinCodeChange,
    onComplete,
    disabledComplete,
    autoFocus,
    editable,
    // showMask,
    testId,
    clearCode,
    clearCodeAndFocus,
    autoFocusDelayMs = AUTO_FOCUS_DELAY_MS,
  }: {
    onPinCodeChange?: (pin: string) => void;
    onComplete?: () => void;
    disabledComplete?: boolean;
    autoFocus?: boolean;
    editable?: boolean;
    testId?: string;
    clearCode?: boolean;
    clearCodeAndFocus?: boolean;
    autoFocusDelayMs?: number;
    // showMask?: boolean;
  },
  forwardedRef: any,
) {
  const [pinValue, setPinValue] = useState('');

  const pinInputRef = useRef<TextInput>(null);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pinValue,
    setValue: setPinValue,
  });
  // const [enableMask, setEnableMask] = useState(true);
  // const toggleMask = () => setEnableMask((f) => !f);

  const cellStyles = StyleSheet.create({
    cell: {
      width: 16,
      height: 16,
    },
  });

  useImperativeHandle(forwardedRef, () => ({
    focus: () => {
      pinInputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (autoFocus && pinInputRef.current) {
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, autoFocusDelayMs);
    }
  }, [autoFocusDelayMs, autoFocus]);

  const renderCell = ({
    index,
    symbol,
  }: // isFocused,
  {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    const symbolBg = symbol ? '$borderActive' : '$transparent';
    const borderColor = editable ? '$borderActive' : '$transparent';
    return (
      <View
        key={index}
        w="14%"
        height={64}
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        borderWidth={1}
        borderRadius={12}
        borderColor={borderColor}
      >
        <SizableText
          fontSize="$heading2xl"
          textAlign="center"
          color="#0E121B"
          lh={32}
        >
          {symbol}
        </SizableText>
      </View>
    );
  };
  useEffect(() => {
    if (clearCode) {
      setPinValue('');
    }
  }, [clearCode]);

  useEffect(() => {
    if (clearCodeAndFocus) {
      setPinValue('');
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, AUTO_FOCUS_DELAY_MS);
    }
  }, [clearCodeAndFocus]);
  return (
    <CodeField
      autoFocus={false}
      testID={testId}
      ref={pinInputRef}
      rootStyle={{
        paddingVertical: 32,
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
      value={pinValue}
      onChangeText={(text) => {
        const newText = text.replace(PassCodeRegex, '');
        setPinValue(newText);
        onPinCodeChange?.(newText);
        if (newText.length === PIN_CELL_COUNT && !disabledComplete) {
          onComplete?.();
        }
      }}
      cellCount={PIN_CELL_COUNT}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={renderCell}
      {...props}
      secureTextEntry
      editable={editable}
    />

    // <YStack gap="$4">
    //   {showMask ? (
    //     <IconButton
    //       icon={enableMask ? 'EyeOutline' : 'EyeOffOutline'}
    //       onPress={toggleMask}
    //     />
    //   ) : null}
    // </YStack>
  );
}

const PassCodeInput = forwardRef(BasicPassCodeInput);
export default PassCodeInput;
