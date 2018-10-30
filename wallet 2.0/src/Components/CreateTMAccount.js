import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setTMAccount } from '../Actions/tendermint.action';
import { createTMAccount } from '../Actions/createTM.action';
import { setTMConfig } from '../Utils/UserConfig';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

class CreateTMAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyName: '',
            keyPassword: '',
            openSnack: false,
            snackMessage: ''
        }
    }

    componentWillMount = () => {
        localStorage.setItem('tmAccount', null);
    }

    createAccount = () => {
        this.props.createTMAccount(this.state.keyName, this.state.keyPassword).then(res => {
            if (res.error) {
                this.setState({ openSnack: true, snackMessage: res.error.data })
            }
            else {
                setTMConfig(this.state.keyName);
                let data = {
                    name: res.payload.name,
                    type: res.payload.type,
                    address: res.payload.address,
                    pub_key: res.payload.pub_key
                }
                this.props.setTMAccount(data);
            }
        });
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={createAccountStyle.formStyle}>
            <div> <h2  style={createAccountStyle.createStyle}><center>Create a Wallet on Sentinel Tendermint TestNet (STT) #1</center></h2></div>
                <div style={createAccountStyle.secondDivStyle}>
                    <p style={createAccountStyle.headingStyle}>Account Name</p>
                    <CustomTextField type={'text'} placeholder={''} disabled={false} value={this.state.keyName}
                        onChange={(e) => { this.setState({ keyName: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Account Password</p>
                    <CustomTextField type={'password'} placeholder={''} disabled={false} value={this.state.keyPassword}
                        onChange={(e) => { this.setState({ keyPassword: e.target.value }) }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.createAccount() }}
                        className={classes.button} style={{ margin: 20, outline: 'none' }}>
                        Create Account
                    </Button>
                </div>
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
            </div>
        )
    }
}

CreateTMAccount.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        createTMAccount,
        setTMAccount
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(CreateTMAccount);