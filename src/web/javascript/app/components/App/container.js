import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  hasParams: !!state.params,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
