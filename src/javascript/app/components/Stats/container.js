import { connect } from 'react-redux';
import calculateStats from '../../../tools/calculateStats';

const mapStateToProps = (state) => ({
  stats: calculateStats(state.position, state.params),
});

const mapDispatchToProps = (dispatch) => ({
  run: () => {
    dispatch({
      type: 'RUN',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
