import { useIntl } from 'react-intl';

import {
  Button,
  Heading,
  Image,
  LinearGradient,
  SizableText,
  Stack,
  ThemeableStack,
  Video,
} from '@onekeyhq/components';
import { MultipleClickStack } from '@onekeyhq/kit/src/components/MultipleClickStack';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@onekeyhq/shared/src/locale';

export function Welcome() {
  const intl = useIntl();
  const navigation = useAppNavigation();

  return (
    <Stack flex={1} bg="#000">
      <LinearGradient
        colors={['#6962F1', '#000']}
        locations={[0, 0.92]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          zIndex: 1,
        }}
      />
      <Video
        source={require('@onekeyhq/kit/assets/onboarding/welcome.mp4')}
        pos="absolute"
        top="$-10"
        w="180%"
        h="100%"
        zi={0}
        repeat
        resizeMode="cover"
        volume={0}
      />
      <Stack
        position="absolute"
        top="$0"
        left="$0"
        right="$0"
        bottom="$0"
        flex={1}
        zi={2}
        pt="$8"
        pb="$3"
      >
        <Stack
          fd="row"
          ai="center"
          alignSelf="center"
          bg="#414141"
          p={2}
          br={999}
        >
          <Stack py={8} px={16} br={999} bg="#414141">
            <SizableText
              width={76}
              ta="center"
              size="$bodyMd"
              color="#CACFD8"
              ls={-0.14}
            >
              App
            </SizableText>
          </Stack>
          <Stack py={8} px={16} br={999} bg="#fff">
            <SizableText
              width={76}
              ta="center"
              size="$bodyMd"
              color="#0E121B"
              ls={-0.14}
            >
              Wallet
            </SizableText>
          </Stack>
        </Stack>

        <Stack flex={1} justifyContent="flex-end" alignItems="center">
          <Stack zIndex={1} gap={12}>
            <Heading
              size="$heading5xl"
              textAlign="center"
              color="#fff"
              ls={-0.32}
            >
              {'Welcome to \nInterLink Wallet'}
            </Heading>
            <SizableText
              size="$bodyLg"
              textAlign="center"
              color="#fff"
              ls={-0.16}
            >
              Simple, secure crypto management
            </SizableText>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
