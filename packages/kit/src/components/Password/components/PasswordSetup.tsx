import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl';
import { Keyboard } from 'react-native';

import {
  Button,
  Dialog,
  Divider,
  Form,
  Heading,
  Input,
  SizableText,
  Unspaced,
  View,
  useForm,
} from '@onekeyhq/components';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import timerUtils from '@onekeyhq/shared/src/utils/timerUtils';
import { EPasswordMode } from '@onekeyhq/shared/types/password';

import {
  PassCodeRegex,
  PasswordRegex,
  getPasswordKeyboardType,
} from '../utils';

import PassCodeInput, {
  AUTO_FOCUS_DELAY_MS,
  PIN_CELL_COUNT,
} from './PassCodeInput';

export interface IPasswordSetupForm {
  password: string;
  confirmPassword: string;
  passwordMode: EPasswordMode;
  passCode: string;
  confirmPassCode: string;
}
interface IPasswordSetupProps {
  loading: boolean;
  passwordMode: EPasswordMode;
  onSetupPassword: (data: IPasswordSetupForm) => void;
  biologyAuthSwitchContainer?: React.ReactNode;
  confirmBtnText?: string;
}

const PasswordSetup = ({
  loading,
  passwordMode,
  onSetupPassword,
  confirmBtnText,
  biologyAuthSwitchContainer,
}: IPasswordSetupProps) => {
  const intl = useIntl();
  const [currentPasswordMode, setCurrentPasswordMode] = useState(passwordMode);
  const [passCodeConfirm, setPassCodeConfirm] = useState(false);
  useEffect(() => {
    setCurrentPasswordMode(passwordMode);
  }, [passwordMode]);
  const form = useForm<IPasswordSetupForm>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
      passCode: '',
      confirmPassword: '',
      confirmPassCode: '',
      passwordMode: currentPasswordMode,
    },
  });
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureReentry, setSecureReentry] = useState(true);
  const [passCodeConfirmClear, setPassCodeConfirmClear] = useState(false);
  const passCodeFirstStep = useMemo(
    () => currentPasswordMode === EPasswordMode.PASSCODE && !passCodeConfirm,
    [currentPasswordMode, passCodeConfirm],
  );
  const confirmBtnTextMemo = useMemo(() => {
    if (passCodeFirstStep) {
      return intl.formatMessage({ id: ETranslations.global_next });
    }
    return (
      confirmBtnText ??
      intl.formatMessage({ id: ETranslations.auth_set_passcode })
    );
  }, [confirmBtnText, intl, passCodeFirstStep]);
  const onPassCodeNext = () => {
    setPassCodeConfirm(true);
    setTimeout(() => {
      form.setFocus('confirmPassCode');
    }, 150);
  };

  const clearPasscodeTimeOut = useCallback(() => {
    setPassCodeConfirmClear(false);
    setTimeout(() => {
      form.setValue('confirmPassCode', '');
      setPassCodeConfirmClear(true);
    }, 200);
  }, [form]);

  return (
    <>
      <Dialog.Header showExitButton={false} />
      {currentPasswordMode === EPasswordMode.PASSCODE && passCodeConfirm ? (
        <View>
          <SizableText
            size="$heading4xl"
            py="$px"
            ta="center"
            fontWeight="600"
            ls={-0.72}
          >
            {intl.formatMessage({
              id: ETranslations.auth_confirm_passcode_form_label,
            })}
          </SizableText>
          <SizableText
            size="$bodyLg"
            py="$px"
            ta="center"
            color="$textSubdued"
            ls={-0.16}
          >
            Confirm the passcode you just created
          </SizableText>
        </View>
      ) : (
        <View>
          <SizableText
            size="$heading4xl"
            py="$px"
            ta="center"
            fontWeight="600"
            ls={-0.72}
          >
            {intl.formatMessage({
              id: ETranslations.global_set_passcode,
            })}
          </SizableText>
          <SizableText
            size="$bodyLg"
            py="$px"
            ta="center"
            color="$textSubdued"
            ls={-0.16}
          >
            Set up your passcode to enhance wallet security
          </SizableText>
        </View>
      )}
      <Form form={form}>
        <>
          <Form.Field
            name="passCode"
            display={passCodeFirstStep ? 'flex' : 'none'}
            errorMessageAlign="center"
            rules={{
              validate: {
                required: (v) =>
                  v
                    ? undefined
                    : intl.formatMessage({
                        id: ETranslations.auth_error_passcode_empty,
                      }),
                minLength: (v: string) =>
                  v.length >= PIN_CELL_COUNT
                    ? undefined
                    : intl.formatMessage(
                        { id: ETranslations.auth_error_passwcode_too_short },
                        {
                          length: PIN_CELL_COUNT,
                        },
                      ),
                regexCheck: (v: string) =>
                  v.replace(PassCodeRegex, '') === v
                    ? undefined
                    : intl.formatMessage({
                        id: ETranslations.global_hex_data_error,
                      }),
              },
              onChange: () => {
                form.clearErrors();
              },
            }}
          >
            <PassCodeInput
              onPinCodeChange={(pin) => {
                form.setValue('passCode', pin);
                form.clearErrors('passCode');
              }}
              editable
              autoFocus
              onComplete={form.handleSubmit(onPassCodeNext)}
              autoFocusDelayMs={AUTO_FOCUS_DELAY_MS}
              testId="pass-code"
            />
          </Form.Field>
          <Form.Field
            display={passCodeFirstStep ? 'none' : 'flex'}
            name="confirmPassCode"
            errorMessageAlign="center"
            rules={{
              validate: {
                equal: (v, values) => {
                  if (passCodeFirstStep) {
                    return undefined;
                  }
                  const state = form.getFieldState('passCode');
                  if (!state.error) {
                    if (v !== values.passCode) {
                      clearPasscodeTimeOut();
                    }
                    return v !== values.passCode
                      ? intl.formatMessage({
                          id: ETranslations.auth_error_passcode_not_match,
                        })
                      : undefined;
                  }
                  return undefined;
                },
              },
              onChange: () => {
                form.clearErrors('confirmPassCode');
              },
            }}
          >
            <PassCodeInput
              onPinCodeChange={(pin) => {
                form.setValue('confirmPassCode', pin);
                form.clearErrors('confirmPassCode');
              }}
              editable
              autoFocus={passCodeConfirm}
              clearCodeAndFocus={passCodeConfirmClear}
              onComplete={form.handleSubmit(onSetupPassword)}
              autoFocusDelayMs={AUTO_FOCUS_DELAY_MS}
              testId="confirm-pass-code"
            />
            <Divider />
          </Form.Field>
        </>
        {!passCodeFirstStep ? (
          <Unspaced>{biologyAuthSwitchContainer}</Unspaced>
        ) : null}
        {currentPasswordMode === EPasswordMode.PASSWORD ? (
          <Button
            size="large"
            $gtMd={
              {
                size: 'medium',
              } as any
            }
            variant="primary"
            loading={loading}
            onPress={form.handleSubmit(
              passCodeFirstStep ? onPassCodeNext : onSetupPassword,
            )}
            testID="set-password"
          >
            {confirmBtnTextMemo}
          </Button>
        ) : null}
      </Form>
    </>
  );
};

export default memo(PasswordSetup);
