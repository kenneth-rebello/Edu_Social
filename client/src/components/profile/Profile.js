import React, {Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../layouts/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import UserPosts from './UserPosts';
import Education from './Education';
import Status from './Status';
import { getProfileById, delAccount } from '../../actions/profile';
import { getUserPosts } from '../../actions/post';
import { delUser } from '../../actions/admin'; 
import { followUser, unfollowUser } from '../../actions/auth';

const Profile = ({ getProfileById, getUserPosts, delAccount, followUser, unfollowUser, delUser, profile, auth, match }) => {
    
    useEffect(() => {
        window.$('.collapsible').collapsible();
    })

    useEffect(() => {
        profile.profile && profile.profile.user && (document.title = `${profile.profile.user.name}`)
    },[profile]);

    useEffect(() => {
        getUserPosts(match.params.id);
        getProfileById(match.params.id);
    },[getUserPosts, getProfileById, match])
    
    return (
        <Fragment>
            {profile.profile === null || profile.loading ? <Spinner/> : <Fragment>
                <div className="profile-page">
                    <ProfileTop profile={profile.profile}/>
                    <div className="profile-buttons">
                        {auth.isAuthenticated && !profile.loading && !auth.loading && auth.user && auth.user._id === profile.profile.user._id && 
                        (<Fragment>
                            <button className="btn btn-dark"><Link to="/edit_profile">
                                {` `}<i className="fa fa-pencil"></i>Edit Profile
                            </Link></button>
                            <button className="btn btn-red" onClick={() => delAccount()}>
                                <i className="fa fa-warning"></i>{`  `}Delete Account
                            </button>
                        </Fragment>)}
                        {!auth.loading && auth.user.admin && !profile.loading && profile.profile.user &&
                            <button className="btn btn-red" onClick={()=> delUser(profile.profile._id)}>
                                <Link to="/admindash">Delete User</Link>
                            </button>}
                        {auth.isAuthenticated && !auth.loading && auth.user._id !== profile.profile.user._id &&
                        (<Fragment>
                            { !auth.loading && auth.user.following.some(one => one._id === profile.profile._id) ? <button className="btn btn-light" onClick={() => unfollowUser(profile.profile._id)}>
                                    Unfollow
                                </button> :
                                <button className="btn btn-gold" onClick={() => followUser(profile.profile._id)}>
                                    Follow
                                </button> }
                        </Fragment>)}
                        {auth && auth.user && <button className="btn btn-dark"><Link to={`/following/${profile.profile.user._id}`}>
                            Following
                        </Link></button>}
                    </div>
                    <ProfileAbout profile={profile.profile} auth={auth}/>


                    <ul class="collapsible">
                        <li>
                            <div className="collapsible-header heading">Educational Qualifications{`  `}<i className="fa fa-university"></i>
                                {!auth.loading && auth.user._id === profile.profile.user._id && 
                                <button className="btn btn-light btn-icon" style={{display:'inline'}}>
                                <Link to="/add_education">
                                    <i className="fa fa-plus"></i>
                                </Link></button>}
                            </div>  
                            <div className="collapsible-body">
                                <Education education = {profile.profile.education}/>
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header">
                                <h2 className="heading">Academic Status{`  `}<i className="fa fa-graduation-cap"></i>
                                {!auth.loading && auth.user._id === profile.profile.user._id && <button className="btn btn-light btn-icon" style={{display:'inline'}}><Link to="/add_status">
                                    <i className="fa fa-plus"></i>
                                </Link></button>}</h2>
                            </div>
                            <div className="collapsible-body">
                                <Status user = {profile.profile.user} status = {profile.profile.status}/>
                            </div>
                        </li>
                    </ul>
                    
                    {!auth.loading && auth.user && auth.user.approved && <UserPosts/>}
                </div>
            </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    getUserPosts: PropTypes.func.isRequired,
    delAccount: PropTypes.func.isRequired,
    delUser: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect (mapStateToProps, { getUserPosts, getProfileById, delAccount, delUser, followUser, unfollowUser })(Profile)