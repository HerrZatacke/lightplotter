import { connect } from 'react-redux';
import calculateStats from '../../../tools/calculateStats';

const mapStateToProps = (state) => ({
  stats: calculateStats(state.position, state.params),
  warnings: state.warnings,
  hasConnection: state.hasConnection,
  serverBusy: state.serverBusy,
  animationRunning: state.animationRunning,
});

const mapDispatchToProps = (dispatch) => ({
  run: () => {
    dispatch({
      type: 'SEND_START',
    });
  },
  stop: () => {
    dispatch({
      type: 'SEND_STOP',
    });
  },
  updateParam: (paramKey) => {
    dispatch({
      type: 'UPDATE_PARAM',
      paramKey,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
