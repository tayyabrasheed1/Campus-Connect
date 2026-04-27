const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
};

export default Loader;
