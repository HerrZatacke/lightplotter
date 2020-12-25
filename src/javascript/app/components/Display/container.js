import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  position: state.position,
});

const mapDispatchToProps = (dispatch) => ({
  setPosition: (x, y) => {
    dispatch({
      type: 'SET_POSITION',
      position: { x, y },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
