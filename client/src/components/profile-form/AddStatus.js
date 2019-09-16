import React, {useState, Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addStatus} from '../../actions/profile'

const AddStatus = ({addStatus, history}) => {

    const [formData, setFormData] = useState({
        semester:'',
        sgpa: 0.0,
        cgpa: 0.0
    });

    const {semester, sgpa, cgpa} = formData;


    const Changer = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const Submitter = e => {
        e.preventDefault();
        addStatus(formData, history);
    }

    return (
        <Fragment>
            <div className="profile-forms">
                <h1 className="heading">
                    Add Your Latest Semester Pointers
                </h1>
                <p className="lead">(as given on CRCE student portal)</p>

                <small>* = required field</small>
                <form className="form" onSubmit={e => Submitter(e)}>
                    <div className="form-group">
                        <input type="text" placeholder="Semester (eg: First, Second..)" name="semester" value={semester} onChange = {e => Changer(e)} required></input>
                    </div>
                    <div className="form-group">
                        <p>SGPA</p>
                        <input type="number" placeholder="SGPA (Current Semester)" name="sgpa" value={sgpa} onChange = {e => Changer(e)} required></input>
                    </div>

                    <input type="submit" className="btn btn-dark"></input>
                
                    <button className="btn btn-light"><Link to="/dashboard">Go Back</Link></button>
                </form>
            </div>
        </Fragment>
    )
}

AddStatus.propTypes = {
    addStatus: PropTypes.func.isRequired,
}

export default connect(null, {addStatus})(withRouter(AddStatus))