import { connect } from 'react-redux';
import calculateStats from '../../../tools/calculateStats';

const mapStateToProps = (state) => ({
  stats: calculateStats(state.position, state.weight),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
