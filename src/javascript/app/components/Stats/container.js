import { connect } from 'react-redux';
import calculateStats from '../../../tools/calculateStats';

const mapStateToProps = (state) => ({
  stats: calculateStats(state.position, state.params),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
