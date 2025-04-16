import React, { useEffect, useState } from 'react'
import { Box } from '@/components/ui/box'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { Text } from '@/components/ui/text'
import { IC_Magnifier } from '@/utils/constants/Icons'
import { Button, ButtonText } from '@/components/ui/button'
import { ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import CardUpRounded from '../CardUpRounded'
import { idVerifyProps } from '@/types/NavigationTypes'
import * as ImageManipulator from 'expo-image-manipulator'
import { useTranslation } from 'react-i18next' // ✅ i18n hook

const ConfirmQuality = ({ handleScreenChange, finalData }: idVerifyProps) => {
  const { t } = useTranslation() // ✅ translation
  const { appliedTheme } = useTheme()

  const [croppedFrontImage, setCroppedFrontImage] = useState<string | null>(null)
  const [croppedBackImage, setCroppedBackImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cropArea =
    finalData?.type === 'Selfie'
      ? {
          cropX: 0.6,
          cropY: 0,
          cropWidth: 0.8,
          cropHeight: 1.5,
        }
      : {
          cropX: 0.4,
          cropY: 0.05,
          cropWidth: 1.2,
          cropHeight: 1.3,
        }

  const cropImageByUri = async (
    imageUri: string,
    cropArea: { cropX: number; cropY: number; cropWidth: number; cropHeight: number }
  ) => {
    const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      Image.getSize(imageUri, (width, height) => resolve({ width, height }), error => reject(error))
    })

    const cropX = width * cropArea.cropX
    const cropY = height * cropArea.cropY
    const cropWidth = width * cropArea.cropWidth
    const cropHeight = height * cropArea.cropHeight

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          crop: {
            originX: cropX,
            originY: cropY,
            width: cropWidth,
            height: cropHeight,
          },
        },
      ],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    )
    return result.uri
  }

  useEffect(() => {
    const cropImage = async () => {
      setIsLoading(true)

      if (finalData?.frontIdPhoto) {
        try {
          const croppedFront = await cropImageByUri(finalData.frontIdPhoto, cropArea)
          setCroppedFrontImage(croppedFront)
        } catch (error) {
          console.error('Error cropping front image:', error)
          setCroppedFrontImage(finalData.frontIdPhoto)
        }
      }

      if (finalData?.backIdPhoto) {
        try {
          const croppedBack = await cropImageByUri(finalData.backIdPhoto, cropArea)
          setCroppedBackImage(croppedBack)
        } catch (error) {
          console.error('Error cropping back image:', error)
          setCroppedBackImage(finalData.backIdPhoto)
        }
      }

      setIsLoading(false)
    }

    cropImage()
  }, [finalData])

  const handleContinue = () => {
    handleScreenChange('MAIN', {
      backIdPhoto: null,
      frontIdPhoto: null,
      type: null,
      ...(finalData?.type === 'Selfie' ? { isSelfie: true } : { isGov: true }),
    })
  }

  const handleRetake = () => {
    handleScreenChange('back', { backIdPhoto: null, frontIdPhoto: null })
  }

  return (
    <MyLinearGradient className="flex-1" type="background" color={appliedTheme === 'dark' ? 'dark' : 'light-blue'}>
      <Box className="flex-1 justify-between">
        <Box className="h-[25%]" />
        <CardUpRounded variant="card" className="justify-between items-center">
          <Box
            className={`relative -mt-[8rem] gap-1 bg-gray-800 border-white rounded-xl  
              ${finalData?.type === 'Selfie' ? 'w-[60%]' : 'w-[90%]'}
              ${['ID Card', 'Selfie'].includes(finalData?.type || '') ? 'h-[50%]' : 'h-[35%]'}`}
            style={{ boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.3)' }}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#a855f7" />
                <Text className="text-white mt-2">{t('confirm.processing')}</Text>
              </>
            ) : (
              <>
                <Image
                  source={
                    croppedFrontImage
                      ? { uri: croppedFrontImage }
                      : finalData?.frontIdPhoto
                      ? { uri: finalData.frontIdPhoto as string }
                      : require('@/assets/images/something-went-wrong.png')
                  }
                  alt="id image"
                  className={`rounded-xl border border-gray-400 w-full object-cover ${
                    finalData?.type === 'ID Card' ? ' h-1/2' : 'h-full'
                  }`}
                />
                {finalData?.type === 'ID Card' && (
                  <Image
                    source={
                      croppedBackImage
                        ? { uri: croppedBackImage }
                        : finalData?.backIdPhoto
                        ? { uri: finalData.backIdPhoto as string }
                        : require('@/assets/images/something-went-wrong.png')
                    }
                    alt="id image"
                    className="rounded-xl border border-gray-400 w-full h-1/2 object-cover"
                  />
                )}
              </>
            )}
          </Box>

          <Box className="items-center gap-4">
            <IC_Magnifier className="w-20 h-20" />
            <Text className={`text-text-${appliedTheme} font-bold text-[24px]`}>
              {t('confirm.title')}
            </Text>
            <Text className={`text-subText-${appliedTheme} text-center text-[16px]`}>
              {finalData?.type === 'Selfie'
                ? t('confirm.selfieInstruction')
                : t('confirm.idInstruction')}
            </Text>
          </Box>

          <Box className="items-center gap-6 mb-10 w-[93%]">
            <MyLinearGradient type="button" color="purple">
              <Button onPress={handleContinue}>
                <ButtonText className="text-center w-full font-semibold text-lg">
                  {t('confirm.continue')}
                </ButtonText>
              </Button>
            </MyLinearGradient>
            <TouchableOpacity onPress={handleRetake}>
              <Text className="text-[17px] text-purple-500 font-medium">
                {t('confirm.retake')}
              </Text>
            </TouchableOpacity>
          </Box>
        </CardUpRounded>
      </Box>
    </MyLinearGradient>
  )
}

export default ConfirmQuality
