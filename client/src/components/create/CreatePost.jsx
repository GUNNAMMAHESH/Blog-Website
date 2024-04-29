import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl, FormHelperText } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
};

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState('');
    const { account } = useContext(DataContext);

    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
    
    useEffect(() => {
        const getImage = async () => { 
            if(file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
                
                try {
                    const response = await API.uploadFile(data);
                    setPost(prevPost => ({ ...prevPost, picture: response.data }));
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        }
        getImage();
        setPost(prevPost => ({ ...prevPost, categories: location.search?.split('=')[1] || 'All' }));
        setPost(prevPost => ({ ...prevPost, username: account.username }));
    }, [file, location.search, account.username]);

    const savePost = async () => {
        // Reset error states
        setTitleError(false);
        setDescriptionError(false);

        // Check for empty title and description
        if (!post.title.trim() && !post.description.trim()) {
            setTitleError(true);
            setDescriptionError(true);
            return;
        }

        // Check for empty title
        if (!post.title.trim()) {
            setTitleError(true);
            return;
        }

        // Check for empty description
        if (!post.description.trim()) {
            setDescriptionError(true);
            return;
        }

        try {
            await API.createPost(post);
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    }

    return (
        <Container>
            <Image src={url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField 
                    onChange={handleChange} 
                    name='title' 
                    placeholder="Title"
                    error={titleError}  // Add error state
                />
                {titleError && <FormHelperText error>Please enter a title</FormHelperText>}
                <Button onClick={savePost} variant="contained" color="primary">Publish</Button>
            </StyledFormControl>

            <Textarea
                rowsMin={5} 
                placeholder="Tell your story..."
                name='description'
                onChange={handleChange}
                error={descriptionError}  // Add error state
            />
            {descriptionError && <FormHelperText error>Please enter a description</FormHelperText>}
        </Container>
    );
}

export default CreatePost;
