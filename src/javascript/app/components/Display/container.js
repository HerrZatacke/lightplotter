import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  position: state.position,
  params: state.params,
  points: state.points,
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
