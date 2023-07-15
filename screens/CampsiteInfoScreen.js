import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { Rating, Input } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';

const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={styles.commentText}>{item.text}</Text>
                <View style={styles.ratingContainer}>
                    <Rating
                        readonly
                        startingValue={item.rating}
                        imageSize={10}
                        style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    />
                </View>
                <Text style={styles.authorText}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const resetForm = () => {
        setRating(5);
        setAuthor('');
        setText('');
    };

    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };

        dispatch(postComment(newComment));

        resetForm();
        setShowModal(false);
    };

    return (
        <>
            <RenderCampsite
                campsite={campsite}
                isFavorite={favorites.includes(campsite.id)}
                markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                onShowModal={toggleModal}
            />
            <Text style={styles.commentsTitle}>Comments</Text>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 20,
                }}
                ListHeaderComponent={<></>}
            />
            <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={toggleModal}
            >
                <View style={[styles.modal, { margin: 10 }]}>
                    <Text style={styles.modalTitle}>Add a Comment</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>Rating:</Text>
                        <Rating
                            showRating
                            startingValue={rating}
                            imageSize={40}
                            onFinishRating={(rating) => setRating(rating)}
                            style={{ paddingVertical: 10 }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Author:</Text>
                        <Input
                            placeholder="Author"
                            leftIcon={{
                                type: 'font-awesome',
                                name: 'user-o',
                            }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={setAuthor}
                            value={author}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Comment:</Text>
                        <Input
                            placeholder="Comment"
                            leftIcon={{
                                type: 'font-awesome',
                                name: 'comment-o',
                            }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={setText}
                            value={text}
                            multiline
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={handleSubmit}
                            title="Submit"
                            color="#5637DD"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={() => {
                                toggleModal();
                                resetForm();
                            }}
                            title="Cancel"
                            color="#808080"
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30,
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    commentText: {
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        marginRight: 10,
    },
    authorText: {
        fontSize: 12,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        margin: 20,
    },
});

export default CampsiteInfoScreen;