import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  position: state.position,
  params: state.params,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
