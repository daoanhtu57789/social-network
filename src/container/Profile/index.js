import React, { Component } from "react";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
//material
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Grid, Button, Avatar } from "@material-ui/core";
//icon
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0,
    };
  }
  //chọn ảnh
  handleChangeFile = (event) => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={2} style={{ marginTop: "70px" }}>
        <Grid item md={2} xs={12}></Grid>
        <Grid item md={3} xs={12}>
          <Container fixed>
            <Avatar
              style={{ width: "100%", height: "100%" }}
              src="https://lh3.googleusercontent.com/proxy/GI-s16ICownwsHCn-PXsx8RDQWNRevw6Kh12PI4R1sQ9HlcIeWFubu9rBuZt9wI98iJ2hFOnno-BcmeO75W1tK6p_JfdBsdRwJG2kJUERyEGeVjHYqz3c0jZ4cU5E7pQzZJZpK9zVEGArN_-dqlfjNkMzUJDX3x3zueGJCAwN9VR3gu2fYgjP8TNCTGCwdnkXtUofLTk4xznBuFP6gr3GE2dVw"
            />

            <Grid container>
              <Grid item md={3} xs={6}></Grid>
              <Grid item md={2} xs={6}>
                <div style={{marginLeft:"40px"}}>
                  <input
                    className={classes.input}
                    id="icon-button-file"
                    type="file"
                    onChange={this.handleChangeFile}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"

                    >
                      <PhotoCamera fontSize="large" />
                    </IconButton>
                  </label>
                </div>

                <div>
                  <progress
                    value={this.state.progress}
                    max="100"
                    style={{ height: "20px" }}
                  />
                </div>
              </Grid>
              <Grid item md={1} xs={6}></Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ width: "100%", marginLeft: "auto" }}
              size="small"
              type="button"
            >
              <CloudUploadIcon fontSize="small" />
              Lưu
            </Button>
          </Container>
        </Grid>
        <Grid item md={5} xs={12}>
          đây là phần thông tin
        </Grid>
        <Grid item md={2} xs={12}></Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Profile);
