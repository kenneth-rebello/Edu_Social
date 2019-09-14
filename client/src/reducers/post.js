import {GET_POSTS, POST_ERROR, ADD_POST, CLEAR_POSTS, UPDATE_LIKES } from '../actions/types';

const initialState = {
    posts:[],
    post: null,
    loading:true,
    error:{}
}

export default function(state = initialState, action){

    const {type, payload} = action;
    
    switch(type){
        case GET_POSTS:
            return{
                ...state,
                posts: payload,
                loading:false
            };
        case ADD_POST:
            return{
                ...state,
                posts: [...state.posts, payload],
                loading: false
            };
        case POST_ERROR:
            return{
                ...state,
                error: payload,
                loading:false
            };
        case CLEAR_POSTS:
            return{
                ...state,
                posts:[],
                loading:true
            };
        case UPDATE_LIKES:
            return{
                ...state,
                posts: state.posts.map(post => post._id === payload.id ? {...post, likes:payload.likes} : post),
                loading:false
            }
        default:
            return state;
    }
}