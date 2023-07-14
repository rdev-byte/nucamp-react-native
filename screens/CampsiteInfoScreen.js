import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavorite } from '../features/favorites/favoritesSlice';

const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    const toggleModal = () => {
        setShowModal(!showModal);
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
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={toggleModal}
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
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20,
    },
    buttonContainer: {
        margin: 20,
    },
});

export default CampsiteInfoScreen;
