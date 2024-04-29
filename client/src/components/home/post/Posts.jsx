import React, { useEffect, useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { API } from '../../../service/api';
import Post from './Post';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await API.getAllPosts({ category: category || '' });
                if (response.isSuccess) {
                    setPosts(response.data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchData();
    }, [category]);

    const sharePost = async (post) => {
        const title = post.title;
        const author = post.username;
        const url = `${window.location.origin}/details/${post._id}`;
        const imageUrl = post.picture || 'default-image-url.jpg';
        
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
    
            const imageBlob = await response.blob();
            
            if (navigator.share) {
                const files = [];
                if (imageBlob) {
                    files.push(new File([imageBlob], 'image.jpg', { type: 'image/jpeg' }));
                }
    
                const shareData = {
                    title: title,
                    text: `Check out this post: ${title} by ${author}\n${url}`, // Include post title, author, and URL in the text
                    files: files
                };
    
                await navigator.share(shareData);
                console.log("Share successful");
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };
    
    
    
    
    
    
    return (
        <>
            {
                posts?.length ? posts.map(post => (
                    <Grid item lg={3} sm={4} xs={12} key={post._id}>
                        <Link style={{textDecoration: 'none', color: 'inherit'}} to={`details/${post._id}`}>
                            <Post 
                                post={post} 
                                sharePost={sharePost}
                            />
                        </Link>
                    </Grid>
                )) : <Box style={{color: '878787', margin: '30px 80px', fontSize: 18}}>
                        No data is available for the selected category
                    </Box>
            }
        </>
    )
}

export default Posts;
