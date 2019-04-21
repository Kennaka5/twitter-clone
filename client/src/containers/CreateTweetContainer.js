import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createTweet } from '../utils/api';
import CreateTweetModal from '../components/createTweetModal/CreateTweetModal';
import { connect } from 'react-redux';
import { closeCreateTweetModal } from '../actions/uiActions';

class CreateTweetContainer extends Component {
  state = {
    text: '',
    errors: {},
    loading: false
  };

  handleChange = e => {
    const { value } = e.target;
    this.setState(() => ({
      text: value
    }));
  };

  handleErrors = errors => {
    this.setState(() => ({ errors, loading: false }));
  };

  validateTweet = tweet => {
    const { text } = tweet;
    if (text.length < 2 || text.length > 140) {
      this.setState(() => ({
        errors: {
          text: 'Tweet text length must be between 2 and 140 characters'
        }
      }));

      return false;
    }

    return true;
  };

  handleSubmit = e => {
    e.preventDefault();
    const tweet = {
      text: this.state.text
    };

    if (!this.validateTweet(tweet)) {
      return false;
    }

    this.setState(() => ({ loading: true }));

    createTweet(
      tweet,
      () => {
        // this.setState(() => ({
        //   loading: false
        // }));
        this.props.closeCreateTweetModal();
      },
      this.handleErrors
    );
  };

  render() {
    const { text, errors, loading } = this.state;
    const { showCreateTweetModal, closeCreateTweetModal } = this.props;
    // const { from } = this.props.location.state || { from: { pathname: '/' } };

    // if (redirectToReferrer) {
    //   return <Redirect to={from} />;
    // }

    return (
      <CreateTweetModal
        text={text}
        errors={errors}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        loading={loading}
        showModal={showCreateTweetModal}
        handleCloseModal={closeCreateTweetModal}
      />
    );
  }
}

CreateTweetContainer.propTypes = {
  showCreateTweetModal: PropTypes.bool.isRequired,
  closeCreateTweetModal: PropTypes.func.isRequired
};

const mapStateToProps = ({ UI }) => ({
  showCreateTweetModal: UI.showCreateTweetModal
});

export default connect(
  mapStateToProps,
  { closeCreateTweetModal }
)(CreateTweetContainer);
