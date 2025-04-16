import React, { useState } from "react"
import { ScrollView, Animated, Text, TouchableOpacity } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import NotificationCard from "@/components/NotificationCard"
import { Box } from "@/components/ui/box"
import { useTheme } from "@/utils/Themes/ThemeProvider"
import BackHeader from "@/components/BackHeader"
import MyLinearGradient from "@/components/gradient/MyLinearGradient"
import CardUpRounded from "@/components/CardUpRounded"
import { useTranslation } from "react-i18next"

const NotificationsScreen = () => {
	const { appliedTheme } = useTheme()
	const { t } = useTranslation()

	const [notifications, setNotifications] = useState([
		{
			id: 1,
			title: t("notifications.items.waiting.title"),
			message: t("notifications.items.waiting.message"),
			timeAgo: t("notifications.items.waiting.timeAgo")
		},
		{
			id: 2,
			title: t("notifications.items.shipped.title"),
			message: t("notifications.items.shipped.message"),
			timeAgo: t("notifications.items.shipped.timeAgo")
		},
		{
			id: 3,
			title: t("notifications.items.success.title"),
			message: t("notifications.items.success.message"),
			timeAgo: t("notifications.items.success.timeAgo")
		}
	])

	const handleRemoveNotification = (id: number) => {
		setNotifications(prev => prev.filter(notification => notification.id !== id))
	}

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		id: number
	) => (
		<TouchableOpacity
			onPress={() => handleRemoveNotification(id)}
			className="bg-red-600 justify-center items-center w-20 rounded-lg"
		>
			<Text className="text-white font-semibold">{t("notifications.remove")}</Text>
		</TouchableOpacity>
	)

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<MyLinearGradient
				type="background"
				color={appliedTheme === "dark" ? "blue" : "purple"}
				className="h-1/6 p-4"
			>
				<BackHeader title={t("notifications.title")} colorScheme="alwaysWhite" />
			</MyLinearGradient>

			<CardUpRounded className={`bg-background-${appliedTheme} h-full p-4 gap-2 space-y-4`}>
				{notifications.map(notification => (
					<Swipeable
						key={notification.id}
						renderRightActions={progress => renderRightActions(progress, notification.id)}
					>
						<NotificationCard
							title={notification.title}
							message={notification.message}
							timeAgo={notification.timeAgo}
						/>
					</Swipeable>
				))}
			</CardUpRounded>
		</ScrollView>
	)
}

export default NotificationsScreen
