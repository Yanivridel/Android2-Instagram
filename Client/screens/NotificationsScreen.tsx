import React, { useState } from "react"
import { ScrollView, Animated, Text, TouchableOpacity } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import NotificationCard from "@/components/NotificationCard"
import { Box } from "@/components/ui/box"
import { useTheme } from "@/utils/Themes/ThemeProvider"
import MyLinearGradient from "@/components/gradient/MyLinearGradient"
import CardUpRounded from "@/components/CardUpRounded"

const NotificationsScreen = () => {
	const { appliedTheme } = useTheme()

	const [notifications, setNotifications] = useState([
		{
			id: 1,
			title: "Waiting",
			message: "Your order is waiting",
			timeAgo: "2 hours ago"
		},
		{
			id: 2,
			title: "Shipped",
			message: "Your order has been shipped",
			timeAgo: "1 day ago"
		},
		{
			id: 3,
			title: "Success",
			message: "Your order has been delivered",
			timeAgo: "3 days ago"
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
			<Text className="text-white font-semibold">Remove</Text>
		</TouchableOpacity>
	)

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>

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
