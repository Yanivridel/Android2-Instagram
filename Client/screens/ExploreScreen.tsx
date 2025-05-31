import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Box } from '@/components/ui/box';
import { PostsGrid } from '@/components/post/PostsGrid';

const dummyExplorePosts = Array.from({ length: 21 }).map((_, i) => ({
	id: `${i + 1}`,
	imageUrl: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIDBwIDCQAAAAAAAAABAgMEESExUQUSIjJBYXEjUhMUwRUzYoGRoaKx0f/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APoIDo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9232z/QGAAAAAAAAAAAAAAAAAAAAASdHpLam2/lxxzt/wABqw4cme/dx13n/SywdmY67Tmnvz0jhCZixUw0imOu1Ye2dakeaY6Y42x0rX4jZ73YEV4yYseSPqUrb5hEzdmYr7zimaT05wnAKDUaXNp/PXw/dHGGl0s8Y2nkr9X2bW299P4bfZ6T8NSs2KoZtE0tNbRMTHOJFRgAAABmtbXtFaxMzPpEMLzQaeuHBWdvHaN7T+iWrIq/yOp23/Bnb5homJrMxaJiY5xLpEPtPT1yYZyxHjpG+/WDVxTAKyAAA94cVs2WuOnOf7A26PTW1OTblSPNK8pSuOkUpG1Y5Q84MVcGKMdOUevV7ZtakAEUAAAAAA2iecQwyA5oBtgAAdDp7xkwUvXlNXPJGk1l9NO0R3qTzrKWLKvWjXXimkyzPrXux/NG/auPb91ffpwQdVqsmptE34VjlWPRJFtaAGmQABd9n6b8vi3tH1Lc/b2Q+y9N37/jXjw1nw+8rZm1qQARQAAAAAAAAAFVbsrJHky1n5jZFzaXPh43xzt1jjC/F1Mc0LvUaDDm3msdy/WsfoqtRpsunttkrw9LRyldTGkBUAAAAG3TYbZ80Y6+vOekNS80Gm/L4vFH1Lcbe3slqyJFKVx0ilI2rEbQyDLQAAAAAAAAAAAAAAxatb1mt4iazziWQFRrOz7Yt74d7U9Y9YQXSq/XaCL75MEbW9a9fhZUsVQTG07TwkaZAS9Bo51Fu/eNsUf5ewN3Zel70xnyRwjyR191oREREREbRHKBhuAAAAAAAAAAAAAAAAAAAAIur0VNR4qz3MnXr8oE9m6iJ2iKz7xZci6mK7T9mRExbPaLfw15LGIiIiIiIiOUQCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z`,
}));

const ExploreScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Box className="flex-1 bg-white pt-4">
        {/* 🔍 Search Bar */}
        <Box className="mb-4 px-4">
            <TextInput
            className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base text-black"
            placeholder="Search posts or accounts..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
        </Box>

        {/* 🖼️ Posts Grid */}
        <Box className="flex-1">
            <PostsGrid posts={dummyExplorePosts} onPostPress={() => {}} />
        </Box>
        </Box>
    );
};

export default ExploreScreen;
