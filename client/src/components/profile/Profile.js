import React, {Fragment, useEffect, useState} from 'react';
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

const Profile = ({ getProfileById, getUserPosts, delAccount, delUser, profile, auth, match }) => {
    
    const [displayEducation, toggleEducation] = useState(false);
    const [displayStatus, toggleStatus] = useState(false);

    useEffect(() => {
        getUserPosts(match.params.id);
        getProfileById(match.params.id);
    },[getUserPosts, getProfileById])
    
    return (
        <Fragment>
            {profile.profile === null || profile.loading ? <Spinner/> : <Fragment>
                <div className="profile-grid">
                    <ProfileTop profile={profile.profile}/>
                    <div className="profile-buttons">
                        <button className="btn btn-light"><Link to="/profiles">Go Back</Link></button>
                        {auth.isAuthenticated && !auth.loading && auth.user._id === profile.profile.user._id && 
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
                            <button className="btn btn-gold">Follow</button>
                        </Fragment>)}
                    </div>
                    <ProfileAbout profile={profile.profile}/>


                    <h2 className="heading">Educational Qualifications{`  `}<i className="fa fa-university"></i>
                    {auth && auth.user._id === profile.profile.user._id && <button className="btn btn-light btn-icon" style={{display:'inline'}}><Link to="/add_education">
                        <i className="fa fa-plus"></i>
                    </Link></button>}
                    <button className="btn btn-light btn-icon" onClick={() => toggleEducation(!displayEducation)} style={{display:'inline'}}>
                        {!displayEducation && <i className="fa fa-angle-down"></i>}
                        {displayEducation && <i className="fa fa-angle-up"></i>}
                    </button></h2>
                    {displayEducation && <Education education = {profile.profile.education}/>}


                    <h2 className="heading">Academic Status{`  `}<i className="fa fa-graduation-cap"></i>
                    {auth.user._id === profile.profile.user._id && <button className="btn btn-light btn-icon" style={{display:'inline'}}><Link to="/add_status">
                        <i className="fa fa-plus"></i>
                    </Link></button>}
                    <button className="btn btn-light btn-icon" onClick={() => toggleStatus(!displayStatus)} style={{display:'inline'}}>
                        {!displayStatus && <i className="fa fa-angle-down"></i>}
                        {displayStatus && <i className="fa fa-angle-up"></i>}
                    </button></h2>
                    {displayStatus && !profile.loading && <Status user = {profile.profile.user} status = {profile.profile.status}/>}

                    
                    {auth.user && <UserPosts/>}
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
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect (mapStateToProps, { getUserPosts, getProfileById, delAccount, delUser })(Profile)