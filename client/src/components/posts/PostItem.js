import React ,{Fragment} from 'react';
import './post.css'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import {connect} from 'react-redux';
import Spinner from '../layouts/Spinner';
import {deletePost, addLike, removeLike} from '../../actions/post';
import {approvePost} from '../../actions/admin';
import PostImage from './PostImage'


const PostItem = ({auth, post, addLike, removeLike, approvePost, deletePost}) => {

    let { _id, text, url, approved, name, picture, user, likes, comments, date } = post;

    return (
        <Fragment>
        {auth && post? 
        (<Fragment>
            <div className="post">
                <div>
                    <Link to={`/profile/${user}`} className="post-user">
                        {picture && <img className="item-img" src={`/image/${picture}`} alt=""/>}
                        <h1 className="name">{name}</h1>
                    </Link>
                </div>
        
                <div className="post-data">
                    <p className="post-text">{text}</p>
                    {url && <PostImage upload={url}/>}
                    <p className="post-date">
                        Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
                    </p>
                    <div>
                        { approved && auth && auth.user && (<Fragment>
                            { likes.filter(like => like.user._id === auth.user._id).length>0 ? (
                                <button type="button" className="btn btn-red" onClick={() => removeLike(_id)}>
                                <span><i class="fa fa-thumbs-down"></i></span>{` `}
                                </button>
                            ):(
                                <button type="button" className="btn btn-green" onClick={() => addLike(_id)}>
                                <span><i class="fa fa-thumbs-up"></i></span>{ ` `}
                                </button>)
                            }
                            <span className="likes">{likes.length} Likes</span>
                            <Link to={`/post/${_id}`}className="btn btn-gold">
                                <i className="fa fa-comments"></i>{`  `}<span className='comment-count'>{comments.length}</span>
                            </Link>
                        </Fragment>)}
                        {auth && auth.user && !auth.loading && ((user === auth.user._id) || ( auth.user && auth.user.admin)) &&
                            <button type="button" className="btn btn-red" style={{float:'right'}} onClick={e => deletePost(_id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        }
                        {auth && auth.user && auth.user.admin && !approved &&
                            <button onClick={() => approvePost(_id)} className="btn btn-green">Approve</button>
                        }
                    </div>
                </div>
            </div>
        </Fragment>) :
        (<Fragment>
            <Spinner/>
        </Fragment>)}
        </Fragment>
    )
}

PostItem.propTypes = {
    post:PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    approvePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {deletePost, addLike, removeLike, approvePost})(PostItem)
