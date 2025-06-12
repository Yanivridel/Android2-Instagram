import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import{ Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {IC_AddUsers, IC_Grid, IC_Tag, IC_Vi } from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import CardUpRounded from '@/components/CardUpRounded'
import ProfileTopBar from '@/components/profile/ProfileTopBar'
import { Button, ButtonText } from '@/components/ui/button'
import RatingPopup from '@/components/RatingPopup'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Dimensions, TextInput } from 'react-native';
import TouchableIcon from '@/components/TouchableIcon'
import { PostsGrid } from '@/components/post/PostsGrid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store'
import { IUser } from '@/types/userTypes'
import { getAllMyPosts, getPostsByUserId } from '@/utils/api/internal/postApi'
import { IPost } from '@/types/postTypes'
import SpinnerLoader from '@/components/SpinnerLoader'
import UserAvatar from '@/components/UserAvatar'
import { getUserById, updateUserBio } from '@/utils/api/internal/userApi'
import { getMyRatings } from '@/utils/api/internal/ratingApi'
import { updateBio, updateRatingStats } from '@/store/slices/userSlices'
import { createGetChat } from '@/utils/api/internal/chatApi'


const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 2;
const TAB_INDEX = {
	grid: 0,
	tag: 1,
}

interface ProfileRoute {
	params: {
		userId: string | null
	}
}

interface ProfileScreenProps extends Props {}

export default function ProfileScreen({ route, navigation }: ProfileScreenProps) {
	const { appliedTheme } = useTheme()
	const { userId } = (route as ProfileRoute).params || {};
	
	const currentUser = useSelector(
		(state: RootState) => state.currentUser
	) as unknown as IUser;
	const dispatch = useDispatch()
	const [currentTab, setCurrentTab] = useState<'grid' | 'tag'>('grid');
	const [profileUser, setProfileUser] = useState<IUser | null>(null);
	const [posts, setPosts] = useState<IPost[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isOwnProfile = !userId || currentUser._id === userId;
	const [profileEdit, setProfileEdit] = useState(false);
	const [editContent, setEditContent] = useState<string | null>(null);


	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				if (userId) {
					const [userDetails, userPosts] = await Promise.all([
						getUserById({ userId }),
						getPostsByUserId({ userId }),
					]);
					if(userDetails){
						setProfileUser(userDetails);
						setEditContent(userDetails.bio);
					}
					setPosts(userPosts);
				} else {
					const ratings = await getMyRatings();					
					if(ratings && ratings.ratingStats)
						dispatch(updateRatingStats(ratings.ratingStats));
					if (currentUser) {
						setProfileUser(currentUser);
						setEditContent(currentUser.bio);
					}
					const myPosts = await getAllMyPosts();
					setPosts(myPosts);
				}
			} catch (err) {
				console.error('Error loading profile data:', err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [userId]);

	const indicatorTranslateX = useSharedValue(0);
	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: indicatorTranslateX.value }],
	}));
	const handleTabPress = (tab: 'grid' | 'tag') => {
		setCurrentTab(tab);
		indicatorTranslateX.value = withTiming(TAB_INDEX[tab] * TAB_WIDTH, { duration: 300 });
	};

	const handleEditProfile = async () => {
		if(!editContent) return;
		await updateUserBio({ bio: editContent });
		dispatch(updateBio(editContent));
		setProfileEdit(false);
	}

	const handleNavToChat = async () => {
		try{
			const chat = await createGetChat({ anotherUser: (userId as string) });
			navigation.navigate("MainApp", { screen: "MessageScreen", params: { chatId: chat?._id, user: profileUser }})
		} catch(err) {
			console.log("Failed getting or creating Chat");
		}
	} 

	if (isLoading || !profileUser) {
		return <SpinnerLoader />;
	}

	return (
		<Box className="flex-1">
		<MyLinearGradient type="background" color={appliedTheme === 'dark' ? 'blue' : 'purple'}>
			<ProfileTopBar username={profileUser.username} navigation={navigation}/>
			<Box className="gap-2 p-4">
				{/* Avatar & Stats */}
				<Box className="flex-row w-full justify-between items-center">
					<UserAvatar 
						rating={profileUser.ratingStats.averageScore}
						username={profileUser.username}
						profileImage={profileUser.profileImage}
						sizePercent={30}
					/>

					<Box className="flex-row flex-1 justify-evenly p-4">
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">{posts?.length ?? 0}</Text>
							<Text className="text-white text-sm">Posts</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-[#FFD700] text-2xl font-bold">{profileUser.ratingStats.averageScore}</Text>
							<Text className="text-[#FFD700] text-sm">Rating</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Friends</Text>
						</Box>
					</Box>
				</Box>

				{/* Name & Bio */}
				<Box>
					<Box className='flex-row gap-2 items-center'>
						<Text className="text-white font-bold">{profileUser.username}</Text>
						<Text className="text-gray-300 text-sm">{profileUser.gender}</Text>
					</Box>
					{ !profileEdit ?
						<Text className="text-white text-[13px] leading-5">{editContent}</Text>
						:
						<Box className='flex-row gap-3 items-center'>
							<TextInput
								placeholder="Write a caption..."
								multiline
								value={editContent || ""}
								onChangeText={setEditContent}
								className="border border-gray-300 rounded-lg text-base w-[70%] text-white"
							/>
							<TouchableIcon
								Icon={IC_Vi}
								onPress={() => handleEditProfile()}
								IconClassName='h-5 w-5'
								color='#818cf8'
							>
							</TouchableIcon>
						</Box>
						}
					
				</Box>

				{/* Buttons (only on own profile) */}
				<Box className="flex-row gap-2 px-1">
					<MyLinearGradient type='button' color='light-blue' className='flex-1'>
						<Button className="h-fit"
						onPress={() => 
							isOwnProfile ? 
								setProfileEdit(true) : 
								handleNavToChat()
							} 
						>
							<ButtonText className="text-black">
								{isOwnProfile ? "Edit Profile": "Chat"}
							</ButtonText>
						</Button>
					</MyLinearGradient>
					<MyLinearGradient type='button' color='light-blue' className='w-[70px]'>
						<Button className="h-fit flex-1">
							<IC_AddUsers className="w-5 h-5" color="black" />
						</Button>
					</MyLinearGradient>
				</Box>

				<Box className="pb-2" />
			</Box>
		</MyLinearGradient>

		{/* Tabs & Posts */}
		<CardUpRounded className="-mt-5 px-0 pb-0">
			<Box className="relative">
				<Box className="flex-row gap-2 justify-evenly mb-2">
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('grid')} Icon={IC_Grid} IconClassName="w-8 h-8" />
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('tag')} Icon={IC_Tag} IconClassName="w-8 h-8" />
				</Box>

				<Animated.View
					style={[
						indicatorStyle,
						{
							width: TAB_WIDTH,
							height: 2,
							backgroundColor: 'black',
							position: 'absolute',
							bottom: 0,
							left: 0,
						},
					]}
				/>
			</Box>

			{posts?.length ? (
				<Box className="flex-1 mt-1">
					{currentTab === 'grid' && (
						<PostsGrid 
							posts={posts} 
							onPostPress={(post) => navigation.navigate("MainApp", {
								screen: "Home",
								params: { postId: post._id },
							})}
						/>
					)}
					{currentTab === 'tag' && (
						<Box className='justify-center items-center mt-10'>
							<Text className='p-4 color-indigo-600'>No one tagged you in a post yet</Text>
						</Box>
					)}
				</Box>
			) : (
				<Box className='justify-center items-center mt-10'>
					<Text className='p-4 color-indigo-600'>No Posts Found</Text>
				</Box>
			)}
		</CardUpRounded>
	</Box>
	);
	
}
