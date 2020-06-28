import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavourite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        favourites: state.favourites,
    }
}

mapDispatchToProps = dispatch => ({
    postFavourite: (dishId) => dispatch(postFavourite(dishId)),
    postComment: (dishId, author, rating, comment) => dispatch(postComment(dishId, author, rating, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    if(dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}
                    >
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row'}}>
                        <Icon   
                            raised
                            reverse
                            name={ props.favourite ? 'heart' : 'heart-o' }
                            type='font-awesome'
                            color='#f50'
                            onPress={() =>props.favourite ? console.log('AlreadyFavourite') : props.onPress()}
                            />
                        <Icon   
                            raised
                            reverse
                            name= 'pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onPress1()}
                            />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={10} readonly startingValue={item.rating} style={{alignItems: 'flex-start'}} />
                <Text style={{fontSize: 12}}>{'-- ' + item.author+ ', ' + item.date}</Text>
            </View>
        );
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}/>
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
 
    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
        });
    }

    handleSubmit(dishId) {
        this.props.postComment(dishId,this.state.author,this.state.rating,this.state.comment);
    }

    markFavourite(dishId) {
        this.props.postFavourite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Detail'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                    favourite={this.props.favourites.some(el => el === dishId)}
                    onPress={() => this.markFavourite(dishId)}
                    onPress1={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId===dishId)}/>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal(); this.resetForm();}}
                    onRequestClose={() => {this.toggleModal(); this.resetForm();}}
                    >
                        <View style={{justifyContent: 'center', margin: 20}}>
                            <Rating
                            showRating
                            onFinishRating={value => this.setState({rating: value})}
                            style={{ paddingVertical: 10 }}
                            />
                            <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={value => this.setState({ author: value })}
                            />

                            <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={value => this.setState({ comment: value })}
                            />
                            <View style={{marginTop: 20}}> 
                                <Button 
                                    onPress={() => {this.handleSubmit(dishId); this.resetForm(); this.toggleModal();}}
                                    color='#512DA8'
                                    title='Submit'
                                    />
                            </View>

                            <View style={{marginTop: 20}}>
                                <Button style
                                    onPress={() => {this.toggleModal(); this.resetForm();}}
                                    color='grey'
                                    title='Cancel'
                                    />
                            </View>
                        </View>         
                </Modal>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);