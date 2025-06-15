import React, { useRef } from 'react';
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import{ Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {IC_AddUsers, IC_Edit, IC_Grid, IC_Tag, IC_Vi, IC_Profile } from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import CardUpRounded from '@/components/CardUpRounded'
import ProfileTopBar from '@/components/profile/ProfileTopBar'
import { Button, ButtonText } from '@/components/ui/button'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Dimensions, Pressable, TextInput, FlatList } from 'react-native';
import TouchableIcon from '@/components/TouchableIcon'
import { PostsGrid } from '@/components/post/PostsGrid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store'
import { IUser } from '@/types/userTypes'
import { IGroup } from '@/types/groupTypes'
import { IPost } from '@/types/postTypes'
import SpinnerLoader from '@/components/SpinnerLoader'
import UserAvatar from '@/components/UserAvatar'
import { getGroupById, updateGroup, joinGroup, leaveGroup, getPostsByGroupId } from '@/utils/api/internal/groupApi'
import ImagePickerHandler, { ImagePickerHandlerRef } from '@/hooks/ImagePickerHandler';
import { uploadMedia } from '@/utils/api/external/CloudinaryAPI';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 2;
const TAB_INDEX = {
	grid: 0,
	members: 1,
}

interface GroupRoute {
	params: {
		groupId: string
	}
}

interface GroupScreenProps extends Props {}

export default function GroupScreen({ route, navigation }: GroupScreenProps) {
	const { appliedTheme } = useTheme()
	const { groupId } = (route as GroupRoute).params;
	
	const currentUser = useSelector(
		(state: RootState) => state.currentUser
	) as unknown as IUser;
	const dispatch = useDispatch()
	const [currentTab, setCurrentTab] = useState<'grid' | 'members'>('grid');
	const [groupData, setGroupData] = useState<IGroup | null>(null);
	const [posts, setPosts] = useState<IPost[] | null>(null);
	const [isLoadingGroup, setIsLoadingGroup] = useState(false);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [groupEdit, setGroupEdit] = useState(false);
	const [editContent, setEditContent] = useState<string | null>(null);
	const pickerRef = useRef<ImagePickerHandlerRef>(null);

	// Check if current user is member or manager
	const isMember = groupData?.members?.some(member => member._id === currentUser._id) || false;
	const isManager = groupData?.managers?.some(manager => manager._id === currentUser._id) || false;

	useEffect(() => {
		const fetchData = async () => {
			setIsLoadingGroup(true);
			setIsLoadingPosts(true);
			try {
				const [groupDetails, groupPosts] = await Promise.all([
					getGroupById({ groupId }),
					getPostsByGroupId({ groupId }),
				]);
				
				if(groupDetails){
					setGroupData(groupDetails);
					setEditContent(groupDetails.description || null);
				}
				setPosts(groupPosts);
			} catch (err) {
				console.error('Error loading group data:', err);
			} finally {
				setIsLoadingGroup(false);
				setIsLoadingPosts(false);
			}
		};
		fetchData();
	}, [groupId]);

	const indicatorTranslateX = useSharedValue(0);
	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: indicatorTranslateX.value }],
	}));
	
	const handleTabPress = (tab: 'grid' | 'members') => {
		setCurrentTab(tab);
		indicatorTranslateX.value = withTiming(TAB_INDEX[tab] * TAB_WIDTH, { duration: 300 });
	};

	const handleEditGroup = async () => {
		if(!editContent || !isManager) return;
		await updateGroup({ groupId, updates: { description: editContent } });
		setGroupData(prev => prev ? { ...prev, description: editContent } : prev);
		setGroupEdit(false);
	}

	const handleJoinLeaveGroup = async () => {
		try {
			if (isMember) {
				await leaveGroup({ groupId });
				setGroupData(prev => prev ? {
					...prev,
					members: prev.members.filter(member => member._id !== currentUser._id)
				} : prev);
			} else {
				await joinGroup({ groupId });
				setGroupData(prev => prev ? {
					...prev,
					members: [...prev.members, currentUser]
				} : prev);
			}
		} catch (err) {
			console.error('Error joining/leaving group:', err);
		}
	}

	const renderMemberItem = ({ item, isManagerItem = false }: { item: IUser, isManagerItem?: boolean }) => (
		<Pressable 
			className="flex-row items-center p-3 border-b border-gray-200"
			onPress={() => navigation.navigate("MainApp", { 
				screen: "Profile", 
				params: { userId: item._id } 
			})}
		>
			<UserAvatar 
				rating={item.ratingStats?.averageScore || 0}
				username={item.username}
				profileImage={item.profileImage}
				sizePercent={15}
			/>
			<Box className="ml-3 flex-1">
				<Text className="font-semibold text-base">{item.username}</Text>
				{isManagerItem && <Text className="text-indigo-600 text-sm">Manager</Text>}
			</Box>
		</Pressable>
	);

	if (isLoadingGroup || !groupData) {
		return <SpinnerLoader />;
	}

	return (
		<Box className="flex-1">
		<MyLinearGradient type="background" color={appliedTheme === 'dark' ? 'blue' : 'turquoise'}>
			<ProfileTopBar username={groupData.name} navigation={navigation}/>
			<Box className="gap-2 p-4">
				{/* Group Picture & Stats */}
				<Box className="flex-row w-full justify-between items-center relative">
					{ groupEdit && isManager &&
						<Box className='absolute top-4 -left-1 bg-white z-50 p-2 rounded-full'>
							<Pressable
								onPress={() => pickerRef.current?.pickImage()}
							>
								<IC_Edit className='w-5 h-5'/>
							</Pressable>

							<ImagePickerHandler
								ref={pickerRef}
								onImagePicked={async (uri) => {
									try {
										const cloudUri = await uploadMedia(uri, "Group Picture");
										if (cloudUri) {
											setGroupData(prev => prev ? { ...prev, groupPicture: cloudUri } : prev);
											await updateGroup({ groupId, updates:{ groupPicture: cloudUri } });
										}
									} catch (err) {
										console.error("Image upload failed:", err);
									}
								}}
							/>
						</Box>
					}

					<Box className="items-center">
						<Avatar className="w-24 h-24 border-4 border-white">
							{groupData.groupPicture ? (
								<AvatarImage source={{ uri: groupData.groupPicture }} />
							) : (
								<AvatarFallbackText className="text-white text-2xl font-bold">
									{groupData.name.charAt(0).toUpperCase()}
								</AvatarFallbackText>
							)}
						</Avatar>
					</Box>

					<Box className="flex-row flex-1 justify-evenly p-4">
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">{posts?.length ?? 0}</Text>
							<Text className="text-white text-sm">Posts</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-[#FFD700] text-2xl font-bold">{groupData.ratingLimit ?? 0}</Text>
							<Text className="text-[#FFD700] text-sm">Min Rating</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">{groupData.members?.length ?? 0}</Text>
							<Text className="text-white text-sm">Members</Text>
						</Box>
					</Box>
				</Box>

				{/* Group Name & Description */}
				<Box>
					<Box className='flex-row gap-2 items-center'>
						<Text className="text-white font-bold text-lg">{groupData.name}</Text>
						{groupData.ratingLimit > 0 && (
							<Text className="text-gray-300 text-sm">Rating: {groupData.ratingLimit}+</Text>
						)}
					</Box>
					{ !groupEdit ?
						<Text className="text-white text-[13px] leading-5">{editContent}</Text>
						:
						<Box className='flex-row gap-3 items-center'>
							<TextInput
								placeholder="Write a description..."
								multiline
								value={editContent || ""}
								onChangeText={setEditContent}
								className="border border-gray-300 rounded-lg text-base w-[70%] text-white p-2"
							/>
							<TouchableIcon
								Icon={IC_Vi}
								onPress={() => handleEditGroup()}
								IconClassName='h-5 w-5'
								color='#818cf8'
							/>
						</Box>
					}
				</Box>

				{/* Action Buttons */}
				<Box className="flex-row gap-2 px-1">
					<MyLinearGradient type='button' color='light-blue' className='flex-1'>
						<Button className="h-fit"
							onPress={() => 
								isManager ? 
									setGroupEdit(prev => !prev) : 
									handleJoinLeaveGroup()
							} 
						>
							<ButtonText className="text-black">
								{isManager ? 
									groupEdit ? "Close Edit" : "Edit Group"
									: 
									isMember ? "Leave Group" : "Join Group"
								}
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

		{/* Tabs & Content */}
		<CardUpRounded className="-mt-5 px-0 pb-0">
			<Box className="relative">
				<Box className="flex-row gap-2 justify-evenly mb-2">
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('grid')} Icon={IC_Grid} IconClassName="w-8 h-8" />
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('members')} Icon={IC_Profile} IconClassName="w-8 h-8" />
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

			<Box className="flex-1 mt-1">
				{currentTab === 'grid' && (
					<>
						{posts?.length ? (
							<PostsGrid 
								posts={posts} 
								onPostPress={(post) => navigation.navigate("MainApp", {
									screen: "Home",
									params: { postId: post._id },
								})}
							/>
						) : (
							<>
								{isLoadingPosts ? (
									<SpinnerLoader />
								) : (
									<Box className='justify-center items-center mt-10'>
										<Text className='p-4 color-indigo-600'>No Posts Found</Text>
									</Box>
								)}
							</>
						)}
					</>
				)}
				
				{currentTab === 'members' && (
					<Box className="flex-1">
						{groupData.members?.length ? (
							<FlatList
								data={[
									// Managers first
									...groupData.managers.map(manager => ({ ...manager, isManager: true })),
									// Then regular members (excluding managers)
									...groupData.members.filter(member => 
										!groupData.managers.some(manager => manager._id === member._id)
									).map(member => ({ ...member, isManager: false }))
								]}
								keyExtractor={(item) => item._id}
								renderItem={({ item }) => renderMemberItem({ item, isManagerItem: item.isManager })}
								showsVerticalScrollIndicator={false}
							/>
						) : (
							<Box className='justify-center items-center mt-10'>
								<Text className='p-4 color-indigo-600'>No Members Found</Text>
							</Box>
						)}
					</Box>
				)}
			</Box>
		</CardUpRounded>
	</Box>
	);
}