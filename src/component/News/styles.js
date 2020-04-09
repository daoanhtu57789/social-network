const styles = (theme) => ({
  root: {
    width: "500px",
    margin: "1em auto",
  },

  expand: {
    transform: "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(0deg)",
  },
  avatar: {
    backgroundColor: "red",
  },
  input: {
    width: "97%",
    border: "2px solid #CCCCCC",
    borderRadius: "25px",
  },
  button: {
    backgroundColor: "#FFFFFF",
  },
  comment: {
    width: "97%",
    border: "2px solid #CCCCCC",
    borderRadius: "25px",
    padding: "0.2em 0em",
    margin: "0.3em 0em",
  },
  line: {
    border: "1px solid #CCCCCC",
    margin: " 0.5em 0em 1.5em -1.2em",
    width: "500px",
  },
});

export default styles;
