const styles = theme => ({
  modal: {
    top: `50%`,
    left: `50%`,
    // di chuyển ra giữa màn hình
    transform: `translate(-50%,-50%)`,
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none"
  },
  header: {
    backgroundColor: '#0d47a1', //xanh nhạt
    color: theme.color.textColor,
    padding: theme.spacing(2),
    // ?
    display: "flex",
    // ?
    alignItems: "center",
    // ?
    justifyContent: "space-between"
  },
  title: {
    color: theme.color.textColor,
    fontSize: 25,
    textTransform: "capitalize"
  },
  content: {
    padding: theme.spacing(2)
  },
  icon: {
    cursor: "pointer",
    fontSize: 25
  }
});

export default styles;
